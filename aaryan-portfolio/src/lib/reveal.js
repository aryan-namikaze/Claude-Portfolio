import { gsap } from './gsap';

/**
 * Masked line reveal. Expects markup like
 * <el><span class="mask"><span class="rv">Line</span></span>...</el>
 * Plays when the element enters and reverses when scrolled back above it.
 */
export function revealLines(scope, selector, { start = 'top 86%', stagger = 0.09, duration = 1.25 } = {}) {
  gsap.utils.toArray(selector, scope).forEach((el) => {
    const items = el.querySelectorAll('.rv');
    if (!items.length) return;
    gsap.from(items, {
      yPercent: 118,
      duration,
      ease: 'expo.out',
      stagger,
      scrollTrigger: { trigger: el, start, toggleActions: 'play none none reverse' },
    });
  });
}
