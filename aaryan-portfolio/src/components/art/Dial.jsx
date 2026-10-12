import { useId } from 'react';
import { arcPath, polar } from '../../utils/geometry';

const START = -225;
const SWEEP = 270;

/**
 * An instrument-cluster dial: 61 ticks over a 270 degree sweep, a track and a value arc.
 * Used as the hero's gauge plane (with a needle) and as the contact backdrop (without).
 */
export default function Dial({ needle = false, value = 0.62, className }) {
  const gid = `dialGlow${useId().replace(/:/g, '')}`;
  const ticks = [];
  for (let i = 0; i <= 60; i += 1) {
    const a = START + (i * SWEEP) / 60;
    const major = i % 5 === 0;
    const [x0, y0] = polar(200, 200, major ? 130 : 141, a);
    const [x1, y1] = polar(200, 200, 152, a);
    ticks.push(
      <line
        key={i}
        x1={x0.toFixed(2)}
        y1={y0.toFixed(2)}
        x2={x1.toFixed(2)}
        y2={y1.toFixed(2)}
        className="st-i"
        strokeWidth={major ? 1.6 : 1}
        strokeOpacity={major ? 0.8 : 0.35}
      />,
    );
  }

  return (
    <svg className={className} viewBox="0 0 400 400" width="100%" height="100%" aria-hidden="true">
      <defs>
        <radialGradient id={gid} cx="50%" cy="50%" r="50%">
          <stop offset="0%" style={{ stopColor: 'var(--accent)', stopOpacity: 0.22 }} />
          <stop offset="70%" style={{ stopColor: 'var(--accent)', stopOpacity: 0.04 }} />
          <stop offset="100%" style={{ stopColor: 'var(--accent)', stopOpacity: 0 }} />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="158" fill={`url(#${gid})`} />
      {ticks}
      <path d={arcPath(200, 200, 112, START, START + SWEEP)} className="nf st-i" strokeWidth="10" strokeOpacity="0.1" />
      <path d={arcPath(200, 200, 112, START, START + SWEEP * value)} className="nf st-a" strokeWidth="10" />
      <circle cx="200" cy="200" r="64" className="nf st-i" strokeOpacity="0.16" />
      {needle && (
        <g className="needle" transform="rotate(40 200 200)">
          <line x1="200" y1="214" x2="200" y2="92" className="st-i" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="200" y1="92" x2="200" y2="120" className="st-a" strokeWidth="4" strokeLinecap="round" />
        </g>
      )}
      <circle cx="200" cy="200" r="9" className="fl-0 st-a" strokeWidth="2" />
    </svg>
  );
}
