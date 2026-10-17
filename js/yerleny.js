(function () {
  'use strict';

  // API key is visible in client-side code — for a static site this is unavoidable.
  // Generate a key with usage limits at openrouter.ai/settings/keys if needed.
  var API_KEY = 'OPENROUTER_API_KEY';
  var MODEL   = 'meta-llama/llama-3.2-3b-instruct:free';
  var SITE_URL = 'https://casalabs.com.do';
  var SITE_NAME = 'CaSa Labs';

  var SYSTEM =
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

  var history = [];
  var isOpen  = false;

  /* ── CSS ── */
  var styleEl = document.createElement('style');
  styleEl.textContent = [
    '#yl-btn{position:fixed;bottom:22px;left:22px;z-index:9000;width:56px;height:56px;',
    'border-radius:50%;background:#1D2B5E;color:#fff;border:none;cursor:pointer;',
    'display:flex;align-items:center;justify-content:center;',
    'box-shadow:0 6px 18px rgba(29,43,94,.45);',
    'transition:background .15s,transform .15s;',
    'font-family:\'Fraunces\',serif;font-size:1.25rem;font-weight:700;}',
    '#yl-btn:hover{background:#2C3E82;transform:translateY(-2px);}',
    '.yl-badge{position:absolute;top:-2px;right:-2px;width:14px;height:14px;',
    'border-radius:50%;background:#2F8C4D;border:2.5px solid #fff;',
    'animation:yl-pulse 2.2s ease-in-out infinite;}',
    '@keyframes yl-pulse{0%,100%{opacity:1;}50%{opacity:.35;}}',

    '#yl-panel{position:fixed;bottom:90px;left:22px;z-index:9001;',
    'width:340px;background:#fff;border-radius:16px;',
    'box-shadow:0 20px 60px rgba(0,0,0,.18),0 2px 8px rgba(0,0,0,.07);',
    'display:flex;flex-direction:column;overflow:hidden;',
    'transform:scale(.92) translateY(18px);opacity:0;transform-origin:bottom left;',
    'transition:transform .22s cubic-bezier(.4,0,.2,1),opacity .2s ease;',
    'pointer-events:none;}',
    '#yl-panel.yl-open{transform:scale(1) translateY(0);opacity:1;pointer-events:all;}',

    '#yl-head{background:linear-gradient(135deg,#1D2B5E 0%,#12193E 100%);',
    'padding:13px 14px;display:flex;align-items:center;gap:11px;}',
    '.yl-av{width:38px;height:38px;border-radius:50%;background:rgba(255,255,255,.14);',
    'display:flex;align-items:center;justify-content:center;',
    'font-family:\'Fraunces\',serif;font-size:1.1rem;font-weight:700;color:#fff;flex-shrink:0;',
    'border:2px solid rgba(255,255,255,.24);}',
    '.yl-hi{flex:1;min-width:0;}',
    '.yl-hi strong{display:block;color:#fff;font-size:.94rem;font-family:\'Fraunces\',serif;}',
    '.yl-hi span{font-size:.73rem;color:rgba(255,255,255,.58);display:flex;align-items:center;gap:5px;}',
    '.yl-hi span::before{content:\'\';width:7px;height:7px;border-radius:50%;',
    'background:#2F8C4D;display:inline-block;flex-shrink:0;}',
    '#yl-close{background:none;border:none;color:rgba(255,255,255,.55);',
    'cursor:pointer;padding:4px;border-radius:6px;',
    'transition:color .15s;display:flex;align-items:center;}',
    '#yl-close:hover{color:#fff;}',

    '#yl-msgs{flex:1;overflow-y:auto;padding:14px;',
    'display:flex;flex-direction:column;gap:10px;',
    'min-height:240px;max-height:320px;}',
    '#yl-msgs::-webkit-scrollbar{width:4px;}',
    '#yl-msgs::-webkit-scrollbar-thumb{background:#E4E1D6;border-radius:4px;}',

    '.yl-m{display:flex;gap:8px;max-width:90%;}',
    '.yl-m.yl-u{align-self:flex-end;flex-direction:row-reverse;}',
    '.yl-m.yl-a{align-self:flex-start;}',
    '.yl-ma{width:24px;height:24px;border-radius:50%;flex-shrink:0;',
    'display:flex;align-items:center;justify-content:center;',
    'font-size:.62rem;font-weight:700;margin-top:2px;}',
    '.yl-a .yl-ma{background:#F1F3FA;color:#1D2B5E;font-family:\'Fraunces\',serif;}',
    '.yl-u .yl-ma{background:#E8F5EC;color:#1E5631;}',
    '.yl-b{padding:8px 12px;border-radius:12px;',
    'font-size:.87rem;line-height:1.55;color:#14181F;word-break:break-word;}',
    '.yl-a .yl-b{background:#F6F4EE;border-bottom-left-radius:3px;}',
    '.yl-u .yl-b{background:#1D2B5E;color:#fff;border-bottom-right-radius:3px;}',

    '.yl-dots{display:flex;align-items:center;gap:4px;padding:8px 12px;}',
    '.yl-d{width:7px;height:7px;border-radius:50%;background:#9FA7C4;',
    'animation:yl-bop .9s ease-in-out infinite;}',
    '.yl-d:nth-child(2){animation-delay:.18s;}',
    '.yl-d:nth-child(3){animation-delay:.36s;}',
    '@keyframes yl-bop{0%,80%,100%{transform:translateY(0);}40%{transform:translateY(-6px);}}',

    '#yl-form{border-top:1px solid #E4E1D6;padding:10px 12px;',
    'display:flex;gap:8px;align-items:flex-end;background:#fff;}',
    '#yl-inp{flex:1;border:1.5px solid #E4E1D6;border-radius:10px;',
    'padding:8px 11px;font-size:.87rem;font-family:\'Inter\',sans-serif;',
    'resize:none;outline:none;line-height:1.45;max-height:80px;',
    'color:#14181F;transition:border-color .15s;}',
    '#yl-inp:focus{border-color:#2C3E82;}',
    '#yl-snd{width:36px;height:36px;border-radius:10px;flex-shrink:0;',
    'background:#1D2B5E;border:none;cursor:pointer;color:#fff;',
    'display:flex;align-items:center;justify-content:center;',
    'transition:background .15s;}',
    '#yl-snd:hover{background:#2C3E82;}',
    '#yl-snd:disabled{background:#C8CCE0;cursor:not-allowed;}',
    '.yl-pw{text-align:center;font-size:.67rem;color:#B0B8D0;padding:3px 0 8px;background:#fff;}',

    '@media(max-width:400px){',
    '#yl-panel{width:calc(100vw - 32px);left:16px;}',
    '}'
  ].join('');
  document.head.appendChild(styleEl);

  /* ── HTML ── */
  var root = document.createElement('div');
  root.innerHTML =
    '<button id="yl-btn" aria-label="Hablar con Yerleny">' +
      'Y<span class="yl-badge"></span>' +
    '</button>' +
    '<div id="yl-panel" role="dialog" aria-label="Chat con Yerleny">' +
      '<div id="yl-head">' +
        '<div class="yl-av">Y</div>' +
        '<div class="yl-hi">' +
          '<strong>Yerleny</strong>' +
          '<span>En línea · CaSa Labs</span>' +
        '</div>' +
        '<button id="yl-close" aria-label="Cerrar">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">' +
          '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
        '</button>' +
      '</div>' +
      '<div id="yl-msgs"></div>' +
      '<div id="yl-form">' +
        '<textarea id="yl-inp" rows="1" placeholder="Escribe tu pregunta…" aria-label="Mensaje"></textarea>' +
        '<button id="yl-snd" aria-label="Enviar">' +
          '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
          '<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="yl-pw">Impulsado por OpenRouter · IA gratuita</div>' +
    '</div>';
  document.body.appendChild(root);

  /* ── refs ── */
  var btn   = document.getElementById('yl-btn');
  var panel = document.getElementById('yl-panel');
  var close = document.getElementById('yl-close');
  var msgs  = document.getElementById('yl-msgs');
  var inp   = document.getElementById('yl-inp');
  var snd   = document.getElementById('yl-snd');

  /* ── helpers ── */
  function addMsg(role, text) {
    var bot = role === 'bot';
    var el  = document.createElement('div');
    el.className = 'yl-m ' + (bot ? 'yl-a' : 'yl-u');
    el.innerHTML =
      '<div class="yl-ma">' + (bot ? 'Y' : 'Tú') + '</div>' +
      '<div class="yl-b">' + escHtml(text).replace(/\n/g, '<br>') + '</div>';
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function escHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function showTyping() {
    var el = document.createElement('div');
    el.className = 'yl-m yl-a'; el.id = 'yl-typing';
    el.innerHTML = '<div class="yl-ma">Y</div><div class="yl-b yl-dots">' +
      '<div class="yl-d"></div><div class="yl-d"></div><div class="yl-d"></div></div>';
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function hideTyping() {
    var t = document.getElementById('yl-typing');
    if (t) t.remove();
  }

  /* ── welcome ── */
  addMsg('bot', '¡Hola! Soy Yerleny, la asistente virtual de CaSa Labs 👋\n¿En qué puedo ayudarte hoy?');

  /* ── toggle ── */
  function openPanel()  { isOpen = true;  panel.classList.add('yl-open');    inp.focus(); }
  function closePanel() { isOpen = false; panel.classList.remove('yl-open'); }

  btn.addEventListener('click',   function() { isOpen ? closePanel() : openPanel(); });
  close.addEventListener('click', closePanel);
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape' && isOpen) closePanel(); });

  /* ── send ── */
  function send() {
    var text = inp.value.trim();
    if (!text || snd.disabled) return;

    inp.value = '';
    inp.style.height = '';
    snd.disabled = true;
    addMsg('user', text);
    history.push({ role: 'user', content: text });
    showTyping();

    fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + API_KEY,
        'Content-Type': 'application/json',
        'HTTP-Referer': SITE_URL,
        'X-Title': SITE_NAME
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'system', content: SYSTEM }].concat(history),
        max_tokens: 400,
        temperature: 0.72
      })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var reply = (data.choices && data.choices[0] && data.choices[0].message &&
                   data.choices[0].message.content)
        ? data.choices[0].message.content.trim()
        : 'Lo siento, no pude procesar tu mensaje. Por favor escríbenos por WhatsApp al +1 (849) 408-8173.';
      hideTyping();
      history.push({ role: 'assistant', content: reply });
      addMsg('bot', reply);
    })
    .catch(function() {
      hideTyping();
      addMsg('bot', 'Ocurrió un error de conexión. Puedes escribirnos directamente por WhatsApp al +1 (849) 408-8173.');
    })
    .finally(function() {
      snd.disabled = false;
      inp.focus();
    });
  }

  snd.addEventListener('click', send);
  inp.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  });
  inp.addEventListener('input', function() {
    this.style.height = '';
    this.style.height = Math.min(this.scrollHeight, 80) + 'px';
  });
})();
