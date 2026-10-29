(() => {
  'use strict';
  const key = 'cl_cookie_consent';
  const maxAge = 365 * 24 * 60 * 60 * 1000;
  let preference = null;
  try {
    const stored = JSON.parse(localStorage.getItem(key));
    if (stored && stored.v === 2 && typeof stored.analytics === 'boolean' && typeof stored.marketing === 'boolean' && Number.isFinite(stored.ts) && stored.ts <= Date.now() && Date.now() - stored.ts < maxAge) preference = stored;
  } catch (_) { /* Storage may be blocked; navigation remains available. */ }
  const loaded = new Set();
  function activate() {
    document.querySelectorAll('script[type="text/plain"][data-consent]').forEach(source => {
      const category = source.dataset.consent;
      if (!['analytics', 'marketing'].includes(category) || !preference?.[category] || loaded.has(source)) return;
      loaded.add(source);
      const script = document.createElement('script');
      if (source.dataset.src) script.src = source.dataset.src;
      else script.textContent = source.textContent;
      document.head.appendChild(script);
    });
  }
  window.CasaConsent = { allows: category => Boolean(preference?.[category]), open: () => open() };
  let dialog, banner, previousFocus;
  function open() {
    if (!dialog) return;
    previousFocus = document.activeElement;
    dialog.querySelector('[name="analytics"]').checked = Boolean(preference?.analytics);
    dialog.querySelector('[name="marketing"]').checked = Boolean(preference?.marketing);
    dialog.showModal();
    dialog.querySelector('button').focus();
  }
  function close() { dialog.close(); previousFocus?.focus(); }
  function save(analytics, marketing) {
    const revoked = (preference?.analytics && !analytics) || (preference?.marketing && !marketing);
    preference = { v: 2, analytics, marketing, ts: Date.now() };
    let persisted = false;
    try { localStorage.setItem(key, JSON.stringify(preference)); persisted = true; } catch (_) {}
    banner.hidden = true;
    if (dialog.open) close();
    activate();
    window.dispatchEvent(new CustomEvent('casalabs:consent', { detail: { analytics, marketing } }));
    // Already-executed third-party code cannot be unloaded safely; restart after revocation.
    if (revoked && loaded.size && persisted) location.reload();
    if (!persisted) document.getElementById('consent-status').textContent = 'Preferencias aplicadas a esta página. Tu navegador no permite guardarlas.';
  }
  function init() {
    const ui = document.createElement('div');
    ui.id = 'consent-ui';
    ui.innerHTML = `<section id="consent-banner" aria-label="Preferencias de privacidad"><div><strong>Tu privacidad, tú decides</strong><p>Usamos almacenamiento local para recordar tus preferencias. No tenemos analítica ni publicidad instalada. <a href="/politica-cookies">Más información</a>.</p></div><div class="consent-actions"><button type="button" data-action="reject">Rechazar opcionales</button><button type="button" data-action="accept">Aceptar opcionales</button><button type="button" data-cookie-settings>Configurar</button></div></section><dialog id="consent-dialog" aria-labelledby="consent-title"><div class="consent-heading"><h2 id="consent-title">Preferencias de cookies</h2><button type="button" data-action="close" aria-label="Cerrar preferencias">✕</button></div><p>La navegación funciona con las opciones desactivadas. Actualmente no hay proveedores de analítica ni publicidad instalados.</p><p><strong>Necesarias:</strong> recordar esta elección y el cierre del anuncio.</p><label class="consent-option"><span>Permitir analítica</span><input type="checkbox" name="analytics"></label><label class="consent-option"><span>Permitir marketing</span><input type="checkbox" name="marketing"></label><div class="consent-actions"><button type="button" data-action="reject">Rechazar opcionales</button><button type="button" data-action="save">Guardar selección</button><button type="button" data-action="accept">Aceptar opcionales</button></div><p><a href="/politica-cookies">Política de cookies</a> · <a href="/politica-privacidad">Privacidad</a></p></dialog><p id="consent-status" role="status"></p>`;
    document.body.appendChild(ui);
    banner = document.getElementById('consent-banner');
    dialog = document.getElementById('consent-dialog');
    banner.hidden = Boolean(preference);
    document.addEventListener('click', event => {
      if (event.target.closest('[data-cookie-settings]')) open();
      const action = event.target.closest('#consent-ui [data-action]')?.dataset.action;
      if (action === 'reject') save(false, false);
      if (action === 'accept') save(true, true);
      if (action === 'save') save(dialog.querySelector('[name="analytics"]').checked, dialog.querySelector('[name="marketing"]').checked);
      if (action === 'close') close();
    });
    dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
    activate();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
