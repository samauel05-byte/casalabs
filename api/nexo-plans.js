const savedPlans = require('../config/nexo-paypal-plans.json');
const pricing = require('../js/nexo-pricing.js');
// Only public identifiers are exposed. Old flat-rate plan variables are ignored.
const DEFAULT_CLIENT_ID = 'BAAwv9dZ95vMy5KcTD_5wat68tsVLhXtC9yeOEwEcNLvDJe-KVhrLz02G8t8zcAqP7rJ8HagmFeSO1LIOY';
const validPlanId = value => typeof value === 'string' && /^P-[A-Z0-9]{10,40}$/.test(value) ? value : null;
module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const saved = savedPlans.pricingModel === pricing.model ? savedPlans : {};
  return res.status(200).json({
    pricingModel: pricing.model,
    clientId: process.env.PAYPAL_API_CLIENT_ID || process.env.PAYPAL_CLIENT_ID || saved.clientId || DEFAULT_CLIENT_ID,
    currency: 'USD',
    plans: {
      monthly: { planId: validPlanId(process.env.PAYPAL_NEXO_PER_USER_MONTHLY_PLAN_ID || saved.monthlyPlanId), unitAmount: pricing.monthlyUnit.toFixed(2), quantitySupported: true, interval: 'MONTH' },
      annual: { planId: validPlanId(process.env.PAYPAL_NEXO_PER_USER_ANNUAL_PLAN_ID || saved.annualPlanId), unitAmount: pricing.annualUnit.toFixed(2), quantitySupported: true, interval: 'YEAR' }
    }
  });
};
