import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { gsap } from '../lib/gsap';
import { revealLines } from '../lib/reveal';
import { site } from '../config/site';
import { copyText } from '../utils/clipboard';
import useMagnetic from '../hooks/useMagnetic';
import Lines from './Lines';
import Dial from './art/Dial';

export default function Contact() {
  const root = useRef(null);
  const dial = useRef(null);
  const wrap = useRef(null);
  const inner = useRef(null);
  const timer = useRef(0);
  const [status, setStatus] = useState('idle'); // idle | copied | failed

  const { email, draft } = site.contact;
  const hasEmail = Boolean(email);
  const payload = hasEmail ? email : draft;

  useMagnetic(wrap, inner, 0.3);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      revealLines(root.current, '.contact__title', { stagger: 0.12, duration: 1.4 });
      revealLines(root.current, '.contact__draft', { stagger: 0 });
      gsap.fromTo(
        dial.current,
        { rotation: -25 },
        {
          rotation: 65,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
        },
      );
    });
    return () => mm.revert();
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const onCopy = async () => {
    const ok = await copyText(payload);
    setStatus(ok ? 'copied' : 'failed');
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus('idle'), 2600);
  };

  const label = {
    idle: hasEmail ? 'Copy email address' : 'Copy a message to send',
    copied: 'Copied to clipboard',
    failed: 'Copy failed, select the text instead',
  }[status];

  return (
    <section id="contact" ref={root} className="contact" aria-labelledby="contact-title">
      <div className="contact__dial" ref={dial} aria-hidden="true">
        <Dial value={0.38} />
      </div>

      <h2 className="contact__title" id="contact-title">
        <Lines lines={["Let's make the", 'complicated feel', 'effortless.']} />
      </h2>

      <div className="contact__actions">
        <div className="magnet" ref={wrap}>
          <div ref={inner} className="magnet__inner">
            <button type="button" className="btn" onClick={onCopy}>
              {status === 'copied' ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
              <span>{label}</span>
            </button>
          </div>
        </div>

        {hasEmail ? (
          <a className="contact__mail" href={`mailto:${email}`}>
            {email}
          </a>
        ) : (
          <p className="contact__draft">
            <span className="mask">
              <span className="rv">&ldquo;{draft}&rdquo;</span>
            </span>
          </p>
        )}
      </div>

      {!hasEmail && (
        <p className="contact__note">
          Direct contact details are not published here yet. Copy the message above and send it through the channel where
          you found this portfolio.
          {import.meta.env.DEV && ' (Developer note: set contact.email in src/config/site.js to enable a real link.)'}
        </p>
      )}

      <span className="sr-only" role="status" aria-live="polite">
        {status === 'copied' ? 'Copied to clipboard.' : status === 'failed' ? 'Copy failed.' : ''}
      </span>
    </section>
  );
}
