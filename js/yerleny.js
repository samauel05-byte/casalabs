(function () {
  'use strict';

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

  /* ── local knowledge base fallback ── */
  var KB = [
    { k: ['web','página','pagina','sitio','landing','tienda','online','ecommerce','precio','costo','cuanto','cuánto'],
      a: 'Tenemos tres planes de páginas web:\n• Básico (5 secciones): US$250\n• Empresarial (10 secciones + blog): US$499\n• Tienda Online (e-commerce): US$800\nTodos son pago único, a la medida. ¿Te interesa alguno? Podemos empezar hoy por WhatsApp 👉 +1 (849) 408-8173' },
    { k: ['cami','606','607','contable','tributario','it-1','ir-2','cardnet','azul'],
      a: 'CAMI es nuestra plataforma contable y tributaria. Procesa los formatos 606 y 607, CardNET, Azul y balances. Facilita el IT-1 mensual y el cierre anual del IR-2.\nCosto: US$150/mes. ¿Quieres más info? Escríbenos por WhatsApp al +1 (849) 408-8173 🙌' },
    { k: ['nala','factura','foto','pdf','ocr','extrae','extract','617','ir-17'],
      a: 'NALA convierte fotos y PDFs de facturas en archivos 606, 607 e IR-17 listos para la DGII, usando inteligencia artificial.\nCosto: US$0.30 por factura procesada. ¡Sin contratos ni mensualidades! Escríbenos para probarlo: +1 (849) 408-8173' },
    { k: ['direct','tss','bóveda','boveda','contraseña','contraseñas','portal','dgii login','acceso'],
      a: 'Direct es una bóveda de credenciales con auto-login a DGII, TSS, Ministerio de Trabajo, CardNET, Azul, IDOPPRIL, ONAPI y más. Tus contraseñas se cifran con AES-256 directamente en tu navegador, nunca viajan en texto plano. Escríbenos para saber más: +1 (849) 408-8173' },
    { k: ['tescucho','audio','transcri','voz','word','grabaci'],
      a: 'TescuchO transcribe audios y notas de voz a Word, procesado directamente en tu computadora (sin subir tus archivos a ningún servidor). Perfecto para médicos, abogados y profesionales. Visita casalabs.com.do/tescucho para ver los precios 🎧' },
    { k: ['niduvo','nube','almacen','cloud','archivos','storage'],
      a: 'Niduvo es nuestra solución de almacenamiento en la nube empresarial: acceso desde cualquier dispositivo, seguro y pensado para equipos de trabajo. ¿Quieres cotizar para tu empresa? Escríbenos al +1 (849) 408-8173' },
    { k: ['dominio','correo','email','profesional','hosting'],
      a: 'Ofrecemos registro de dominios y configuración completa de correo profesional (tunombre@tuempresa.com). Nos encargamos de todo: DNS, certificados y configuración. Escríbenos para cotizar: +1 (849) 408-8173' },
    { k: ['facturador','ecf','e-cf','comprobante','fiscal','electrónico'],
      a: 'Configuramos tu facturador electrónico (e-CF) para cumplir con la DGII. Nos encargamos de la instalación, el certificado digital y la puesta en marcha. ¿Cuándo quieres empezar? 📲 +1 (849) 408-8173' },
    { k: ['precio','costo','cuanto','cuánto','cobran','vale'],
      a: 'Nuestros servicios van desde US$0.30/factura (NALA) hasta US$800 (tienda online). Cada proyecto es a la medida. Visita casalabs.com.do/servicios para ver todos los precios, o escríbenos al +1 (849) 408-8173 para una cotización personalizada.' },
    { k: ['whatsapp','contacto','llamar','escribir','hablar','comunicar'],
      a: 'Puedes escribirnos directamente por WhatsApp al +1 (849) 408-8173. También por correo a info@casalabs.com.do. Respondemos en menos de 72 horas 📩' },
    { k: ['hola','buenos','buenas','saludos','hi','hey'],
      a: '¡Hola! 👋 Soy Yerleny, la asistente de CaSa Labs. Puedo ayudarte con información sobre nuestros servicios: páginas web, facturación electrónica (CAMI, NALA, Direct), TescuchO y más. ¿En qué te puedo ayudar?' },
    { k: ['gracias','thank','genial','perfecto','excelente'],
      a: '¡Con gusto! 😊 Si tienes más preguntas o quieres contratar algún servicio, estamos disponibles por WhatsApp al +1 (849) 408-8173. ¡Éxito en tu negocio!' }
  ];

  function localReply(text) {
    var t = text.toLowerCase();
    for (var i = 0; i < KB.length; i++) {
      for (var j = 0; j < KB[i].k.length; j++) {
        if (t.indexOf(KB[i].k[j]) !== -1) return KB[i].a;
      }
    }
    return 'Gracias por tu mensaje. Para darte la mejor respuesta, escríbenos directamente por WhatsApp al +1 (849) 408-8173 o a info@casalabs.com.do. ¡Te atendemos encantados! 🙌';
  }

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

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history })
    })
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var reply = (data.choices && data.choices[0] && data.choices[0].message &&
                   data.choices[0].message.content)
        ? data.choices[0].message.content.trim()
        : localReply(history[history.length - 1].content);
      hideTyping();
      history.push({ role: 'assistant', content: reply });
      addMsg('bot', reply);
    })
    .catch(function() {
      hideTyping();
      var reply = localReply(history[history.length - 1].content);
      history.push({ role: 'assistant', content: reply });
      addMsg('bot', reply);
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
