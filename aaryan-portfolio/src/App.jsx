import { useEffect } from 'react';
import { ScrollTrigger } from './lib/gsap';
import Cursor from './components/Cursor';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Rule from './components/Rule';
import Work from './components/Work';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';

export default function App() {
  // Web fonts change text metrics; re-measure every trigger once they have loaded.
  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => {
      if (alive) ScrollTrigger.refresh();
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#work">
        Skip to selected work
      </a>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Work />
        <Rule />
        <About />
        <Rule />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
