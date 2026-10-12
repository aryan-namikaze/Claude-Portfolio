// Renders each line inside its own mask so it can slide up from below.
export default function Lines({ lines }) {
  return lines.map((line) => (
    <span className="mask" key={line}>
      <span className="rv">{line}</span>
    </span>
  ));
}
