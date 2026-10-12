import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { revealLines } from '../lib/reveal';
import { site } from '../config/site';

export default function About() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const scope = root.current;

      // The bio reads itself in as you scroll: each word moves from dim to full white.
      gsap.fromTo(
        gsap.utils.toArray('.w', scope),
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: 'none',
          duration: 1,
          stagger: 0.12,
          scrollTrigger: { trigger: '.about__statement', start: 'top 82%', end: 'bottom 48%', scrub: true },
        },
      );

      gsap.fromTo(
        '.about__years',
        { yPercent: 12 },
        {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: { trigger: scope, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      );

      revealLines(scope, '.about__col', { stagger: 0.06, start: 'top 88%' });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="about" ref={root} className="about" aria-labelledby="about-title">
      <h2 className="sr-only" id="about-title">
        About
      </h2>

      <p className="about__years" aria-hidden="true">
        3+
      </p>

      <div className="about__statement">
        {site.bio.map((sentence) => (
          <p key={sentence}>
            {sentence.split(' ').map((word, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <span className="w" key={`${word}-${i}`}>
                {word}{' '}
              </span>
            ))}
          </p>
        ))}
      </div>

      <div className="about__meta">
        <p className="about__exp">
          <span className="mask">
            <span className="rv">More than three years of product design practice.</span>
          </span>
        </p>

        <div className="about__col">
          <h3 className="mask">
            <span className="rv">Focus</span>
          </h3>
          <ul>
            {site.focus.map((item) => (
              <li key={item}>
                <span className="mask">
                  <span className="rv">{item}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="about__col">
          <h3 className="mask">
            <span className="rv">Work</span>
          </h3>
          <ul>
            {site.work.map((item) => (
              <li key={item}>
                <span className="mask">
                  <span className="rv">{item}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
