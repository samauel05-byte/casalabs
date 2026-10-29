(() => {
  'use strict';
  const widgets = [...document.querySelectorAll('[data-nexo-checkout]')];
  if (!widgets.length) return;
  let sdkPromise;
  const configuration = fetch('/api/nexo-plans', { cache: 'no-store' }).then(response => {
    if (!response.ok) throw new Error('Plans unavailable');
    return response.json();
  });
  const readiness = fetch('/api/nexo-checkout', { cache: 'no-store' }).then(r => r.ok ? r.json() : { ready: false }).catch(() => ({ ready: false }));
  function loadSDK(clientId) {
    if (window.paypalNexo) return Promise.resolve(window.paypalNexo);
    if (sdkPromise) return sdkPromise;
    sdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const query = new URLSearchParams({ 'client-id': clientId, vault: 'true', intent: 'subscription', currency: 'USD' });
      script.src = 'https://www.paypal.com/sdk/js?' + query;
      script.dataset.namespace = 'paypalNexo';
      let timeout;
      const fail = () => { clearTimeout(timeout); script.remove(); sdkPromise = null; reject(new Error('PayPal unavailable')); };
      script.onerror = fail;
      script.onload = () => { clearTimeout(timeout); if (window.paypalNexo) resolve(window.paypalNexo); else fail(); };
      timeout = setTimeout(fail, 20000);
      document.head.appendChild(script);
    });
    return sdkPromise;
  }
  const pricing = window.NexoPricing;
  if (!pricing) return;
  widgets.forEach(widget => {
    const fieldset = widget.querySelector('fieldset');
    const usersInput = widget.querySelector('[data-nexo-users]');
    const companyInput = widget.querySelector('[data-nexo-company]');
    const emailInput = widget.querySelector('[data-nexo-email]');
    let automaticReady = false;
    const detailsValid = () => companyInput.value.trim().length >= 2 && companyInput.checkValidity() && emailInput.checkValidity();
    const usersError = widget.querySelector('[data-nexo-users-error]');
    const pay = widget.querySelector('[data-nexo-pay]');
    const target = widget.querySelector('[data-nexo-paypal]');
    const status = widget.querySelector('[data-nexo-status]');
    const summary = widget.querySelector('[data-nexo-summary]');
    let config;
    let configurationFailed = false;
    let buttons;
    let generation = 0;
    let approved = false;
    const selection = () => widget.querySelector('input[type="radio"]:checked').value;
    function planFor(period) {
      const plan = config?.plans?.[period];
      const expected = period === 'annual' ? pricing.annualUnit : pricing.monthlyUnit;
      return config?.pricingModel === pricing.model && config.currency === 'USD' && plan?.quantitySupported === true && Number(plan.unitAmount) === expected && plan.planId ? plan : null;
    }
    function update() {
      generation++;
      if (buttons) {
        const previous = buttons; buttons = null;
        try { Promise.resolve(previous.close()).catch(() => {}); } catch (_) {}
      }
      target.replaceChildren();
      target.hidden = false;
      pay.hidden = false;
      const candidate = pricing.quote(usersInput.value, selection());
      const quote = candidate?.users <= 500 ? candidate : null;
      usersInput.setAttribute('aria-invalid', String(!quote));
      usersError.textContent = quote ? '' : 'Ingresa una cantidad válida de usuarios: un número entero entre 1 y 500.';
      widget.querySelector('[data-nexo-monthly-total]').textContent = quote ? 'Total: ' + pricing.dollars(quote.monthly) + ' / mes' : 'Total: —';
      widget.querySelector('[data-nexo-annual-total]').textContent = quote ? 'Total: ' + pricing.dollars(quote.annual) + ' / año' : 'Total: —';
      widget.querySelector('[data-nexo-savings]').textContent = quote ? 'Pagas 11 meses y recibes 12. Ahorras ' + pricing.dollars(quote.savings) + ' al año.' : 'Un mes gratis por usuario con el plan anual.';
      const price = widget.closest('.price-card')?.querySelector('.price');
      if (price) {
        const interval = document.createElement('small');
        interval.textContent = quote ? (quote.period === 'annual' ? '/ año' : '/ mes') : '';
        price.replaceChildren(document.createTextNode(quote ? pricing.dollars(quote.total) + ' ' : '—'), interval);
      }
      if (quote) {
        const unit = quote.period === 'annual' ? pricing.annualUnit : pricing.monthlyUnit;
        summary.textContent = quote.users + (quote.users === 1 ? ' usuario' : ' usuarios') + ' × ' + pricing.dollars(unit) + ': total ' + pricing.dollars(quote.total) + (quote.period === 'annual' ? ' cada año por 12 meses, con un mes gratis por usuario.' : ' cada mes.') + ' Renovación automática hasta que canceles.';
        const contact = widget.closest('.price-card')?.querySelector('a[href^="https://wa.me/"]');
        if (contact) {
          const url = new URL(contact.href);
          url.searchParams.set('text', 'Hola, me interesa Nexo para ' + quote.users + ' usuarios: ' + pricing.dollars(quote.total) + (quote.period === 'annual' ? ' al año.' : ' al mes.'));
          contact.href = url.href;
        }
      } else summary.textContent = 'Indica cuántas personas usarán Nexo para calcular el total de tu equipo.';
      const plan = planFor(selection());
      pay.disabled = !quote || !plan || !automaticReady || !detailsValid();
      pay.textContent = quote ? 'Pagar ' + pricing.dollars(quote.total) + (quote.period === 'annual' ? ' / año' : ' / mes') + ' con PayPal' : 'Continuar con PayPal';
      status.textContent = !quote ? 'Revisa la cantidad de usuarios para continuar.' : configurationFailed ? 'No se pudieron cargar las opciones de pago. Recarga la página o contacta con CaSa Labs.' : !config ? 'Cargando opciones de pago…' : !automaticReady ? 'El alta automática está en preparación. Contacta con CaSa Labs para contratar Nexo.' : !detailsValid() ? 'Escribe el nombre de tu empresa y un correo válido para recibir tu licencia.' : plan
        ? 'El total se calcula según tus usuarios. Continúa para autorizar la suscripción en PayPal.'
        : 'El pago en línea de este plan no está disponible por el momento. Contáctanos para contratar Nexo.';
    }
    usersInput.addEventListener('input', update);
    companyInput.addEventListener('input', update);
    emailInput.addEventListener('input', update);
    fieldset.addEventListener('change', update);
    update();
    Promise.all([configuration, readiness]).then(([value, health]) => { config = value; automaticReady = health.ready === true && health.clientId === value.clientId && health.pricingModel === pricing.model; update(); }).catch(() => { configurationFailed = true; update(); });
    pay.addEventListener('click', async () => {
      const current = ++generation;
      const period = selection();
      const quote = pricing.quote(usersInput.value, period);
      const planId = planFor(period)?.planId;
      if (!planId || !quote || quote.users > 500 || approved || !automaticReady || !detailsValid()) return;
      const purchase = { company: companyInput.value.trim(), email: emailInput.value.trim(), users: quote.users, period };
      pay.disabled = true;
      status.textContent = 'Conectando con PayPal…';
      try {
        const paypal = await loadSDK(config.clientId);
        if (generation !== current) return;
        const instance = paypal.Buttons({
          style: { shape: 'pill', color: 'blue', layout: 'vertical', label: 'subscribe' },
          onClick: () => { fieldset.disabled = true; },
          createSubscription: async () => {
            const response = await fetch('/api/nexo-checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(purchase) });
            if (!response.ok) throw new Error('No se pudo preparar la compra');
            const result = await response.json();
            if (!/^I-[A-Z0-9]+$/.test(result.subscriptionId || '')) throw new Error('Respuesta no válida');
            return result.subscriptionId;
          },
          onApprove: data => {
            approved = true;
            fieldset.disabled = true;
            pay.hidden = true;
            target.hidden = true;
            status.textContent = 'Autorización de suscripción ' + (period === 'annual' ? 'anual' : 'mensual') + ' para ' + quote.users + (quote.users === 1 ? ' usuario' : ' usuarios') + ' recibida en PayPal. Referencia: ' + String(data.subscriptionID || 'consulta tu cuenta de PayPal') + '. Al confirmar el cobro, Nexo enviará a ' + purchase.email + ' el correo «Tu licencia de Nexo está lista» con el botón «Crear mi usuario». La aprobación del navegador no activa la licencia.';
          },
          onCancel: () => { fieldset.disabled = false; status.textContent = 'No se completó la autorización. Puedes volver a intentarlo o cambiar tu selección.'; },
          onError: () => { fieldset.disabled = false; status.textContent = 'No se pudo completar la operación. Revisa tu cuenta de PayPal antes de reintentar o contacta con CaSa Labs.'; }
        });
        buttons = instance;
        await instance.render(target);
        if (generation !== current) { await instance.close(); return; }
        pay.hidden = true;
        status.textContent = 'Autoriza en PayPal ' + pricing.dollars(quote.total) + (period === 'annual' ? ' al año' : ' al mes') + ' para ' + quote.users + (quote.users === 1 ? ' usuario.' : ' usuarios.');
      } catch (_) {
        if (generation !== current) return;
        pay.disabled = false;
        fieldset.disabled = false;
        status.textContent = 'No se pudo cargar PayPal. Inténtalo de nuevo o contacta con CaSa Labs.';
      }
    });
  });
})();
