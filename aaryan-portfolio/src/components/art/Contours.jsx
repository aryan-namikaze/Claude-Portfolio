/**
 * A stack of offset copies of one sweeping body line, like a contour map of an abstract car profile.
 */
export default function Contours({ d, count, step, offset, highlight, width = 1 }) {
  const lines = [];
  for (let i = 0; i < count; i += 1) {
    const t = i / (count - 1);
    const isHi = i === highlight;
    lines.push(
      <path
        key={i}
        d={d}
        transform={`translate(0 ${(offset + i * step).toFixed(1)})`}
        className={`nf ${isHi ? 'st-i' : 'st-a'}`}
        strokeWidth={isHi ? width * 2 : width}
        strokeOpacity={isHi ? 0.95 : (1 - t * 0.82).toFixed(2)}
        strokeLinecap="round"
      />,
    );
  }
  return <g>{lines}</g>;
}
