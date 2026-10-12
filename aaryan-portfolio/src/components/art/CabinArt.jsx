import { arcPath, polar } from '../../utils/geometry';

/* Cabin Dial: a handheld companion screen with one primary reading and quiet detail rows. */
export default function CabinArt() {
  const ticks = [];
  for (let i = 0; i <= 36; i += 1) {
    const a = -200 + (i * 220) / 36;
    const [x0, y0] = polar(225, 230, i % 6 === 0 ? 92 : 98, a);
    const [x1, y1] = polar(225, 230, 106, a);
    ticks.push(<line key={i} x1={x0} y1={y0} x2={x1} y2={y1} className="st-i" strokeOpacity={i % 6 === 0 ? 0.8 : 0.3} />);
  }
  return (
    <svg className="plate__art" viewBox="0 0 500 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect x="150" y="76" width="270" height="520" rx="40" className="nf st-i" strokeOpacity="0.14" />
      <rect x="90" y="40" width="270" height="520" rx="40" className="fl-0 st-i" fillOpacity="0.7" strokeOpacity="0.5" />
      <rect x="190" y="56" width="70" height="14" rx="7" className="st-i" strokeOpacity="0.4" fill="none" />

      <g>
        {ticks}
        <path d={arcPath(225, 230, 78, -200, 20)} className="nf st-i" strokeWidth="8" strokeOpacity="0.1" />
        <g className="art-accent">
          <path d={arcPath(225, 230, 78, -200, -62)} className="nf st-a" strokeWidth="8" />
        </g>
        <line x1="225" y1="236" x2="262" y2="190" className="st-i" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="225" cy="236" r="7" className="fl-0 st-a" strokeWidth="2" />
      </g>

      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect
            x="116"
            y={360 + i * 64}
            width="218"
            height="50"
            rx="14"
            className={i === 0 ? 'fl-a st-a' : 'nf st-i'}
            fillOpacity={i === 0 ? 0.14 : 0}
            strokeOpacity={i === 0 ? 0.9 : 0.2}
          />
          <circle cx="142" cy={385 + i * 64} r="8" className={i === 0 ? 'fl-a' : 'fl-i'} fillOpacity={i === 0 ? 1 : 0.4} />
          <line x1="162" y1={385 + i * 64} x2={230 + i * 20} y2={385 + i * 64} className="st-i" strokeWidth="3" strokeOpacity="0.5" />
        </g>
      ))}
    </svg>
  );
}
