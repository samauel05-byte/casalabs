document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    const setMenu = (open) => {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      document.body.classList.toggle('menu-open', open);
    };
    toggle.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && nav.classList.contains('open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) setMenu(false);
    });
  }

  document.querySelectorAll('.faq-item .faq-q').forEach((btn, index) => {
    const answer = btn.nextElementSibling;
    const answerId = `faq-answer-${index + 1}`;
    answer.id = answerId;
    btn.setAttribute('aria-controls', answerId);
    btn.setAttribute('aria-expanded', String(btn.closest('.faq-item').classList.contains('open')));
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) item.classList.add('open');
      btn.setAttribute('aria-expanded', String(!wasOpen));
    });
  });

  const whatsappButton = document.querySelector('.wa-float');
  if (whatsappButton) {
    whatsappButton.setAttribute('aria-label', 'Conversar por WhatsApp');
    whatsappButton.innerHTML = '<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 1.9 17.7L.2 24l6.5-1.7A11.8 11.8 0 0 0 24 11.8a11.7 11.7 0 0 0-3.5-8.3ZM12.1 21a9.8 9.8 0 0 1-5-1.4l-.4-.2-3.8 1 1-3.7-.3-.4A9.8 9.8 0 1 1 12.1 21Zm5.4-7.3c-.3-.1-1.8-.9-2-.9-.3-.1-.5-.1-.7.2-.2.3-.8.9-1 1.1-.2.2-.4.2-.7.1-1.7-.8-2.8-1.5-4-3.4-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.6l-.9-2c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.6.1-.9.4-.3.3-1.2 1.2-1.2 2.9 0 1.7 1.2 3.3 1.4 3.6.2.2 2.4 3.7 5.9 5.2.8.4 1.5.6 2 .7.8.3 1.6.2 2.2.1.7-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.2-.4-.3-.7-.4Z"/></svg>';
  }

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const header = document.querySelector('header.site');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const robotScene = document.createElement('div');
  robotScene.className = 'robot-scene';
  robotScene.classList.toggle('robot-home', Boolean(document.querySelector('.hero')));
  robotScene.setAttribute('aria-hidden', 'true');
  robotScene.innerHTML = `
    <div class="robot-work-panel"><span></span><span></span><span></span><i>606 · 607 · IR-17</i></div>
    <svg class="sam-robot" viewBox="0 0 260 340" role="presentation">
      <defs><linearGradient id="robot-body-gradient" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1455f5"/><stop offset="1" stop-color="#15d6e8"/></linearGradient></defs>
      <ellipse class="robot-shadow" cx="132" cy="316" rx="68" ry="13"/>
      <g class="robot-body-group">
        <path class="robot-antenna" d="M130 62V39"/><circle class="robot-antenna-light" cx="130" cy="31" r="8"/>
        <rect class="robot-head" x="75" y="62" width="110" height="82" rx="28"/><rect class="robot-face" x="88" y="78" width="84" height="47" rx="20"/>
        <g class="robot-eyes"><circle cx="112" cy="101" r="7"/><circle cx="148" cy="101" r="7"/></g><path class="robot-smile" d="M117 116c8 6 18 6 26 0"/>
        <rect class="robot-neck" x="116" y="140" width="28" height="20" rx="8"/><path class="robot-torso" d="M87 157h86c12 0 21 10 19 22l-11 75c-2 12-11 20-23 20h-56c-12 0-21-8-23-20l-11-75c-2-12 7-22 19-22Z"/>
        <path class="robot-chest" d="M107 184h46l15 15-38 38-38-38Z"/><circle class="robot-core" cx="130" cy="211" r="12"/>
        <g class="robot-arm robot-arm-left"><rect x="48" y="166" width="25" height="73" rx="12"/><circle cx="61" cy="244" r="14"/></g>
        <g class="robot-arm robot-arm-right"><rect x="187" y="166" width="25" height="73" rx="12"/><circle cx="199" cy="244" r="14"/></g>
        <g class="robot-leg robot-leg-left"><rect x="93" y="263" width="27" height="49" rx="12"/><rect x="76" y="300" width="45" height="18" rx="9"/></g>
        <g class="robot-leg robot-leg-right"><rect x="141" y="263" width="27" height="49" rx="12"/><rect x="140" y="300" width="45" height="18" rx="9"/></g>
      </g>
    </svg>`;
  document.body.appendChild(robotScene);
  const robotReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!robotReducedMotion) {
    let robotFrame = 0;
    const moveRobot = (clientX, clientY) => {
      const x = Math.max(-1, Math.min(1, (clientX / window.innerWidth - 0.5) * 2));
      const y = Math.max(-1, Math.min(1, (clientY / window.innerHeight - 0.5) * 2));
      cancelAnimationFrame(robotFrame);
      robotFrame = requestAnimationFrame(() => {
        robotScene.style.setProperty('--robot-x', `${x * 34}px`);
        robotScene.style.setProperty('--robot-y', `${y * 22}px`);
        robotScene.style.setProperty('--eye-x', `${x * 4}px`);
        robotScene.style.setProperty('--eye-y', `${y * 3}px`);
        robotScene.style.setProperty('--robot-turn', `${x * 4}deg`);
      });
    };
    window.addEventListener('pointermove', (event) => moveRobot(event.clientX, event.clientY), { passive: true });
    window.addEventListener('pointerdown', (event) => {
      moveRobot(event.clientX, event.clientY);
      robotScene.classList.remove('robot-react');
      void robotScene.offsetWidth;
      robotScene.classList.add('robot-react');
    }, { passive: true });
    document.documentElement.addEventListener('mouseleave', () => {
      robotScene.style.setProperty('--robot-x', '0px');
      robotScene.style.setProperty('--robot-y', '0px');
      robotScene.style.setProperty('--eye-x', '0px');
      robotScene.style.setProperty('--eye-y', '0px');
      robotScene.style.setProperty('--robot-turn', '0deg');
    });
  }

  const progressBar = document.createElement('div');
  progressBar.className = 'scroll-progress';
  document.body.appendChild(progressBar);
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    progressBar.style.width = `${pct}%`;
  };
  updateProgress();
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);

  const heroCard = document.querySelector('.hero-card');
  const prefersReducedMotionTilt = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroCard && window.matchMedia('(pointer: fine)').matches && !prefersReducedMotionTilt) {
    heroCard.addEventListener('mousemove', (e) => {
      const rect = heroCard.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      heroCard.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
    });
    heroCard.addEventListener('mouseleave', () => {
      heroCard.style.transform = '';
    });
  }

  const revealSelectors = '.card, .mv-card, .plan-card, .team-card, .faq-item, .contact-info-item, .section-head, .cta-band, .example-box';
  const revealEls = document.querySelectorAll(revealSelectors);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (revealEls.length && 'IntersectionObserver' in window && !prefersReducedMotion) {
    revealEls.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${(i % 4) * 80}ms`;
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  }

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const requiredFields = form.querySelectorAll('[required]');
      requiredFields.forEach(field => field.setAttribute('aria-invalid', String(!field.validity.valid)));
      if (!form.checkValidity()) {
        form.reportValidity();
        form.querySelector(':invalid')?.focus();
        return;
      }
      const data = new FormData(form);
      const nombre = String(data.get('nombre') || '').trim();
      const telefono = String(data.get('telefono') || '').trim();
      const servicio = String(data.get('servicio') || '').trim();
      const mensaje = String(data.get('mensaje') || '').trim();
      const text = `Hola, soy ${nombre}.\nServicio de interés: ${servicio}\nTeléfono: ${telefono}${mensaje ? `\nMensaje: ${mensaje}` : ''}`;
      const url = new URL('https://wa.me/18494088173');
      url.searchParams.set('text', text);
      window.open(url.toString(), '_blank', 'noopener,noreferrer');
    });
    form.querySelectorAll('[required]').forEach(field => {
      field.addEventListener('input', () => field.removeAttribute('aria-invalid'));
      field.addEventListener('change', () => field.removeAttribute('aria-invalid'));
    });
  }
});
