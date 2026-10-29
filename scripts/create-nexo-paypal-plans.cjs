#!/usr/bin/env node
'use strict';
// Run only in a trusted terminal. This script never prints credentials or tokens.
const pricing = require('../js/nexo-pricing.js');
const productId = 'CASALABS-NEXO-USERS-V1';
const definitions = [
  { key: 'PAYPAL_NEXO_PER_USER_MONTHLY_PLAN_ID', name: 'Nexo mensual por usuario', amount: pricing.monthlyUnit.toFixed(2), unit: 'MONTH', requestId: 'casalabs-nexo-users-monthly-usd14-v1' },
  { key: 'PAYPAL_NEXO_PER_USER_ANNUAL_PLAN_ID', name: 'Nexo anual por usuario - un mes gratis', amount: pricing.annualUnit.toFixed(2), unit: 'YEAR', requestId: 'casalabs-nexo-users-annual-usd154-v1' }
];
const payload = plan => ({
  product_id: productId,
  name: plan.name,
  description: plan.unit === 'YEAR' ? '12 meses de Nexo por US$ 154 por usuario; paga 11 meses y recibe 12. Renovación anual.' : 'Suscripción mensual a Nexo por US$ 14 por usuario. Renovación mensual.',
  status: 'ACTIVE',
  quantity_supported: true,
  billing_cycles: [{ frequency: { interval_unit: plan.unit, interval_count: 1 }, tenure_type: 'REGULAR', sequence: 1, total_cycles: 0, pricing_scheme: { fixed_price: { value: plan.amount, currency_code: 'USD' } } }],
  payment_preferences: { auto_bill_outstanding: true, payment_failure_threshold: 3 }
});
if (process.argv.includes('--dry-run')) {
  console.log(JSON.stringify({ mode: 'dry-run', createsCharges: false, product: { id: productId, name: 'Nexo por usuario', type: 'SERVICE', category: 'SOFTWARE' }, plans: definitions.map(payload) }, null, 2));
  process.exit(0);
}
const clientId = process.env.PAYPAL_API_CLIENT_ID;
const secret = process.env.PAYPAL_API_CLIENT_SECRET;
if (!clientId || !secret) {
  console.error('Missing PAYPAL_API_CLIENT_ID or PAYPAL_API_CLIENT_SECRET. Configure them securely; do not paste secrets in chat. No PayPal request was made.');
  process.exit(1);
}
const sandbox = process.argv.includes('--sandbox');
const save = process.argv.includes('--save');
if (sandbox && save) { console.error('Refusing to save sandbox plans into the production configuration.'); process.exit(1); }
let saveTarget;
if (save) {
  saveTarget = require('node:path').resolve(__dirname, '../config/nexo-paypal-plans.json');
  const existing = JSON.parse(require('node:fs').readFileSync(saveTarget, 'utf8'));
  if (existing.clientId && existing.clientId !== clientId) { console.error('A different merchant application is already configured; no changes were made.'); process.exit(1); }
}
const base = sandbox ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';
async function checked(response) {
  if (!response.ok) throw new Error('PayPal request failed with HTTP ' + response.status + '. Check account access and the PayPal application credentials.');
  return response.status === 204 ? null : response.json();
}
(async () => {
  const auth = await checked(await fetch(base + '/v1/oauth2/token', {
    method: 'POST', headers: { Authorization: 'Basic ' + Buffer.from(clientId + ':' + secret).toString('base64'), 'Content-Type': 'application/x-www-form-urlencoded' },
    body: 'grant_type=client_credentials', signal: AbortSignal.timeout(30000)
  }));
  const request = async (path, options = {}) => fetch(base + path, {
    ...options,
    headers: { Authorization: 'Bearer ' + auth.access_token, 'Content-Type': 'application/json', ...options.headers },
    signal: AbortSignal.timeout(30000)
  });
  const product = await request('/v1/catalogs/products/' + productId);
  if (product.status === 404) {
    await checked(await request('/v1/catalogs/products', { method: 'POST', headers: { 'PayPal-Request-Id': 'casalabs-nexo-users-product-v1' }, body: JSON.stringify({ id: productId, name: 'Nexo por usuario', description: 'Plataforma de gestión de trabajo y colaboración de CaSa Labs.', type: 'SERVICE', category: 'SOFTWARE', home_url: 'https://casalabs.com.do/nexo' }) }));
  } else {
    const existing = await checked(product);
    if (existing.name !== 'Nexo por usuario' || existing.type !== 'SERVICE') throw new Error('The existing product identifier belongs to a different product; no plans were changed.');
  }
  const existingPlans = [];
  for (let page = 1; page <= 100; page++) {
    const listing = await checked(await request('/v1/billing/plans?product_id=' + productId + '&page_size=20&page=' + page + '&total_required=true'));
    existingPlans.push(...(listing.plans || []));
    if (!listing.links?.some(link => link.rel === 'next')) break;
    if (page === 100) throw new Error('Plan discovery exceeded its limit; refusing to create duplicates.');
  }
  const ids = {};
  for (const plan of definitions) {
    let matching;
    for (const entry of existingPlans.filter(entry => entry.name === plan.name && entry.status === 'ACTIVE')) {
      const detail = await checked(await request('/v1/billing/plans/' + encodeURIComponent(entry.id)));
      const cycles = detail.billing_cycles || [];
      const cycle = cycles[0];
      if (detail.product_id === productId && detail.quantity_supported === true && cycles.length === 1 && cycle.tenure_type === 'REGULAR' && cycle.total_cycles === 0 && cycle.frequency.interval_unit === plan.unit && cycle.frequency.interval_count === 1 && cycle.pricing_scheme.fixed_price.currency_code === 'USD' && Number(cycle.pricing_scheme.fixed_price.value) === Number(plan.amount)) { matching = detail; break; }
    }
    if (!matching) matching = await checked(await request('/v1/billing/plans', { method: 'POST', headers: { 'PayPal-Request-Id': plan.requestId }, body: JSON.stringify(payload(plan)) }));
    const verified = await checked(await request('/v1/billing/plans/' + encodeURIComponent(matching.id)));
    const cycle = verified.billing_cycles?.[0];
    if (verified.status !== 'ACTIVE' || verified.product_id !== productId || verified.quantity_supported !== true || verified.billing_cycles.length !== 1 || cycle?.tenure_type !== 'REGULAR' || cycle?.total_cycles !== 0 || cycle?.frequency.interval_unit !== plan.unit || cycle?.frequency.interval_count !== 1 || cycle?.pricing_scheme.fixed_price.currency_code !== 'USD' || Number(cycle?.pricing_scheme.fixed_price.value) !== Number(plan.amount)) throw new Error('PayPal returned a plan with unexpected status or billing terms.');
    ids[plan.key] = verified.id;
  }
  if (save) {
    require('node:fs').writeFileSync(saveTarget, JSON.stringify({ pricingModel: pricing.model, clientId, monthlyPlanId: ids.PAYPAL_NEXO_PER_USER_MONTHLY_PLAN_ID, annualPlanId: ids.PAYPAL_NEXO_PER_USER_ANNUAL_PLAN_ID }, null, 2) + '\n');
  }
  console.log(sandbox ? 'Sandbox plans verified. Do not use them in production.' : 'Production plans verified. No subscriptions or charges were created.');
  // The following output contains only public IDs for deployment configuration.
  console.log(JSON.stringify({ PAYPAL_API_CLIENT_ID: clientId, ...ids }, null, 2));
})().catch(error => { console.error(error.message); process.exitCode = 1; });
