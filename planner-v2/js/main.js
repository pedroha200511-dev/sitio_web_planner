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

// ─── MULTI-STEP FORM ────────────────────────────────
let currentStep = 1;
const totalSteps = 3;

function goStep(next) {
  if (next < 1 || next > totalSteps) return;
  if (currentStep === 1 && next === 2) {
    const nombre = document.getElementById('f-nombre');
    const tel    = document.getElementById('f-tel');
    if (!nombre?.value.trim() || !tel?.value.trim()) {
      nombre?.classList.add('error');
      tel?.classList.add('error');
      showFormError('Por favor completa tu nombre y teléfono para continuar.');
      return;
    }
    clearFormError();
  }

  document.querySelectorAll('.form-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`step-panel-${next}`)?.classList.add('active');

  document.querySelectorAll('.form-step').forEach((s, i) => {
    s.classList.remove('active', 'done');
    if (i + 1 < next)  s.classList.add('done');
    if (i + 1 === next) s.classList.add('active');
  });

  const labels = ['Tu información', 'Motivo de contacto', 'Preferencias'];
  const label  = document.getElementById('step-label');
  if (label) label.innerHTML = `Paso ${next} de ${totalSteps}: <strong>${labels[next-1]}</strong>`;

  currentStep = next;
}

function showFormError(msg) {
  const el = document.getElementById('form-error');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}
function clearFormError() {
  const el = document.getElementById('form-error');
  if (el) el.style.display = 'none';
}

// Limpiar error al escribir
['f-nombre','f-tel','f-email'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', function() {
    this.classList.remove('error');
    clearFormError();
  });
});

function toggleMotivo() {
  const esProyecto = document.querySelector('input[name="motivo"]:checked')?.value !== 'empresa';
  const fields = document.getElementById('motivo-proyecto-fields');
  if (fields) fields.style.display = esProyecto ? '' : 'none';
}

function submitForm(e) {
  e?.preventDefault();
  const privacy = document.getElementById('f-privacy');
  if (!privacy?.checked) {
    showFormError('Debes aceptar la política de privacidad para continuar.');
    return;
  }
  const nombre  = document.getElementById('f-nombre')?.value || 'Cliente';
  const motivo  = document.querySelector('input[name="motivo"]:checked')?.value || 'proyecto';
  const mensaje = document.getElementById('f-mensaje')?.value || '';

  let msg, waNumber;
  if (motivo === 'empresa') {
    msg = `Hola! Soy *${nombre}*. Tengo una consulta de *servicio al cliente / información general* de Planner Constructora.`;
    waNumber = WA_NUMBER_GENERAL;
  } else {
    const proyecto    = document.getElementById('f-proyecto')?.value || 'uno de los proyectos';
    const presupuesto = document.querySelector('input[name="presupuesto"]:checked')?.value || '';
    msg = `Hola! Soy *${nombre}*. Me interesa el proyecto *${proyecto}*.`;
    if (presupuesto) msg += ` Mi presupuesto mensual es *${presupuesto}*.`;
    waNumber = waNumberFor(proyecto);
  }
  if (mensaje) msg += ` Comentario: ${mensaje}`;
  msg += ' Solicité información desde el sitio web.';

  // Envía una copia por correo vía Formspree (no bloquea el flujo de WhatsApp).
  const formEl = document.getElementById('contact-form');
  if (formEl) {
    fetch('https://formspree.io/f/xdenlglp', {
      method: 'POST',
      body: new FormData(formEl),
      headers: { 'Accept': 'application/json' }
    }).catch(() => {});
  }

  const container = document.getElementById('form-container');
  const success   = document.getElementById('form-success');
  if (container) container.style.display = 'none';
  if (success)   success.classList.add('visible');

  setTimeout(() => {
    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  }, 700);
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
