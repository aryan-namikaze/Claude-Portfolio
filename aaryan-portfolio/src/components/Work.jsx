import { useLayoutEffect, useRef } from 'react';
import { gsap } from '../lib/gsap';
import { revealLines } from '../lib/reveal';
import { projects } from '../config/projects';
import Lines from './Lines';
import Plate from './Plate';
import FleetArt from './art/FleetArt';
import ShowroomArt from './art/ShowroomArt';
import CabinArt from './art/CabinArt';
import SystemArt from './art/SystemArt';

const ART = { fleet: FleetArt, showroom: ShowroomArt, cabin: CabinArt, system: SystemArt };

export default function Work() {
  const root = useRef(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const scope = root.current;
      revealLines(scope, '.work__title');
      revealLines(scope, '.work__lede', { stagger: 0 });

      gsap.utils.toArray('.plate', scope).forEach((plate) => {
        const frame = plate.querySelector('.plate__frame');
        const art = plate.querySelector('.plate__art');
        const drift = plate.querySelector('.plate__drift');
        const enter = { trigger: plate, start: 'top 94%', end: 'top 40%', scrub: true };

        // The frame opens like an aperture while its artwork settles from a close crop.
        gsap.fromTo(
          frame,
          { clipPath: 'inset(24% 16% 24% 16%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: enter },
        );
        gsap.fromTo(art, { scale: 1.45 }, { scale: 1, ease: 'none', scrollTrigger: enter });

        // Depth: the artwork drifts against the frame for the whole pass.
        gsap.fromTo(
          drift,
          { yPercent: 5 },
          {
            yPercent: -5,
            ease: 'none',
            scrollTrigger: { trigger: plate, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );

        gsap.from(plate.querySelectorAll('.plate__text > .mask > .rv'), {
          yPercent: 118,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.07,
          scrollTrigger: { trigger: plate, start: 'top 62%', toggleActions: 'play none none reverse' },
        });
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section id="work" ref={root} className="work" aria-labelledby="work-title">
      <header className="work__head">
        <h2 className="work__title" id="work-title">
          <Lines lines={['Selected', 'work']} />
        </h2>
        <p className="work__lede">
          <span className="mask">
            <span className="rv">
              Four concept studies, one for each part of my practice. They are original explorations, not client work.
            </span>
          </span>
        </p>
      </header>

      {projects.map((project) => {
        const Art = ART[project.art];
        return (
          <Plate key={project.id} project={project}>
            <Art />
          </Plate>
        );
      })}
    </section>
  );
}
