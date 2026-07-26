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

// Video embed fallback — el link de respaldo vive fuera de .video-embed y está
// visible por defecto en el HTML (ver comentario junto al markup). Solo se
// oculta si se confirma una carga real, y esa confirmación se intenta por dos
// vías independientes porque ningún evento es 100% confiable con bloqueadores:
//
// 1) Evento "load": algunos bloqueadores cancelan el request pero igual
//    disparan "load" (el iframe se queda en about:blank), así que el evento
//    por sí solo no basta — se revisa contentDocument para distinguirlo.
// 2) Timeout fijo de 3s: cubre el caso donde el bloqueador cancela la petición
//    sin disparar "load" en absoluto. Como el respaldo ya es visible por
//    defecto, este timeout no "muestra" nada — solo vuelve a intentar la
//    misma verificación por si la carga real ya ocurrió mientras tanto.
const videoFrame = document.getElementById('video-embed-frame');
const videoFallback = document.getElementById('video-embed-fallback');

if (videoFrame && videoFallback) {
  const hideFallbackIfReallyLoaded = () => {
    let blocked = true;
    try {
      // contentDocument accesible = sigue en about:blank = bloqueado.
      // Acceso que lanza excepción cross-origin = navegó de verdad = cargó.
      blocked = Boolean(videoFrame.contentDocument);
    } catch (e) {
      blocked = false;
    }
    if (!blocked) videoFallback.hidden = true;
  };

  videoFrame.addEventListener('load', hideFallbackIfReallyLoaded);
  setTimeout(hideFallbackIfReallyLoaded, 3000);
}
