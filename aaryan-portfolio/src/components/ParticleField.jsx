import { useEffect, useRef } from 'react';
import { mulberry32 } from '../utils/rng';

const VIOLET = 'rgb(150,101,255)';
const INK = 'rgb(245,243,238)';
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = (a, b, v) => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

/**
 * Square "pixel" particles in a 3D shell around the artifact, drawn on a single canvas.
 * progressRef (0..1) is the hero's scroll progress: the shell spins faster and expands as you scroll.
 * Only runs while visible; renders one still frame under reduced motion.
 */
export default function ParticleField({ progressRef, pointerRef, anchorRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return undefined;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const small = window.matchMedia('(max-width: 720px)').matches;
    const COUNT = small ? 170 : 520;

    const rnd = mulberry32(20240611);
    const pts = Array.from({ length: COUNT }, () => {
      const theta = rnd() * Math.PI * 2;
      const phi = Math.acos(2 * rnd() - 1);
      const r = 0.55 + rnd() ** 0.6 * 0.75;
      return {
        x: Math.sin(phi) * Math.cos(theta) * r,
        y: Math.cos(phi) * r * 0.8,
        z: Math.sin(phi) * Math.sin(theta) * r,
        s: 0.7 + rnd() * 1.7,
        ink: rnd() > 0.82,
      };
    });
    const sx = new Float32Array(COUNT);
    const sy = new Float32Array(COUNT);
    const sa = new Float32Array(COUNT);
    const ss = new Float32Array(COUNT);

    let w = 0;
    let h = 0;
    let dpr = 1;
    let cx = 0;
    let cy = 0;
    let R = 300;
    let px = 0;
    let py = 0;
    let raf = 0;
    let running = false;

    // projection scratch values, reused to avoid per-point allocation
    let _x = 0;
    let _y = 0;
    let _k = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      const a = anchorRef.current?.getBoundingClientRect();
      if (a && a.width) {
        cx = a.left - rect.left + a.width / 2;
        cy = a.top - rect.top + a.height / 2;
        R = a.width * 0.95;
      } else {
        cx = w / 2;
        cy = h / 2;
        R = Math.min(w, h) * 0.5;
      }
    };

    const draw = (t) => {
      const p = progressRef.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const target = pointerRef.current;
      px += (target.x - px) * 0.05;
      py += (target.y - py) * 0.05;

      const spin = t * 0.00009 + p * 2.4;
      const tiltX = 0.5 + p * 0.45;
      const cosY = Math.cos(spin);
      const sinY = Math.sin(spin);
      const cosX = Math.cos(tiltX);
      const sinX = Math.sin(tiltX);
      const spread = 1 + p * 1.5;
      const fov = R * 3;
      const master = (0.3 + 0.7 * smooth(0.02, 0.3, p)) * (1 - smooth(0.82, 1, p));

      const project = (x, y, z) => {
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        const y1 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;
        _k = fov / (fov + z2);
        _x = cx + x1 * _k + px * 40 * _k;
        _y = cy + y1 * _k + py * 28 * _k;
      };

      // two faint orbit lines: the "fine lines" of the opening scene
      ctx.lineWidth = 1;
      ctx.strokeStyle = VIOLET;
      [
        [1.18, 0.0],
        [1.5, 0.7],
      ].forEach(([rf, tilt]) => {
        ctx.globalAlpha = 0.16 * master;
        ctx.beginPath();
        for (let i = 0; i <= 96; i += 1) {
          const a = (i / 96) * Math.PI * 2;
          const x = Math.cos(a) * R * rf * spread * 0.5;
          const z0 = Math.sin(a) * R * rf * spread * 0.5;
          project(x, z0 * Math.sin(tilt), z0 * Math.cos(tilt));
          if (i === 0) ctx.moveTo(_x, _y);
          else ctx.lineTo(_x, _y);
        }
        ctx.stroke();
      });

      for (let i = 0; i < COUNT; i += 1) {
        const pt = pts[i];
        project(pt.x * R * 0.6 * spread, pt.y * R * 0.6 * spread, pt.z * R * 0.6 * spread);
        sx[i] = _x;
        sy[i] = _y;
        ss[i] = pt.s * _k * (small ? 1.3 : 1.7);
        sa[i] = clamp((_k - 0.62) * 1.7, 0.08, 1) * master;
      }

      [false, true].forEach((isInk) => {
        ctx.fillStyle = isInk ? INK : VIOLET;
        for (let i = 0; i < COUNT; i += 1) {
          if (pts[i].ink !== isInk) continue;
          ctx.globalAlpha = sa[i] * (isInk ? 0.7 : 0.95);
          const s = ss[i];
          ctx.fillRect(sx[i] - s / 2, sy[i] - s / 2, s, s);
        }
      });
      ctx.globalAlpha = 1;
    };

    const loop = (t) => {
      if (!running) return;
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    if (reduce) draw(4000);

    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()));
    io.observe(canvas);
    const ro = new ResizeObserver(() => {
      resize();
      if (reduce) draw(4000);
    });
    ro.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
    };
  }, [progressRef, pointerRef, anchorRef]);

  return <canvas ref={canvasRef} className="hero__canvas" aria-hidden="true" />;
}
