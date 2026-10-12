# Aaryan Raghuwanshi, portfolio

React + Vite + GSAP ScrollTrigger. No TypeScript, Tailwind or Next.js.

```
npm install
npm run dev
npm run build
```

## Where to edit

- `src/config/site.js` holds all personal copy. **Contact:** set `contact.email` and the contact
  section switches to a real `mailto:` link plus a copy button. Until then it offers a copyable message.
- `src/config/projects.js` holds the four concept studies (labelled as concepts, not client work).
- `src/styles/index.css` holds the design tokens (`--bg`, `--accent`, `--ink`, `--dim`) and all styling.

## Structure

```
src/
  components/
    Hero.jsx            sticky stage + one scrubbed GSAP timeline
    ParticleField.jsx   canvas pixels in a 3D shell, reads hero scroll progress
    art/Artifact.jsx    five-plane CSS 3D object (grid, contours, pixels, dial, frame)
    art/*Art.jsx        procedural SVG artwork for each concept study
    Work.jsx, Plate.jsx, About.jsx, Contact.jsx, Nav.jsx, Footer.jsx, Cursor.jsx, Rule.jsx
  hooks/useMagnetic.js
  lib/gsap.js           registers ScrollTrigger once
```

Motion is created inside `gsap.matchMedia()` scopes, so Strict Mode double-mounts, breakpoint
changes and `prefers-reduced-motion` are all cleaned up and rebuilt correctly.
