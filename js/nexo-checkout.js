(() => {
  'use strict';
  const widgets = [...document.querySelectorAll('[data-nexo-checkout]')];
  if (!widgets.length) return;
  let sdkPromise;
  const configuration = fetch('/api/nexo-plans', { cache: 'no-store' }).then(response => {
    if (!response.ok) throw new Error('Plans unavailable');
    return response.json();
  });
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
  widgets.forEach(widget => {
    const fieldset = widget.querySelector('fieldset');
    const pay = widget.querySelector('[data-nexo-pay]');
    const target = widget.querySelector('[data-nexo-paypal]');
    const status = widget.querySelector('[data-nexo-status]');
    const summary = widget.querySelector('[data-nexo-summary]');
    let config;
    let configurationFailed = false;
    let buttons;
    let generation = 0;
    let approved = false;
    const selection = () => widget.querySelector('input:checked').value;
    function update() {
      generation++;
      if (buttons) {
        const previous = buttons; buttons = null;
        try { Promise.resolve(previous.close()).catch(() => {}); } catch (_) {}
      }
      target.replaceChildren();
      target.hidden = false;
      pay.hidden = false;
      const annual = selection() === 'annual';
      const price = widget.closest('.price-card')?.querySelector('.price');
      if (price) {
        const interval = document.createElement('small');
        interval.textContent = annual ? '/ año' : '/ mes';
        price.replaceChildren(document.createTextNode(annual ? 'US$ 1,100 ' : 'US$ 100 '), interval);
      }
      summary.textContent = annual
        ? 'US$ 1,100 cada año por 12 meses de servicio: un mes gratis. Renovación automática hasta que canceles.'
        : 'US$ 100 cada mes. Renovación automática hasta que canceles.';
      const plan = config?.plans?.[selection()];
      pay.disabled = !plan?.planId;
      status.textContent = configurationFailed ? 'No se pudieron cargar las opciones de pago. Recarga la página o contacta con CaSa Labs.' : !config ? 'Cargando opciones de pago…' : plan?.planId
        ? 'Elige tu frecuencia y continúa para autorizar la suscripción en PayPal.'
        : 'El pago en línea de este plan no está disponible por el momento. Contáctanos para contratar Nexo.';
    }
    fieldset.addEventListener('change', update);
    configuration.then(value => { config = value; update(); }).catch(() => {
      configurationFailed = true;
      update();
    });
    pay.addEventListener('click', async () => {
      const current = ++generation;
      const period = selection();
      const planId = config?.plans?.[period]?.planId;
      if (!planId || approved) return;
      pay.disabled = true;
      status.textContent = 'Conectando con PayPal…';
      try {
        const paypal = await loadSDK(config.clientId);
        if (generation !== current) return;
        const instance = paypal.Buttons({
          style: { shape: 'pill', color: 'blue', layout: 'vertical', label: 'subscribe' },
          onClick: () => { fieldset.disabled = true; },
          createSubscription: (_data, actions) => actions.subscription.create({ plan_id: planId }),
          onApprove: data => {
            approved = true;
            fieldset.disabled = true;
            pay.hidden = true;
            target.hidden = true;
            status.textContent = 'Autorización de suscripción ' + (period === 'annual' ? 'anual' : 'mensual') + ' recibida en PayPal. Referencia: ' + String(data.subscriptionID || 'consulta tu cuenta de PayPal') + '. Conserva la confirmación; la activación del servicio se confirma con CaSa Labs.';
          },
          onCancel: () => { fieldset.disabled = false; status.textContent = 'No se completó la autorización. Puedes volver a intentarlo o cambiar de plan.'; },
          onError: () => { fieldset.disabled = false; status.textContent = 'No se pudo completar la operación. Revisa tu cuenta de PayPal antes de reintentar o contacta con CaSa Labs.'; }
        });
        buttons = instance;
        await instance.render(target);
        if (generation !== current) { await instance.close(); return; }
        pay.hidden = true;
        status.textContent = 'Autoriza en PayPal el plan ' + (period === 'annual' ? 'anual de US$ 1,100.' : 'mensual de US$ 100.');
      } catch (_) {
        if (generation !== current) return;
        pay.disabled = false;
        fieldset.disabled = false;
        status.textContent = 'No se pudo cargar PayPal. Inténtalo de nuevo o contacta con CaSa Labs.';
      }
    });
  });
})();
