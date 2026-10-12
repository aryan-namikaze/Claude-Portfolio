import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { site } from '../config/site';

// Text that rolls up to reveal a violet copy of itself on hover and focus.
function Roll({ children }) {
  return (
    <span className="roll">
      <span className="roll__in" data-text={children}>
        {children}
      </span>
    </span>
  );
}

export default function Nav() {
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('home');
  const brandRef = useRef(null);
  const toggleRef = useRef(null);
  const menuRef = useRef(null);

  // Scroll-aware: transparent over the hero, solid after it, hides while scrolling down, returns on scroll up.
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      const heroEnd = (document.getElementById('home')?.offsetHeight ?? 0) - window.innerHeight * 0.6;
      const pastHero = y > heroEnd;
      setSolid(pastHero);
      if (!pastHero || y < 80) setHidden(false);
      else if (y - last > 6) setHidden(true);
      else if (last - y > 6) setHidden(false);
      last = y;
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Current section.
  useEffect(() => {
    const els = site.nav.map((n) => document.getElementById(n.href.slice(1))).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // Mobile menu: scroll lock, Escape to close, Tab kept inside the overlay.
  useEffect(() => {
    if (!open) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    menuRef.current?.querySelector('a')?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = [brandRef.current, toggleRef.current, ...menuRef.current.querySelectorAll('a')];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  const closeMenu = () => {
    document.body.style.overflow = '';
    setOpen(false);
  };

  return (
    <>
      <header
        className={`nav${hidden && !open ? ' is-hidden' : ''}${solid || open ? ' is-solid' : ''}`}
        onFocus={() => setHidden(false)}
      >
        <a href="#home" className="nav__brand" ref={brandRef} onClick={open ? closeMenu : undefined}>
          {site.name}
        </a>

        <nav aria-label="Primary" className="nav__desktop">
          <ul className="nav__list">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  className="nav__link"
                  href={item.href}
                  aria-current={active === item.href.slice(1) ? 'true' : undefined}
                >
                  <Roll>{item.label}</Roll>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="nav__toggle"
          ref={toggleRef}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </header>

      <div className={`menu${open ? ' is-open' : ''}`} id="mobile-menu" ref={menuRef}>
        <nav aria-label="Mobile">
          <ul>
            {site.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={closeMenu}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
