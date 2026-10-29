(function (root, factory) {
  const pricing = factory();
  if (typeof module === 'object' && module.exports) module.exports = pricing;
  else root.NexoPricing = pricing;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const model = 'per_user_v1';
  const monthlyUnit = 14;
  const annualUnit = monthlyUnit * 11;
  function quote(value, period = 'monthly') {
    if ((typeof value !== 'number' && typeof value !== 'string') || String(value).trim() === '') return null;
    const users = Number(value);
    if (!Number.isSafeInteger(users) || users < 1 || !Number.isSafeInteger(users * monthlyUnit * 12 * 100) || !['monthly', 'annual'].includes(period)) return null;
    const monthly = users * monthlyUnit;
    const annual = users * annualUnit;
    return { users, monthly, annual, savings: monthly, period, total: period === 'annual' ? annual : monthly };
  }
  function dollars(value) {
    return 'US$ ' + new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(value);
  }
  return Object.freeze({ model, monthlyUnit, annualUnit, quote, dollars });
});
