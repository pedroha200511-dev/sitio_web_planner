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

// ─── COTIZADOR CUOTA INICIAL — PROYECTO ASIA ─────────
const PRECIO_ASIA      = 259000000;
const CUOTA_INICIAL_A  = PRECIO_ASIA * 0.30;   // $77.700.000
const HIPOTECA_A       = PRECIO_ASIA * 0.70;   // $181.300.000
const SUBSIDIO_MAX     = 30000000;
const CUOTA_NETA_A     = CUOTA_INICIAL_A - SUBSIDIO_MAX; // $47.700.000
const PLAZO_OBRA       = 36;                    // meses de construcción
const TASA_MENS        = 0.115 / 12;            // 11.5% E.A.
const PLAZO_HIPO       = 240;                   // 20 años en meses
const CUOTA_HIPOTECARIA = Math.round(
  HIPOTECA_A * TASA_MENS / (1 - Math.pow(1 + TASA_MENS, -PLAZO_HIPO))
);

// Helpers de formato
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
function setCotizVal(id, val) {
  const el = document.getElementById(id);
  if (!el) return;
  el.value = val > 0 ? val.toLocaleString('es-CO') : '';
}

// Selección de tipo de empleo
function cotizSelectEmpleo(tipo, btn) {
  document.querySelectorAll('.cotiz-chip[id^="chip-"]').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const h = document.getElementById('cotiz-empleo');
  if (h) h.value = tipo;
  // Mostrar/ocultar potenciadores
  const pot = document.getElementById('cotiz-potenciadores');
  if (pot) pot.style.display = tipo === 'empleado' ? 'block' : 'none';
}

// Toggle visual de boost-check
function cotizBoostToggle(wrapId, checkbox) {
  const wrap = document.getElementById(wrapId);
  if (!wrap) return;
  if (checkbox.checked) {
    wrap.classList.add('boost-active');
  } else {
    wrap.classList.remove('boost-active');
  }
}

// Navegación de pasos
let cotizStep = 1;
function cotizNext(step) {
  if (step === 3) cotizCalcular();
  document.querySelectorAll('.cotiz-step').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(`cotiz-s${step}`);
  if (target) target.classList.add('active');
  cotizStep = step;
  const pct = (step / 4) * 100;
  const bar = document.getElementById('cotiz-bar');
  if (bar) bar.style.width = pct + '%';
  const lbl = document.getElementById('cotiz-step-label');
  if (lbl) {
    const labels = ['', 'Paso 1 de 4', 'Paso 2 de 4', 'Tu resultado', 'Último paso'];
    lbl.textContent = labels[step] || '';
  }
  // Scroll al card si está fuera de vista
  target?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Cálculo principal
function cotizCalcular() {
  const ahorro  = parseMoney(document.getElementById('cotiz-ahorro')?.value);
  const mensual = parseMoney(document.getElementById('cotiz-mensual')?.value);
  const ingreso = parseMoney(document.getElementById('cotiz-ingreso')?.value);
  const empleo  = document.getElementById('cotiz-empleo')?.value || 'independiente';
  const usaPrimas    = document.getElementById('boost-primas')?.checked && empleo === 'empleado';
  const usaCesantias = document.getElementById('boost-cesantias')?.checked && empleo === 'empleado';

  // Potenciadores: 3 años de obra
  // Primas: Jun y Dic = 2 × (ingreso/2) × 3 años = 3 × ingreso
  // Cesantías: Mar = 1 × ingreso × 3 años = 3 × ingreso
  const totalPrimas    = usaPrimas    ? (ingreso / 2) * 2 * 3 : 0;
  const totalCesantias = usaCesantias ? ingreso * 3 : 0;

  // Total que acumula durante la obra
  const acumMensual  = mensual * PLAZO_OBRA;
  const totalAcumulado = ahorro + acumMensual + totalPrimas + totalCesantias;
  const falta = Math.max(0, CUOTA_NETA_A - totalAcumulado);

  // ¿En cuántos meses completa (sin boosts)?
  let mesesBase = Infinity;
  const faltaSinBoosts = Math.max(0, CUOTA_NETA_A - ahorro - acumMensual);
  if (faltaSinBoosts <= 0) { mesesBase = 0; }
  else if (mensual > 0)   { mesesBase = Math.ceil((CUOTA_NETA_A - ahorro) / mensual); }

  // Calificación hipotecaria
  const maxCuotaBanco   = ingreso * 0.30;
  const calificaCredito = ingreso > 0 ? CUOTA_HIPOTECARIA <= maxCuotaBanco : null;

  // Semáforo
  const listo   = falta <= 0;
  const semVerde = listo;
  const semAmarillo = !listo && mesesBase <= PLAZO_OBRA;
  const sem = semVerde
    ? { color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0', icon: 'fa-check-circle',       txt: '¡Puedes hacerlo! Tienes o acumulas la cuota inicial en el plazo de obra.' }
    : semAmarillo
    ? { color: '#C8A96E', bg: '#FEF9EE', border: '#E5D5AA', icon: 'fa-clock',               txt: 'Puedes lograrlo ahorrando durante los 36 meses de construcción.' }
    : { color: '#EF4444', bg: '#FEF2F2', border: '#FCA5A5', icon: 'fa-exclamation-circle',  txt: 'Con tu ahorro actual no alcanzas en los 36 meses. Ajusta el plan abajo.' };

  let html = '';

  // Banner semáforo
  html += `<div style="display:flex;align-items:flex-start;gap:12px;padding:14px 16px;background:${sem.bg};border:1.5px solid ${sem.border};border-radius:12px;margin-bottom:16px">
    <i class="fas ${sem.icon}" style="color:${sem.color};font-size:1.4rem;flex-shrink:0;margin-top:1px"></i>
    <span style="font-size:.875rem;color:#1F2937;font-weight:600;line-height:1.45">${sem.txt}</span>
  </div>`;

  // Desglose cuota inicial
  html += `<div style="background:#F8F6F2;border-radius:12px;padding:14px 16px;margin-bottom:12px">
    <div style="font-size:.68rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#9CA3AF;margin-bottom:10px">Cuota inicial</div>
    <div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:.85rem"><span style="color:#6B7280">Precio Proyecto Asia</span><span style="font-weight:600">${fmtCOPFull(PRECIO_ASIA)}</span></div>
    <div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:.85rem"><span style="color:#6B7280">Cuota inicial (30%)</span><span style="font-weight:600;color:#313133">${fmtCOPFull(CUOTA_INICIAL_A)}</span></div>
    <div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:.85rem"><span style="color:#10B981"><i class="fas fa-home"></i> Subsidio Mi Casa Ya</span><span style="font-weight:600;color:#10B981">− ${fmtCOPFull(SUBSIDIO_MAX)}</span></div>
    <div style="border-top:1px solid #E5E7EB;margin:8px 0 6px"></div>
    <div style="display:flex;justify-content:space-between;font-size:.9rem"><span style="font-weight:700">Tu cuota neta</span><span style="font-weight:800;color:#C8A96E;font-size:1rem">${fmtCOPFull(CUOTA_NETA_A)}</span></div>
  </div>`;

  // Plan de acumulación
  html += `<div style="background:#F8F6F2;border-radius:12px;padding:14px 16px;margin-bottom:12px">
    <div style="font-size:.68rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#9CA3AF;margin-bottom:10px">Tu plan de ahorro (36 meses)</div>`;

  if (ahorro > 0) {
    html += `<div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:.85rem"><span style="color:#6B7280">Ahorros actuales</span><span style="font-weight:600;color:#10B981">${fmtCOPFull(ahorro)}</span></div>`;
  }
  if (mensual > 0) {
    html += `<div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:.85rem"><span style="color:#6B7280">Cuotas mensuales (${PLAZO_OBRA} meses)</span><span style="font-weight:600">${fmtCOPFull(acumMensual)}</span></div>`;
  }
  if (usaPrimas && totalPrimas > 0) {
    html += `<div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:.85rem"><span style="color:#10B981">⚡ Primas (Jun/Dic × 3 años)</span><span style="font-weight:600;color:#10B981">+ ${fmtCOPFull(totalPrimas)}</span></div>`;
  }
  if (usaCesantias && totalCesantias > 0) {
    html += `<div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:.85rem"><span style="color:#10B981">⚡ Cesantías (Mar × 3 años)</span><span style="font-weight:600;color:#10B981">+ ${fmtCOPFull(totalCesantias)}</span></div>`;
  }

  const pctTotal = Math.min(100, Math.round((totalAcumulado / CUOTA_NETA_A) * 100));
  html += `<div style="border-top:1px solid #E5E7EB;margin:8px 0 8px"></div>
    <div style="display:flex;justify-content:space-between;margin-bottom:8px;font-size:.9rem"><span style="font-weight:700">Total que acumulas</span><span style="font-weight:800;color:${listo?'#10B981':'#313133'}">${fmtCOPFull(totalAcumulado)}</span></div>
    <div style="background:#E5E7EB;border-radius:6px;height:10px;overflow:hidden;margin-bottom:6px">
      <div style="width:${pctTotal}%;height:100%;background:${listo?'#10B981':pctTotal>=60?'#C8A96E':'#EF4444'};border-radius:6px;transition:width .8s ease"></div>
    </div>
    <div style="font-size:.78rem;color:#6B7280;text-align:right">${pctTotal}% de la cuota neta</div>`;

  if (!listo && mensual > 0) {
    const necesario = Math.ceil(CUOTA_NETA_A / PLAZO_OBRA);
    html += `<div style="margin-top:10px;padding:10px 12px;background:#FEF9EE;border-left:3px solid #C8A96E;border-radius:0 8px 8px 0;font-size:.8rem;color:#1F2937;line-height:1.45">
      💡 Para completarlo en los 36 meses necesitarías aportar <strong>${fmtCOP(necesario)}/mes</strong> (sin contar potenciadores).
    </div>`;
  }
  html += `</div>`;

  // Crédito hipotecario
  html += `<div style="background:#F8F6F2;border-radius:12px;padding:14px 16px;margin-bottom:14px">
    <div style="font-size:.68rem;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:#9CA3AF;margin-bottom:10px">Crédito hipotecario (70%)</div>
    <div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:.85rem"><span style="color:#6B7280">Monto a financiar</span><span style="font-weight:600">${fmtCOPFull(HIPOTECA_A)}</span></div>
    <div style="display:flex;justify-content:space-between;margin-bottom:5px;font-size:.85rem"><span style="color:#6B7280">Plazo</span><span style="font-weight:600">20 años · 11.5% E.A.</span></div>
    <div style="border-top:1px solid #E5E7EB;margin:8px 0 6px"></div>
    <div style="display:flex;justify-content:space-between;font-size:.9rem"><span style="font-weight:700">Cuota hipotecaria est.</span><span style="font-weight:800;color:#313133;font-size:.95rem">${fmtCOPFull(CUOTA_HIPOTECARIA)}/mes</span></div>
    ${ingreso > 0 ? `<div style="margin-top:10px;padding:8px 10px;border-radius:8px;background:${calificaCredito?'#ECFDF5':'#FEF2F2'};font-size:.8rem;color:${calificaCredito?'#065F46':'#B91C1C'}">
      <i class="fas fa-${calificaCredito?'check':'times'}-circle"></i>
      ${calificaCredito
        ? `Con ingresos de ${fmtCOP(ingreso)}/mes, <strong>sí calificas</strong> al crédito hipotecario.`
        : `Con ingresos de ${fmtCOP(ingreso)}/mes necesitarías al menos <strong>${fmtCOP(Math.ceil(CUOTA_HIPOTECARIA/0.30))}/mes</strong> para calificar.`}
    </div>` : ''}
  </div>`;

  // CTA: ir al paso 4 (lead)
  html += `<button class="btn btn-whatsapp" style="width:100%;justify-content:center;margin-bottom:8px" onclick="cotizNext(4)">
    <i class="fab fa-whatsapp"></i> Quiero hablar con un asesor
  </button>`;

  const res = document.getElementById('cotiz-resultado');
  if (res) res.innerHTML = html;
}

// Lead desde cotizador
function cotizEnviarLead() {
  const nombre = document.getElementById('cotiz-nombre')?.value?.trim() || '';
  const tel    = document.getElementById('cotiz-telefono')?.value?.trim() || '';

  const ahorro  = fmtCOP(parseMoney(document.getElementById('cotiz-ahorro')?.value));
  const mensual = fmtCOP(parseMoney(document.getElementById('cotiz-mensual')?.value));
  const ingreso = fmtCOP(parseMoney(document.getElementById('cotiz-ingreso')?.value));
  const empleo  = document.getElementById('cotiz-empleo')?.value || '';

  const msg = `Hola! Soy ${nombre || 'un interesado'} y hice la simulación en su sitio web para *Proyecto Asia*.%0A`
    + `• Tipo de empleo: ${empleo}%0A`
    + `• Ingresos: ${ingreso}/mes%0A`
    + `• Ahorros: ${ahorro}%0A`
    + `• Ahorro mensual: ${mensual}/mes%0A`
    + `¿Me pueden asesorar? Gracias.`;

  window.open(`https://wa.me/573185481730?text=${msg}`, '_blank');
}

// Inicializar potenciadores toggle (event listeners)
document.addEventListener('DOMContentLoaded', () => {
  const pBoost = document.getElementById('boost-primas');
  const cBoost = document.getElementById('boost-cesantias');
  if (pBoost) pBoost.addEventListener('change', () => cotizBoostToggle('boost-primas-wrap', pBoost));
  if (cBoost) cBoost.addEventListener('change', () => cotizBoostToggle('boost-ces-wrap', cBoost));
});

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
