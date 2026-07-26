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

// Video embed fallback — bloqueadores de anuncios (Brave Shields, uBlock, etc.)
// suelen cancelar el request del iframe sin disparar "error", así que se usa
// un timeout: si "load" no llega a tiempo, se asume bloqueado.
const videoFrame = document.getElementById('video-embed-frame');
const videoFallback = document.getElementById('video-embed-fallback');

if (videoFrame && videoFallback) {
  let videoLoaded = false;

  videoFrame.addEventListener('load', () => {
    videoLoaded = true;
  });

  videoFrame.addEventListener('error', () => {
    videoFallback.hidden = false;
  });

  setTimeout(() => {
    if (!videoLoaded) videoFallback.hidden = false;
  }, 3000);
}
