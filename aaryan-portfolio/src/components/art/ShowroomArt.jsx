import Contours from './Contours';

/* Showroom Thread: a vehicle profile drawn as contours, a swatch row and a progress thread. */
export default function ShowroomArt() {
  return (
    <svg className="plate__art" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <Contours
        d="M40 330 C 150 330 190 190 330 175 S 520 110 600 175 S 700 300 760 315"
        count={17}
        step={10}
        offset={-70}
        highlight={8}
        width={1.1}
      />

      {[0, 1, 2, 3, 4].map((i) => (
        <circle
          key={i}
          cx={64 + i * 46}
          cy="450"
          r="14"
          className={['fl-i', 'fl-a', 'fl-d', 'fl-i', 'nf st-i'][i]}
          fillOpacity={[0.9, 1, 0.8, 0.3, 1][i]}
          strokeOpacity="0.5"
        />
      ))}
      <g className="art-accent">
        <circle cx="110" cy="450" r="22" className="nf st-a" />
      </g>

      <line x1="470" y1="450" x2="750" y2="450" className="st-i" strokeOpacity="0.3" />
      <line x1="470" y1="450" x2="620" y2="450" className="st-a" strokeWidth="3" />
      {[470, 540, 610, 680, 750].map((x) => (
        <line key={x} x1={x} y1="442" x2={x} y2="458" className="st-i" strokeOpacity="0.4" />
      ))}
      <circle cx="620" cy="450" r="7" className="fl-a" />
    </svg>
  );
}
