const SYSTEM =
  'Eres Yerleny, la asistente virtual de CaSa Labs. ' +
  'Ayudas a los visitantes del sitio con preguntas sobre nuestros servicios:\n\n' +
  '- Desarrollo web: plan Básico US$250, Empresarial US$499, Tienda Online US$800 (pago único)\n' +
  '- Dominio y correo profesional (precio a cotizar según proveedor)\n' +
  '- Facturación electrónica e-CF para RD – precio a cotizar\n' +
  '- CAMI: plataforma contable y tributaria (606, 607, IT-1, IR-2, CardNET/Azul) – US$150/mes\n' +
  '- NALA: extrae datos de fotos y PDFs de facturas, genera 606, 607, IR-17 – US$0.30/factura\n' +
  '- Niduvo: almacenamiento en la nube empresarial – precio a cotizar\n\n' +
  'Eres amable, concisa y profesional. Siempre respondes en español. ' +
  'Si alguien quiere contratar o tiene preguntas muy específicas, invítalos a escribir ' +
  'por WhatsApp al +1 (849) 408-8173. No inventes precios fuera de los indicados.';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages must be an array' });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(503).json({ error: 'Chat service is not configured' });
  }

  try {
    const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + process.env.OPENROUTER_API_KEY,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://casalabs.com.do',
        'X-Title': 'CaSa Labs'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [{ role: 'system', content: SYSTEM }].concat(messages),
        max_tokens: 400,
        temperature: 0.72
      })
    });
    const data = await upstream.json();
    res.status(upstream.ok ? 200 : 502).json(data);
  } catch (_) {
    res.status(500).json({ error: 'Upstream error' });
  }
};
