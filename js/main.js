// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('[data-nav-link]').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Active link tracking on scroll
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('[data-nav-link]');

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
  });
};

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActiveLink(entry.target.id);
    });
  },
  { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
);

sections.forEach((section) => observer.observe(section));

// Video embed fallback — el link de respaldo está visible por defecto en el HTML.
// Bloqueadores como Brave Shields o uBlock cancelan el request del iframe pero
// igual disparan "load" (queda navegando a "about:blank"), así que ese evento
// por sí solo no sirve para saber si cargó. En vez de eso, al disparar "load"
// se intenta leer contentDocument: si es accesible, el iframe nunca salió de
// about:blank (bloqueado); si el acceso lanza una excepción cross-origin, sí
// navegó de verdad a linkedin.com y ahí sí se oculta el respaldo.
const videoFrame = document.getElementById('video-embed-frame');
const videoFallback = document.getElementById('video-embed-fallback');

if (videoFrame && videoFallback) {
  videoFrame.addEventListener('load', () => {
    let blocked = true;
    try {
      blocked = Boolean(videoFrame.contentDocument);
    } catch (e) {
      blocked = false;
    }
    if (!blocked) videoFallback.hidden = true;
  });
}
