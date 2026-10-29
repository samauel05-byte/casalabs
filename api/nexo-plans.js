const savedPlans = require('../config/nexo-paypal-plans.json');
// PayPal plan IDs and the client ID are public identifiers, never secret keys.
const DEFAULT_CLIENT_ID = 'BAAwv9dZ95vMy5KcTD_5wat68tsVLhXtC9yeOEwEcNLvDJe-KVhrLz02G8t8zcAqP7rJ8HagmFeSO1LIOY';
const validPlanId = value => typeof value === 'string' && /^P-[A-Z0-9]{10,40}$/.test(value) ? value : null;
module.exports = function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  return res.status(200).json({
    clientId: process.env.PAYPAL_API_CLIENT_ID || process.env.PAYPAL_CLIENT_ID || savedPlans.clientId || DEFAULT_CLIENT_ID,
    currency: 'USD',
    plans: {
      monthly: { planId: validPlanId(process.env.PAYPAL_NEXO_MONTHLY_PLAN_ID || savedPlans.monthlyPlanId), amount: '100.00', interval: 'MONTH' },
      annual: { planId: validPlanId(process.env.PAYPAL_NEXO_ANNUAL_PLAN_ID || savedPlans.annualPlanId), amount: '1100.00', interval: 'YEAR' }
    }
  });
};
