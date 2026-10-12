/**
 * Single source of truth for personal content.
 * The name, role, bio, focus and work lists come straight from the brief.
 */
export const site = {
  name: 'Aaryan Raghuwanshi',
  first: 'Aaryan',
  last: 'Raghuwanshi',
  role: 'Senior Product Designer',
  intro: 'Shaping digital experiences across enterprise platforms, automotive, and consumer products.',
  bio: [
    'Senior Product Designer shaping digital experiences across enterprise platforms, automotive, and consumer products.',
    'I turn complex problems into intuitive interfaces, with an unreasonable attention to detail and just enough obsession over pixels.',
  ],
  focus: ['Digital products', 'Interaction design', 'Enterprise platforms', 'Automotive experiences'],
  work: [
    'Enterprise automotive platforms',
    'Digital sales experiences',
    'Product and interaction design',
    'Design systems',
    'Consumer-facing digital products',
  ],
  nav: [
    { label: 'Home', href: '#home' },
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],

  /**
   * CONTACT: no contact details were supplied, so none are invented.
   * Add your address below (for example 'you@example.com') and the contact section
   * switches to a real mailto link plus a copy button automatically.
   */
  contact: {
    email: '',
    draft:
      "Hi Aaryan, I came across your portfolio and I'd like to talk about a product I'm working on. Could we find a time to chat?",
  },
};
