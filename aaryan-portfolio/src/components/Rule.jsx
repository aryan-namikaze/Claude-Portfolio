import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

// A violet hairline that draws itself across the screen as it enters.
export default function Rule() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        ref.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: ref.current, start: 'top 96%', end: 'top 55%', scrub: true },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return <div ref={ref} className="rule" aria-hidden="true" />;
}
