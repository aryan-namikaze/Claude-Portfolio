/* Torque System: a specimen board of tokens: type, color ramp, spacing scale, components, radii. */
const TILE = { className: 'nf st-i', strokeOpacity: 0.18 };

export default function SystemArt() {
  return (
    <svg className="plate__art" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect x="40" y="40" width="220" height="200" {...TILE} />
      <rect x="280" y="40" width="220" height="200" {...TILE} />
      <rect x="520" y="40" width="240" height="200" {...TILE} />
      <rect x="40" y="260" width="300" height="200" {...TILE} />
      <rect x="360" y="260" width="400" height="200" {...TILE} />

      <text x="64" y="160" className="fl-i svg-display" fontSize="112">
        Aa
      </text>
      <line x1="64" y1="188" x2="190" y2="188" className="st-i" strokeOpacity="0.5" strokeWidth="3" />
      <line x1="64" y1="206" x2="150" y2="206" className="st-i" strokeOpacity="0.25" strokeWidth="3" />

      {[1, 0.8, 0.62, 0.46, 0.32, 0.2, 0.1].map((o, i) => (
        <rect key={i} x={304 + i * 26} y="64" width="22" height="152" className="fl-a" fillOpacity={o} />
      ))}

      {[8, 16, 24, 32, 48, 64].map((s, i) => {
        const x = 544 + [0, 16, 39, 68, 104, 152][i];
        return <rect key={s} x={x} y={216 - s} width={s * 0.8} height={s} className="fl-a st-a" fillOpacity="0.16" />;
      })}

      <g className="art-accent">
        <rect x="64" y="290" width="120" height="42" className="fl-a" />
        <line x1="84" y1="311" x2="150" y2="311" stroke="#000" strokeWidth="3" />
      </g>
      <rect x="200" y="290" width="116" height="42" className="nf st-i" strokeOpacity="0.5" />
      <line x1="220" y1="311" x2="278" y2="311" className="st-i" strokeOpacity="0.5" strokeWidth="3" />
      <rect x="64" y="360" width="64" height="30" rx="15" className="fl-a" />
      <circle cx="113" cy="375" r="10" className="fl-0" />
      <rect x="150" y="360" width="30" height="30" className="nf st-a" strokeWidth="2" />
      <path d="M158 375 l6 6 l10 -12" className="nf st-a" strokeWidth="2" />
      <line x1="64" y1="420" x2="316" y2="420" className="st-i" strokeOpacity="0.2" />
      <line x1="64" y1="420" x2="210" y2="420" className="st-a" strokeWidth="3" />

      {[0, 8, 20, 40].map((r, i) => (
        <rect key={r} x={392 + i * 88} y="300" width="64" height="64" rx={r} className="nf st-i" strokeOpacity="0.55" />
      ))}
      {Array.from({ length: 24 }, (_, i) => (
        <circle
          key={i}
          cx={400 + (i % 12) * 28}
          cy={406 + Math.floor(i / 12) * 28}
          r="3"
          className={i === 7 ? 'fl-a' : 'fl-i'}
          fillOpacity={i === 7 ? 1 : 0.35}
        />
      ))}
    </svg>
  );
}
