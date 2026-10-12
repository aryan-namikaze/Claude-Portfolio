import { mulberry32 } from '../../utils/rng';
import Contours from './Contours';
import Dial from './Dial';

const SVG_PROPS = { viewBox: '0 0 400 400', width: '100%', height: '100%', 'aria-hidden': 'true' };

/* 0. A dot field that swells toward the middle, the "canvas" the rest sits on. */
function PlaneGrid() {
  const dots = [];
  const n = 21;
  const gap = 18;
  const origin = 20;
  for (let iy = 0; iy < n; iy += 1) {
    for (let ix = 0; ix < n; ix += 1) {
      const x = origin + ix * gap;
      const y = origin + iy * gap;
      const d = Math.min(Math.hypot(x - 200, y - 200) / (Math.SQRT2 * 180), 1);
      dots.push(
        <circle
          key={`${ix}-${iy}`}
          cx={x}
          cy={y}
          r={(0.5 + 1.7 * (1 - d) ** 2).toFixed(2)}
          className="fl-i"
          fillOpacity={(0.12 + 0.5 * (1 - d)).toFixed(2)}
        />,
      );
    }
  }
  return (
    <svg {...SVG_PROPS}>
      {dots}
      <rect x="0.5" y="0.5" width="399" height="399" className="nf st-i" strokeOpacity="0.22" />
    </svg>
  );
}

/* 1. Contour lines of a sweeping automotive profile. */
function PlaneContour() {
  return (
    <svg {...SVG_PROPS}>
      <Contours
        d="M20 250 C 70 250 95 168 165 160 S 255 120 300 160 S 355 232 382 240"
        count={13}
        step={9}
        offset={-30}
        highlight={6}
      />
    </svg>
  );
}

/* 2. Pixel structures: cells fill in toward one corner, like a design resolving into pixels. */
function PlanePixels() {
  const rnd = mulberry32(11);
  const cells = [];
  const n = 14;
  const size = 20;
  const gap = 8;
  const origin = 8;
  for (let iy = 0; iy < n; iy += 1) {
    for (let ix = 0; ix < n; ix += 1) {
      const weight = ((ix + iy) / (2 * (n - 1))) ** 1.25;
      const v = rnd() * 0.55 + weight * 0.75;
      if (v < 0.62) continue;
      const ink = v > 1.18;
      cells.push(
        <rect
          key={`${ix}-${iy}`}
          x={origin + ix * (size + gap)}
          y={origin + iy * (size + gap)}
          width={size}
          height={size}
          className={ink ? 'fl-i' : 'fl-a'}
          fillOpacity={Math.min(0.3 + (v - 0.62) * 1.1, 1).toFixed(2)}
        />,
      );
    }
  }
  return <svg {...SVG_PROPS}>{cells}</svg>;
}

/* 3. The instrument dial. Its needle is driven by scroll progress. */
function PlaneGauge() {
  return <Dial needle />;
}

/* 4. Registration marks: the fine-line layer that makes it read as a drafted object. */
function PlaneFrame() {
  const corner = (x, y, sx, sy) => `M${x} ${y + sy * 30} L${x} ${y} L${x + sx * 30} ${y}`;
  return (
    <svg {...SVG_PROPS}>
      <rect x="12" y="12" width="376" height="376" className="nf st-a" strokeOpacity="0.35" />
      <path d={corner(4, 4, 1, 1)} className="nf st-i" strokeWidth="1.5" />
      <path d={corner(396, 4, -1, 1)} className="nf st-i" strokeWidth="1.5" />
      <path d={corner(4, 396, 1, -1)} className="nf st-i" strokeWidth="1.5" />
      <path d={corner(396, 396, -1, -1)} className="nf st-i" strokeWidth="1.5" />
      <line x1="200" y1="0" x2="200" y2="22" className="st-i" strokeOpacity="0.6" />
      <line x1="200" y1="378" x2="200" y2="400" className="st-i" strokeOpacity="0.6" />
      <line x1="0" y1="200" x2="22" y2="200" className="st-i" strokeOpacity="0.6" />
      <line x1="378" y1="200" x2="400" y2="200" className="st-i" strokeOpacity="0.6" />
      <rect x="296" y="96" width="8" height="8" className="fl-a" />
      <rect x="290" y="90" width="20" height="20" className="nf st-a" strokeOpacity="0.5" />
    </svg>
  );
}

const PLANES = [PlaneGrid, PlaneContour, PlanePixels, PlaneGauge, PlaneFrame];

/**
 * Five layers of one object, stacked in CSS 3D.
 * Hero.jsx separates, rotates and finally flies through them on scroll.
 */
export default function Artifact() {
  return (
    <div className="artifact">
      {PLANES.map((Plane, i) => (
        <div className={`plane plane--${i}`} style={{ '--i': i }} key={i}>
          <Plane />
        </div>
      ))}
    </div>
  );
}
