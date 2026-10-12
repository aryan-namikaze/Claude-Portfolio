import { ArrowUp } from 'lucide-react';
import { site } from '../config/site';

export default function Footer() {
  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <footer className="footer">
      <p>
        {site.name}
        <span className="footer__sub">Designed and built with React and GSAP. {new Date().getFullYear()}</span>
      </p>
      <button type="button" className="footer__top" onClick={toTop}>
        <span>Back to top</span>
        <ArrowUp size={16} aria-hidden="true" />
      </button>
    </footer>
  );
}
