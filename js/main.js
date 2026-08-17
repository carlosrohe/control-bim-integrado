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

// Video embed — clic para cargar. No se hace ninguna petición a linkedin.com
// hasta que el usuario haga clic en la miniatura, así que un bloqueador no
// tiene nada que interceptar durante la carga normal de la página. El
// fallback solo puede ser relevante después del clic (si el iframe real
// también termina bloqueado), y se detecta igual que antes: contentDocument
// accesible = se quedó en about:blank = bloqueado.
//
// Soporta cualquier número de videos en la página: recorre todos los
// botones con la clase .video-embed__trigger y encuentra el fallback
// correspondiente a cada uno por posición en el HTML (el
// .video-embed__fallback que sigue justo después de su .video-embed).
document.querySelectorAll('.video-embed__trigger').forEach((videoTrigger) => {
  const videoWrap = videoTrigger.closest('.video-embed');
  const videoFallback = videoWrap ? videoWrap.nextElementSibling : null;
  if (!videoTrigger || !videoFallback || !videoFallback.classList.contains('video-embed__fallback')) return;

  videoTrigger.addEventListener('click', () => {
    const embedSrc = videoTrigger.getAttribute('data-embed-src');
    const iframe = document.createElement('iframe');
    iframe.className = 'video-embed__frame';
    iframe.title = 'Publicación integrada';
    iframe.setAttribute('frameborder', '0');
    iframe.allowFullscreen = true;
    iframe.src = embedSrc;
    videoTrigger.replaceWith(iframe);
    const checkRealLoad = () => {
      let blocked = true;
      try {
        blocked = Boolean(iframe.contentDocument);
      } catch (e) {
        blocked = false;
      }
      if (blocked) videoFallback.hidden = false;
    };
    iframe.addEventListener('load', checkRealLoad);
    setTimeout(checkRealLoad, 3000);
  });
});
