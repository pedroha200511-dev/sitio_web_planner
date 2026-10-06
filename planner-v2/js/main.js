/* ===================================================
   PLANNER CONSTRUCTORA v2 JavaScript
   =================================================== */

// ─── WHATSAPP: NÚMEROS ──────────────────────────────
const WA_NUMBER_GENERAL = '573185481730';
const WA_NUMBER_ASIA    = '573148076808';
function waNumberFor(projectName) {
  return projectName === 'Asia' ? WA_NUMBER_ASIA : WA_NUMBER_GENERAL;
}

// ─── TAB NAVIGATION ─────────────────────────────────
const VALID_TABS = ['inicio','proyectos','proceso','nosotros','contacto'];
let currentTab = 'inicio';

function switchTab(name) {
  if (!VALID_TABS.includes(name)) name = 'inicio';
  document.querySelectorAll('[data-tab]').forEach(el => {
    el.classList.toggle('tab-active', el.dataset.tab === name);
  });
  document.querySelectorAll('[data-nav-tab]').forEach(a => {
    a.classList.toggle('active', a.dataset.navTab === name);
  });
  window.scrollTo({ top: 0, behavior: 'instant' });
  history.replaceState(null, '', '#' + name);
  currentTab = name;
  document.getElementById('mobile-nav')?.classList.remove('open');
}

const asiaGalleryImages = ['img/asia-nueva-fachada.png', 'img/asia-fachada-2.jpg', 'img/asia-aerea.jpg'];
let asiaGalleryIndex = 0;
function asiaGalleryNav(dir) {
  asiaGalleryIndex = (asiaGalleryIndex + dir + asiaGalleryImages.length) % asiaGalleryImages.length;
  const mainImg = document.getElementById('proyectos-asia-main-img');
  mainImg.style.opacity = '0';
  setTimeout(() => {
    mainImg.src = asiaGalleryImages[asiaGalleryIndex];
    mainImg.style.opacity = '1';
  }, 200);
}

function openWhatsAppExterior() {
  const msg = 'Hola! Estoy en el exterior y me interesa comprar un apartamento en Proyecto Asia para mi familia en Colombia. ¿Me pueden asesorar? Gracias.';
  window.open('https://wa.me/' + WA_NUMBER_ASIA + '?text=' + encodeURIComponent(msg), '_blank');
}

function setBuyerMode(mode) {
  document.querySelectorAll('[data-buyer-mode]').forEach(el => {
    const active = el.dataset.buyerMode === mode;
    el.classList.toggle('is-active', active);
    el.style.display = active ? '' : 'none';
  });
  document.querySelectorAll('[data-buyer-btn]').forEach(btn => {
    btn.classList.toggle('is-active', btn.dataset.buyerBtn === mode);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const hash = location.hash.replace('#', '');
  switchTab(VALID_TABS.includes(hash) ? hash : 'inicio');
});

// ─── PAGE LOADER ────────────────────────────────────
const loader = document.getElementById('page-loader');
window.addEventListener('load', () => {
  setTimeout(() => loader?.classList.add('hidden'), 900);
});

// ─── ANNOUNCEMENT BAR ───────────────────────────────
const annBar   = document.getElementById('announcement-bar');
const annClose = document.getElementById('announcement-close');
annClose?.addEventListener('click', () => {
  annBar.style.display = 'none';
  document.body.classList.remove('has-announcement');
  sessionStorage.setItem('ann-closed', '1');
});
if (sessionStorage.getItem('ann-closed')) {
  annBar && (annBar.style.display = 'none');
  document.body.classList.remove('has-announcement');
}

// ─── SCROLL PROGRESS BAR ────────────────────────────
const progressBar = document.getElementById('scroll-progress');
function updateProgress() {
  const total    = document.documentElement.scrollHeight - window.innerHeight;
  const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
  if (progressBar) progressBar.style.width = progress + '%';
}

// ─── SCROLL-TO-TOP ──────────────────────────────────
const scrollTopBtn = document.getElementById('scroll-top');
function updateScrollTop() {
  scrollTopBtn?.classList.toggle('visible', window.scrollY > 400);
}
scrollTopBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── NAVBAR SCROLL ──────────────────────────────────
const navbar = document.getElementById('navbar');
function updateNavbar() {
  navbar?.classList.toggle('scrolled', window.scrollY > 20);
}

// ─── ACTIVE NAV ON SCROLL ───────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.navbar__nav a');
function updateActiveNav() {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

// Batch all scroll handlers
window.addEventListener('scroll', () => {
  updateProgress();
  updateScrollTop();
  updateNavbar();
  updateActiveNav();
}, { passive: true });

// ─── HAMBURGER MENU ─────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
hamburger?.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', open);
});
document.addEventListener('click', e => {
  if (navbar && !navbar.contains(e.target) && mobileNav) {
    mobileNav.classList.remove('open');
  }
});

// ─── WHATSAPP FLOAT POPUP ───────────────────────────
const waBtn   = document.getElementById('wa-btn');
const waPopup = document.getElementById('wa-popup');
waBtn?.addEventListener('click', e => {
  e.stopPropagation();
  waPopup?.classList.toggle('open');
});
document.addEventListener('click', e => {
  if (!document.getElementById('wa-float')?.contains(e.target)) {
    waPopup?.classList.remove('open');
  }
});

function openWhatsApp(projectName = '') {
  const msg = projectName
    ? `Hola! Me interesa el proyecto *${projectName}*. ¿Podrían enviarme información sobre opciones de pago y disponibilidad? Gracias.`
    : 'Hola! Quisiera información sobre los proyectos de Planner Constructora. ¿Pueden ayudarme?';
  window.open(`https://wa.me/${waNumberFor(projectName)}?text=${encodeURIComponent(msg)}`, '_blank');
}

function openWhatsAppVisita() {
  const msg = 'Hola! Me gustaría agendar una visita al proyecto. ¿Podrían ayudarme a coordinar un horario? Gracias.';
  window.open(`https://wa.me/${WA_NUMBER_GENERAL}?text=${encodeURIComponent(msg)}`, '_blank');
}

// ─── REVEAL ON SCROLL ───────────────────────────────
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// ─── COUNTER ANIMATION ──────────────────────────────
function animateCounter(el, target, suffix = '') {
  const duration = 1800;
  const start    = performance.now();
  const update   = now => {
    const t    = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 4);
    el.textContent = Math.round(target * ease) + suffix;
    if (t < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('[data-count]').forEach(el => {
        animateCounter(el, parseInt(el.dataset.count), el.dataset.suffix || '');
      });
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.trayectoria-strip').forEach(el => {
  counterObs.observe(el);
});

// ─── HERO PARALLAX (sutil) ──────────────────────────
const heroBg = document.querySelector('.hero__bg');
window.addEventListener('scroll', () => {
  if (heroBg && window.scrollY < window.innerHeight) {
    heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  }
}, { passive: true });
