import { useEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';

// A single restrained ring that trails the pointer and swells over interactive elements.
// Fine pointers only; the native cursor stays visible and touch devices never see it.
export default function Cursor() {
  const ring = useRef(null);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return undefined;

    const el = ring.current;
    gsap.set(el, { xPercent: -50, yPercent: -50 });
    const xTo = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3' });

    const onMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
      el.classList.add('is-on');
    };
    const onOver = (e) => {
      el.classList.toggle('is-active', Boolean(e.target.closest?.('a, button, [data-cursor]')));
    };
    const onLeave = () => el.classList.remove('is-on');

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(el);
    };
  }, []);

  return <div className="cursor" ref={ring} aria-hidden="true" />;
}
