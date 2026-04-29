/* ===================================================
   PLANNER CONSTRUCTORA v2 — JavaScript
   =================================================== */

// ─── TAB NAVIGATION ─────────────────────────────────
const VALID_TABS = ['inicio','proyectos','proceso','nosotros','avances','blog','exterior','contacto'];
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

function openWhatsAppExterior() {
  const msg = 'Hola! Estoy en el exterior y me interesa comprar un apartamento en Proyecto Asia para mi familia en Colombia. ¿Me pueden asesorar? Gracias.';
  window.open('https://wa.me/573185481730?text=' + encodeURIComponent(msg), '_blank');
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
  window.open(`https://wa.me/573185481730?text=${encodeURIComponent(msg)}`, '_blank');
}

// ─── COTIZADOR CUOTA INICIAL — PROYECTO ASIA ─────────
const PRECIO_ASIA     = 259000000;
const CUOTA_INICIAL_A = PRECIO_ASIA * 0.30;   // $77.700.000
const PLAZO_OBRA      = 20;

function fmtCOP(n) {
  if (n >= 1e9) return '$' + (n/1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n/1e6).toFixed(1).replace('.0','') + 'M';
  return '$' + Math.round(n).toLocaleString('es-CO');
}
function fmtCOPFull(n) {
  return '$' + Math.round(n).toLocaleString('es-CO');
}
function parseMoney(str) {
  return parseInt((str || '0').replace(/[^0-9]/g, '')) || 0;
}
function formatCotizField(el) {
  const v = parseMoney(el.value);
  el.value = v > 0 ? v.toLocaleString('es-CO') : '';
}
function wizSet(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  el.value = val > 0 ? val.toLocaleString('es-CO') : '';
}

// ─ Wizard state
let wizEmpleo = 'empleado';
const WIZ_STEPS = 5;

function wizUpdateDots(step) {
  for (let i = 1; i <= WIZ_STEPS; i++) {
    const dot = document.getElementById('wd' + i);
    if (!dot) continue;
    dot.className = 'wiz-dot' + (i < step ? ' done' : i === step ? ' active' : '');
  }
}

function wizGo(step) {
  if (step === WIZ_STEPS) wizCalcular();
  document.querySelectorAll('.cotiz-step').forEach(s => s.classList.remove('active'));
  document.getElementById('cotiz-s' + step)?.classList.add('active');
  wizUpdateDots(step);
  document.getElementById('calculadora')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function wizSelectEmpleo(tipo, btn) {
  wizEmpleo = tipo;
  document.querySelectorAll('.wiz-emp-chip').forEach(c => c.classList.remove('sel'));
  btn.classList.add('sel');
  document.getElementById('cotiz-empleo').value = tipo;
  const boosts = document.getElementById('wiz-boosts');
  if (boosts) boosts.style.display = tipo === 'empleado' ? 'block' : 'none';
}

function wizBoostChange(cb) {
  cb.closest('.wiz-boost')?.classList.toggle('on', cb.checked);
}

// ─ Cálculo principal
function wizCalcular() {
  const ahorro  = parseMoney(document.getElementById('cotiz-ahorro')?.value);
  const mensual = parseMoney(document.getElementById('cotiz-mensual')?.value);
  const ingreso = parseMoney(document.getElementById('cotiz-ingreso')?.value);
  const empleo  = wizEmpleo;
  const usaPrimas    = empleo === 'empleado' && !!document.getElementById('boost-primas')?.checked;
  const usaCesantias = empleo === 'empleado' && !!document.getElementById('boost-cesantias')?.checked;

  const totalPrimas    = usaPrimas    ? (ingreso / 2) * 2 * 3 : 0;
  const totalCesantias = usaCesantias ? ingreso * 3 : 0;
  const acumMensual    = mensual * PLAZO_OBRA;
  const totalAcumulado = ahorro + acumMensual + totalPrimas + totalCesantias;
  const listo          = totalAcumulado >= CUOTA_INICIAL_A;

  let mesesBase = Infinity;
  if (ahorro >= CUOTA_INICIAL_A) { mesesBase = 0; }
  else if (mensual > 0) { mesesBase = Math.ceil((CUOTA_INICIAL_A - ahorro) / mensual); }
  const semAmarillo = !listo && mesesBase <= PLAZO_OBRA;

  const sem = listo
    ? { color:'#10B981', bg:'#ECFDF5', border:'#A7F3D0', icon:'fa-check-circle',      txt:'¡Puedes hacerlo! Tienes o acumulas la cuota inicial en los 20 meses de obra.' }
    : semAmarillo
    ? { color:'#C8A96E', bg:'#FEF9EE', border:'#E5D5AA', icon:'fa-clock',              txt:'Puedes lograrlo ahorrando durante los 20 meses de construcción.' }
    : { color:'#EF4444', bg:'#FEF2F2', border:'#FCA5A5', icon:'fa-exclamation-circle', txt:'Con tu ahorro actual no alcanzas en los 20 meses. Habla con un asesor.' };

  let html = '';

  html += `<div style="display:flex;align-items:flex-start;gap:12px;padding:14px 16px;background:${sem.bg};border:1.5px solid ${sem.border};border-radius:12px;margin-bottom:16px">
    <i class="fas ${sem.icon}" style="color:${sem.color};font-size:1.4rem;flex-shrink:0;margin-top:1px"></i>
    <span style="font-size:.875rem;color:#1F2937;font-weight:600;line-height:1.45">${sem.txt}</span>
  </div>`;

  html += `<div style="background:#F8F6F2;border-radius:12px;padding:14px 16px;margin-bottom:12px">
    <div style="font-size:.68rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#9CA3AF;margin-bottom:10px">Cuota inicial</div>
    <div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:.85rem"><span style="color:#6B7280">Precio Proyecto Asia</span><span style="font-weight:600">${fmtCOPFull(PRECIO_ASIA)}</span></div>
    <div style="border-top:1px solid #E5E7EB;margin:8px 0 6px"></div>
    <div style="display:flex;justify-content:space-between;font-size:.9rem"><span style="font-weight:700">Cuota inicial (30%)</span><span style="font-weight:800;color:#C8A96E;font-size:1rem">${fmtCOPFull(CUOTA_INICIAL_A)}</span></div>
  </div>`;

  html += `<div style="background:#F8F6F2;border-radius:12px;padding:14px 16px;margin-bottom:16px">
    <div style="font-size:.68rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#9CA3AF;margin-bottom:10px">Tu plan de ahorro (20 meses)</div>`;
  if (ahorro > 0)
    html += `<div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:.85rem"><span style="color:#6B7280">Ahorros actuales</span><span style="font-weight:600;color:#10B981">${fmtCOPFull(ahorro)}</span></div>`;
  if (mensual > 0)
    html += `<div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:.85rem"><span style="color:#6B7280">Cuotas mensuales (20 meses)</span><span style="font-weight:600">${fmtCOPFull(acumMensual)}</span></div>`;
  if (usaPrimas && totalPrimas > 0)
    html += `<div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:.85rem"><span style="color:#10B981">⚡ Primas (Jun/Dic)</span><span style="font-weight:600;color:#10B981">+ ${fmtCOPFull(totalPrimas)}</span></div>`;
  if (usaCesantias && totalCesantias > 0)
    html += `<div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:.85rem"><span style="color:#10B981">⚡ Cesantías (marzo)</span><span style="font-weight:600;color:#10B981">+ ${fmtCOPFull(totalCesantias)}</span></div>`;

  const pctTotal = Math.min(100, Math.round((totalAcumulado / CUOTA_INICIAL_A) * 100));
  html += `<div style="border-top:1px solid #E5E7EB;margin:8px 0 8px"></div>
    <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:.9rem"><span style="font-weight:700">Total que acumulas</span><span style="font-weight:800;color:${listo?'#10B981':'#313133'}">${fmtCOPFull(totalAcumulado)}</span></div>
    <div style="background:#E5E7EB;border-radius:6px;height:10px;overflow:hidden;margin-bottom:6px">
      <div style="width:${pctTotal}%;height:100%;background:${listo?'#10B981':pctTotal>=60?'#C8A96E':'#EF4444'};border-radius:6px;transition:width .8s ease"></div>
    </div>
    <div style="font-size:.78rem;color:#6B7280;text-align:right">${pctTotal}% de la cuota inicial</div>`;

  if (!listo && mensual > 0) {
    const necesario = Math.ceil(CUOTA_INICIAL_A / PLAZO_OBRA);
    html += `<div style="margin-top:10px;padding:10px 12px;background:#FEF9EE;border-left:3px solid #C8A96E;border-radius:0 8px 8px 0;font-size:.8rem;color:#1F2937;line-height:1.45">
      💡 Para completarlo en 20 meses necesitarías <strong>${fmtCOP(necesario)}/mes</strong> (sin potenciadores).
    </div>`;
  }
  html += `</div>`;

  if (listo || semAmarillo) {
    html += `<button class="wiz-btn-wa" style="width:100%;display:flex;align-items:center;justify-content:center;gap:10px;border:none;cursor:pointer;font-size:1rem;font-weight:700;padding:17px;border-radius:14px;background:#10B981;color:#fff" onclick="wizEnviarLead('positivo')">
      <i class="fab fa-whatsapp" style="font-size:1.2rem"></i> Pedir información
    </button>
    <button class="wiz-btn-wa" style="width:100%;display:flex;align-items:center;justify-content:center;gap:10px;border:none;cursor:pointer;font-size:.9rem;font-weight:600;padding:13px;border-radius:14px;background:transparent;color:var(--color-gray-600);border:1.5px solid var(--color-gray-200);margin-top:8px" onclick="wizEnviarLead('asesor')">
      <i class="fab fa-whatsapp" style="font-size:1rem"></i> Hablar con un asesor
    </button>`;
  } else {
    html += `<button class="wiz-btn-wa" style="width:100%;display:flex;align-items:center;justify-content:center;gap:10px;border:none;cursor:pointer;font-size:1rem;font-weight:700;padding:17px;border-radius:14px" onclick="wizEnviarLead('asesor')">
      <i class="fab fa-whatsapp" style="font-size:1.2rem"></i> Hablar con un asesor
    </button>`;
  }

  const res = document.getElementById('wiz-resultado');
  if (res) res.innerHTML = html;
}

function wizEnviarLead(tipo = 'asesor') {
  const ingreso = fmtCOP(parseMoney(document.getElementById('cotiz-ingreso')?.value));
  const ahorro  = fmtCOP(parseMoney(document.getElementById('cotiz-ahorro')?.value));
  const mensual = fmtCOP(parseMoney(document.getElementById('cotiz-mensual')?.value));
  const intro = tipo === 'positivo'
    ? `Hola! Simulé mi cuota en el sitio de Planner para *Proyecto Asia* y me interesa. Quisiera más información para avanzar.`
    : `Hola! Hice la simulación en el sitio de Planner para *Proyecto Asia* y quisiera que me ayuden a encontrar la mejor opción.`;
  const msg = `${intro}\n• Empleo: ${wizEmpleo}\n• Ingresos: ${ingreso}/mes\n• Ahorros: ${ahorro}\n• Ahorro mensual: ${mensual}/mes\n¿Me pueden asesorar? Gracias.`;
  window.open(`https://wa.me/573185481730?text=${encodeURIComponent(msg)}`, '_blank');
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
