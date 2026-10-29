// Nexo valida, registra la compra y crea la suscripción. El navegador nunca decide la licencia.
const ENDPOINT = 'https://jwdwhqzviikwreemkxzh.supabase.co/functions/v1/nexo-checkout';
module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (!['GET', 'POST'].includes(req.method)) {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Método no permitido' });
  }
  try {
    let body;
    if (req.method === 'POST') {
      body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const company = typeof body?.company === 'string' ? body.company.trim() : '';
      const email = typeof body?.email === 'string' ? body.email.trim() : '';
      const users = Number(body?.users);
      if (company.length < 2 || company.length > 120 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !Number.isInteger(users) || users < 1 || users > 500 || !['monthly', 'annual'].includes(body?.period)) return res.status(400).json({ error: 'Revisa empresa, correo y usuarios (1–500).' });
      body = { company, email, users, period: body.period };
    }
    const upstream = await fetch(ENDPOINT, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(25000)
    });
    if (!upstream.ok) return res.status(upstream.status === 400 ? 400 : 503).json({ error: 'El alta automática no está disponible. No se ha activado ninguna licencia. Contacta con CaSa Labs.' });
    const data = await upstream.json();
    if (req.method === 'GET') return res.status(200).json({ ready: data.ready === true, clientId: data.clientId, pricingModel: data.pricingModel });
    if (!/^I-[A-Z0-9]+$/.test(data.subscriptionId || '')) throw new Error('Respuesta no válida');
    return res.status(200).json({ subscriptionId: data.subscriptionId });
  } catch {
    return res.status(503).json({ error: 'No se pudo conectar con Nexo. No se ha activado ninguna licencia.' });
  }
};
