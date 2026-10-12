import { useMemo } from 'react';
import { mulberry32 } from '../../utils/rng';

/* Fleet Atlas: list, network map and utilisation bars of an operations console. */
export default function FleetArt() {
  const { nodes, edges, bars } = useMemo(() => {
    const rnd = mulberry32(7);
    const pts = Array.from({ length: 46 }, () => ({ x: 250 + rnd() * 310, y: 60 + rnd() * 380 }));
    const links = [];
    pts.forEach((a, i) => {
      pts
        .map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
        .filter((o) => o.j !== i)
        .sort((m, n) => m.d - n.d)
        .slice(0, 2)
        .forEach((o) => links.push([i, o.j]));
    });
    const heights = Array.from({ length: 18 }, () => 40 + rnd() * 270);
    return { nodes: pts, edges: links, bars: heights };
  }, []);

  return (
    <svg className="plate__art" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {Array.from({ length: 19 }, (_, i) => (
        <line key={i} x1={i * 44} y1="0" x2={i * 44} y2="500" className="st-i" strokeOpacity="0.05" />
      ))}

      {Array.from({ length: 8 }, (_, i) => (
        <g key={i}>
          <rect
            x="40"
            y={60 + i * 52}
            width="170"
            height="34"
            className={i === 3 ? 'fl-a st-a' : 'nf st-i'}
            fillOpacity={i === 3 ? 0.16 : 0}
            strokeOpacity={i === 3 ? 1 : 0.2}
          />
          <circle cx="58" cy={77 + i * 52} r="4" className={i === 3 ? 'fl-a' : 'fl-i'} fillOpacity={i === 3 ? 1 : 0.5} />
          <line x1="74" y1={77 + i * 52} x2={74 + 40 + ((i * 37) % 70)} y2={77 + i * 52} className="st-i" strokeOpacity="0.45" strokeWidth="3" />
        </g>
      ))}

      <g>
        {edges.map(([a, b], i) => (
          <line key={i} x1={nodes[a].x} y1={nodes[a].y} x2={nodes[b].x} y2={nodes[b].y} className="st-i" strokeOpacity="0.2" />
        ))}
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r="2.6" className="fl-i" fillOpacity="0.7" />
        ))}
      </g>

      <g className="art-accent">
        <circle cx={nodes[12].x} cy={nodes[12].y} r="6" className="fl-a" />
        <circle cx={nodes[12].x} cy={nodes[12].y} r="20" className="nf st-a" strokeOpacity="0.6" />
        <circle cx={nodes[12].x} cy={nodes[12].y} r="38" className="nf st-a" strokeOpacity="0.25" />
      </g>

      {bars.map((h, i) => (
        <rect
          key={i}
          x={596 + i * 11}
          y={450 - h}
          width="6"
          height={h}
          className={i > 13 ? 'fl-a' : 'fl-i'}
          fillOpacity={i > 13 ? 0.9 : 0.25}
        />
      ))}
    </svg>
  );
}
