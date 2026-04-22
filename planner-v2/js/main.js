/* ===================================================
   PLANNER CONSTRUCTORA v2 — JavaScript
   =================================================== */

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
  window.open(`https://wa.me/573185481730?text=${encodeURIComponent(msg)}`, '_blank');
}

// ─── CALCULADORA ────────────────────────────────────
const calcSelect  = document.getElementById('calc-proyecto');
const calcPlazo   = document.getElementById('calc-plazo');
const calcInicial = document.getElementById('calc-inicial');
const plazoLabel  = document.getElementById('plazo-label');
const inicialLabel= document.getElementById('inicial-label');

const precios = { asia: 259000000, terralta: 317685000, altea: 235400000 };

const CIRC = 2 * Math.PI * 28; // 175.93

function formatCOP(n) {
  if (n >= 1e9) return '$' + (n/1e9).toFixed(1) + 'B';
  if (n >= 1e6) return '$' + Math.round(n/1e6) + 'M';
  return '$' + Math.round(n).toLocaleString('es-CO');
}
function formatCOPFull(n) {
  return '$' + Math.round(n).toLocaleString('es-CO');
}

function updateDonut(pctInicial) {
  const pct    = pctInicial / 100;
  const offset = CIRC * (1 - pct);
  const donutIni = document.getElementById('donut-inicial');
  const donutFin = document.getElementById('donut-financiado');
  const center   = document.getElementById('donut-pct');
  if (donutIni) {
    donutIni.style.strokeDashoffset = offset;
    donutIni.style.strokeDasharray  = CIRC;
  }
  if (donutFin) {
    donutFin.style.strokeDashoffset = CIRC * pct;
    donutFin.style.strokeDasharray  = CIRC;
  }
  if (center) center.innerHTML = pctInicial + '%<br>inicial';
}

function calcular() {
  const precio      = precios[calcSelect?.value] || precios.terralta;
  const plazo       = parseInt(calcPlazo?.value  || 120);
  const pctInicial  = parseInt(calcInicial?.value || 20);
  const tasa        = 0.115 / 12;

  if (plazoLabel)   plazoLabel.textContent   = plazo + ' meses';
  if (inicialLabel) inicialLabel.textContent = pctInicial + '%';

  const cuotaInicial = precio * (pctInicial / 100);
  const financiado   = precio - cuotaInicial;
  const cuotaMensual = financiado > 0
    ? financiado * tasa / (1 - Math.pow(1 + tasa, -plazo))
    : 0;

  const el = id => document.getElementById(id);
  if (el('res-precio'))     el('res-precio').textContent     = formatCOPFull(precio);
  if (el('res-inicial'))    el('res-inicial').textContent    = formatCOPFull(cuotaInicial);
  if (el('res-financiado')) el('res-financiado').textContent = formatCOPFull(financiado);
  if (el('res-cuota'))      el('res-cuota').textContent      = formatCOPFull(cuotaMensual);
  if (el('res-plazo'))      el('res-plazo').textContent      = plazo + ' meses';

  // Donut legend
  if (el('legend-inicial'))    el('legend-inicial').textContent    = formatCOP(cuotaInicial);
  if (el('legend-financiado')) el('legend-financiado').textContent = formatCOP(financiado);
  if (el('legend-cuota'))      el('legend-cuota').textContent      = formatCOP(cuotaMensual) + '/mes';

  updateDonut(pctInicial);
}

calcSelect?.addEventListener('change', calcular);
calcPlazo?.addEventListener('input', calcular);
calcInicial?.addEventListener('input', calcular);
calcular();

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

  const labels = ['Tu información', 'Tu presupuesto', 'Preferencias'];
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

function submitForm(e) {
  e?.preventDefault();
  const privacy = document.getElementById('f-privacy');
  if (!privacy?.checked) {
    showFormError('Debes aceptar la política de privacidad para continuar.');
    return;
  }
  const nombre      = document.getElementById('f-nombre')?.value || 'Cliente';
  const proyecto    = document.getElementById('f-proyecto')?.value || 'uno de los proyectos';
  const presupuesto = document.querySelector('input[name="presupuesto"]:checked')?.value || '';
  const mensaje     = document.getElementById('f-mensaje')?.value || '';

  let msg = `Hola! Soy *${nombre}*. Me interesa el proyecto *${proyecto}*.`;
  if (presupuesto) msg += ` Mi presupuesto mensual es *${presupuesto}*.`;
  if (mensaje)     msg += ` Comentario: ${mensaje}`;
  msg += ' Solicité información desde el sitio web.';

  const container = document.getElementById('form-container');
  const success   = document.getElementById('form-success');
  if (container) container.style.display = 'none';
  if (success)   success.classList.add('visible');

  setTimeout(() => {
    window.open(`https://wa.me/573185481730?text=${encodeURIComponent(msg)}`, '_blank');
  }, 700);
}

// ─── FAQs ACCORDION ─────────────────────────────────
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item   = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!isOpen) item.classList.add('open');
    btn.setAttribute('aria-expanded', !isOpen);
  });
});

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

document.querySelectorAll('.stats-row, .nosotros-stats, .hero__trust').forEach(el => {
  counterObs.observe(el);
});

// ─── PROGRESS BAR ANIMATION (avances) ───────────────
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.progress-fill[data-width]').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('[data-animate-bars]').forEach(el => barObs.observe(el));

// ─── HERO PARALLAX (sutil) ──────────────────────────
const heroBg = document.querySelector('.hero__bg');
window.addEventListener('scroll', () => {
  if (heroBg && window.scrollY < window.innerHeight) {
    heroBg.style.transform = `translateY(${window.scrollY * 0.25}px)`;
  }
}, { passive: true });
