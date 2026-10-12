import { useEffect } from 'react';
import { gsap } from '../lib/gsap';

/**
 * Pulls `innerRef` toward the pointer while it is inside `wrapRef`.
 * The wrapper is static (it owns the hit area); only the inner element moves.
 * Disabled for touch and reduced-motion users.
 */
export default function useMagnetic(wrapRef, innerRef, strength = 0.35) {
  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return undefined;
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return undefined;

    const xTo = gsap.quickTo(inner, 'x', { duration: 0.6, ease: 'power3' });
    const yTo = gsap.quickTo(inner, 'y', { duration: 0.6, ease: 'power3' });

    const onMove = (e) => {
      const r = wrap.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    wrap.addEventListener('pointermove', onMove);
    wrap.addEventListener('pointerleave', onLeave);
    return () => {
      wrap.removeEventListener('pointermove', onMove);
      wrap.removeEventListener('pointerleave', onLeave);
      gsap.killTweensOf(inner);
      gsap.set(inner, { clearProps: 'transform' });
    };
  }, [wrapRef, innerRef, strength]);
}
