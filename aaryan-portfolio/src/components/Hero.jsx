import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { site } from '../config/site';
import Artifact from './art/Artifact';
import ParticleField from './ParticleField';

function Chars({ text }) {
  return Array.from(text).map((c, i) => (
    // eslint-disable-next-line react/no-array-index-key
    <span className="ch" key={`${c}-${i}`}>
      {c}
    </span>
  ));
}

export default function Hero() {
  const root = useRef(null);
  const art = useRef(null);
  const tilt = useRef(null);
  const progress = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  useLayoutEffect(() => {
    const el = root.current;
    const q = gsap.utils.selector(el);
    const mm = gsap.matchMedia();

    mm.add(
      {
        reduce: '(prefers-reduced-motion: reduce)',
        small: '(max-width: 720px)',
        fine: '(hover: hover) and (pointer: fine)',
      },
      (ctx) => {
        const { reduce, small, fine } = ctx.conditions;
        if (reduce) {
          progress.current = 0.3;
          return undefined;
        }

        el.classList.add('is-intro');

        const chars = q('.ch');
        const lines = q('.hero__line');
        const planes = q('.plane');
        const total = 10;

        /* Opening: the name is lifted out of a mask, then the mask is released so letters can move in depth. */
        gsap
          .timeline({
            defaults: { ease: 'expo.out' },
            onComplete: () => el.classList.remove('is-intro'),
          })
          .from(chars, { yPercent: 112, duration: 1.5, stagger: 0.05 }, 0.25)
          .from(q('.hero__intro > *'), { autoAlpha: 0, y: 18, duration: 1, stagger: 0.12, ease: 'power3.out' }, 1)
          .from(q('.hero__cue-text, .hero__cue-line'), { autoAlpha: 0, duration: 1 }, 1.6);

        /* Scroll film: one scrubbed timeline, 10 units long, normalised to the hero's scroll distance. */
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: el,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.7,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              progress.current = self.progress;
            },
          },
        });

        // 1. The artwork emerges from darkness, lit by a violet glow.
        tl.fromTo(art.current, { autoAlpha: 0.14 }, { autoAlpha: 1, duration: 2.6 }, 0)
          .fromTo(q('.hero__glow'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1.1, duration: 4 }, 0)
          .to(q('.hero__glow'), { autoAlpha: 0, scale: 2.2, duration: 2 }, 8);

        // 2. The object turns toward the viewer, then shifts in perspective, then the camera passes through it.
        const artifact = q('.artifact');
        tl.fromTo(
          artifact,
          { rotationX: 62, rotationZ: -42, scale: small ? 0.7 : 0.8 },
          { rotationX: 46, rotationZ: 6, scale: small ? 0.95 : 1.04, duration: 6.5 },
          0,
        )
          .to(artifact, { rotationX: 22, rotationZ: 34, duration: 2.2 }, 6.5)
          .to(artifact, { scale: small ? 3 : 3.6, duration: 1.6, ease: 'power2.in' }, 8.4)
          .to(art.current, { autoAlpha: 0, duration: 1.2 }, 8.8);

        // 3. Its layers separate in depth, fan sideways, then spread apart as we fly through.
        const gap = small ? 64 : 110;
        planes.forEach((p, i) => {
          const k = i - 2;
          tl.fromTo(p, { z: k * 5 }, { z: k * gap, duration: 5.5 }, 0.4)
            .to(p, { x: k * (small ? 14 : 34), rotation: (i % 2 ? 1 : -1) * i * 4, duration: 2.2 }, 6.5)
            .to(p, { z: k * gap * 2.4, duration: 1.6, ease: 'power2.in' }, 8.4);
        });

        // 4. The gauge needle sweeps with the scroll.
        tl.fromTo(q('.needle'), { rotation: -128, svgOrigin: '200 200' }, { rotation: 96, svgOrigin: '200 200', duration: 8.4 }, 0.2);

        // 5. The name drains into a violet outline, drifts apart, and lifts away.
        tl.fromTo(chars, { '--fill': 1 }, { '--fill': 0, duration: 2.2, stagger: 0.12 }, 2.4)
          .to(chars, { z: (i) => ((i * 7) % 5 - 2) * 60, duration: 3.2, stagger: 0.04 }, 3.2)
          .to(lines[0], { xPercent: -3, duration: 6 }, 2)
          .to(lines[1], { xPercent: 4, duration: 6 }, 2)
          .to(q('.hero__name'), { yPercent: -30, autoAlpha: 0, duration: 2, ease: 'power1.in' }, 7.4)
          .to(q('.hero__intro'), { autoAlpha: 0, y: -30, duration: 1.4 }, 1.8)
          .to(q('.hero__cue'), { autoAlpha: 0, duration: 0.6 }, 0.4);

        // 6. The final layer thins into the rule that opens the Work section.
        tl.fromTo(q('.hero__rule'), { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, 8.4)
          .fromTo(q('.hero__progress i'), { scaleY: 0 }, { scaleY: 1, duration: total }, 0)
          .set({}, {}, total);

        // Pointer response: the whole object leans toward the cursor, particles drift with it.
        if (!fine) return undefined;
        const rx = gsap.quickTo(tilt.current, 'rotationX', { duration: 0.9, ease: 'power3' });
        const ry = gsap.quickTo(tilt.current, 'rotationY', { duration: 0.9, ease: 'power3' });
        const onMove = (e) => {
          const nx = e.clientX / window.innerWidth - 0.5;
          const ny = e.clientY / window.innerHeight - 0.5;
          pointer.current.x = nx;
          pointer.current.y = ny;
          ry(nx * 14);
          rx(-ny * 10);
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => window.removeEventListener('pointermove', onMove);
      },
    );

    return () => {
      mm.revert();
      el.classList.remove('is-intro');
    };
  }, []);

  return (
    <section id="home" ref={root} className="hero" aria-label="Introduction">
      <div className="hero__stage">
        <ParticleField progressRef={progress} pointerRef={pointer} anchorRef={art} />
        <div className="hero__glow" aria-hidden="true" />

        <div className="hero__art" ref={art} aria-hidden="true">
          <div className="artifact-tilt" ref={tilt}>
            <Artifact />
          </div>
        </div>

        <div className="hero__intro">
          <p className="hero__role">{site.role}</p>
          <p className="hero__lede">{site.intro}</p>
        </div>

        <h1 className="hero__name" aria-label={site.name}>
          <span className="hero__line" aria-hidden="true">
            <Chars text={site.first} />
          </span>
          <span className="hero__line" aria-hidden="true">
            <Chars text={site.last} />
          </span>
        </h1>

        <div className="hero__cue" aria-hidden="true">
          <span className="hero__cue-text">Scroll</span>
          <span className="hero__cue-line" />
        </div>
        <div className="hero__progress" aria-hidden="true">
          <i />
        </div>
        <div className="hero__rule" aria-hidden="true" />
      </div>
    </section>
  );
}
