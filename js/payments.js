(() => {
  'use strict';
  const templates = [...document.querySelectorAll('script[data-payment-script]')];
  if (!templates.length) return;
  let activation;
  let ready = false;
  const controls = [];
  const notice = document.createElement('p');
  notice.className = 'payment-notice';
  notice.textContent = 'Al activar el pago se conectará con PayPal para mostrar sus opciones. Revisa las condiciones y la política de privacidad antes de continuar.';
  const checkout = document.querySelector('#checkout-panel, #panel-digital');
  checkout?.prepend(notice);
  function error() {
    document.querySelectorAll('.payment-error').forEach(el => el.remove());
    const message = document.createElement('p');
    message.className = 'payment-error payment-notice';
    message.setAttribute('role', 'alert');
    message.textContent = 'No se pudo cargar PayPal. Recarga la página para volver a intentarlo o contacta con soporte. Si ya autorizaste un pago, revisa tu cuenta antes de reintentar.';
    (checkout || document.querySelector('main') || document.body).appendChild(message);
    controls.forEach(button => { button.disabled = false; });
  }
  document.addEventListener('casalabs:payment-error', error);
  async function activate() {
    if (activation) return activation;
    controls.forEach(button => { button.disabled = true; });
    activation = (async () => {
      for (const template of templates) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          if (template.dataset.src) {
            script.src = template.dataset.src;
            const timeout = setTimeout(() => reject(new Error('PayPal load timeout')), 20000);
            script.onload = () => { clearTimeout(timeout); resolve(); };
            script.onerror = () => { clearTimeout(timeout); reject(new Error('PayPal unavailable')); };
          } else script.textContent = template.textContent;
          document.head.appendChild(script);
          if (!template.dataset.src) resolve();
        });
      }
      ready = true;
      controls.filter(button => button.id !== 'web-adquirir-btn').forEach(button => button.remove());
      controls.forEach(button => { button.disabled = false; });
    })().catch(cause => { error(); throw cause; });
    return activation;
  }
  // Retain the existing one-time checkout interaction while deferring its SDK.
  const webButton = document.getElementById('web-adquirir-btn');
  if (webButton) {
    controls.push(webButton);
    webButton.removeAttribute('onclick');
    webButton.addEventListener('click', async () => {
      try { await activate(); if (ready) window.showWebPayment(); } catch (_) {}
    });
  }
  for (const id of ['paypal-direct-btn', 'paypal-tescucho-btn', 'paypal-button-container-P-1AG61239YH377373NNLQCLFA']) {
    const container = document.getElementById(id);
    if (!container) continue;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'payment-activate';
    button.textContent = 'Activar pago seguro con PayPal';
    controls.push(button);
    container.appendChild(button);
    button.addEventListener('click', () => { activate().catch(() => {}); });
  }
})();
