import { useId, useRef, useState } from 'react';
import { Minus, Plus } from 'lucide-react';

/**
 * One editorial project plate: a clipped media frame (animated by Work.jsx) next to its text.
 * Pointer response (light, tilt, accent parallax) is driven by CSS variables so it costs no React renders.
 */
export default function Plate({ project, children }) {
  const frame = useRef(null);
  const [open, setOpen] = useState(false);
  const notesId = useId();

  const onMove = (e) => {
    if (e.pointerType !== 'mouse') return;
    const el = frame.current;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${(x * 100).toFixed(1)}%`);
    el.style.setProperty('--my', `${(y * 100).toFixed(1)}%`);
    el.style.setProperty('--px', ((x - 0.5) * 2).toFixed(3));
    el.style.setProperty('--py', ((y - 0.5) * 2).toFixed(3));
    el.style.setProperty('--rx', `${((0.5 - y) * 6).toFixed(2)}deg`);
    el.style.setProperty('--ry', `${((x - 0.5) * 8).toFixed(2)}deg`);
  };

  const onLeave = () => {
    const el = frame.current;
    ['--px', '--py', '--rx', '--ry'].forEach((v) => el.style.removeProperty(v));
  };

  return (
    <article className={`plate plate--${project.variant}`} aria-labelledby={`${notesId}-title`}>
      <div className="plate__media">
        <div className="plate__frame" ref={frame} onPointerMove={onMove} onPointerLeave={onLeave} data-cursor>
          <div className="plate__tilt">
            <div className="plate__drift">{children}</div>
          </div>
        </div>
      </div>

      <div className="plate__text">
        <div className="mask">
          <p className="rv plate__category">
            {project.category}
            <span className="plate__tag">Concept study</span>
          </p>
        </div>
        <div className="mask">
          <h3 className="rv plate__title" id={`${notesId}-title`}>
            {project.title}
          </h3>
        </div>
        <div className="mask">
          <p className="rv plate__summary">{project.summary}</p>
        </div>
        <div className="mask">
          <button
            type="button"
            className="rv plate__toggle"
            aria-expanded={open}
            aria-controls={notesId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <Minus size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
            <span>{open ? 'Hide concept notes' : 'Read concept notes'}</span>
          </button>
        </div>
        <div className={`plate__notes${open ? ' is-open' : ''}`} id={notesId} aria-hidden={!open}>
          <ul>
            {project.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}
