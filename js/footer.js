document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('footer-placeholder');
  if (!el) return;
  el.innerHTML = `
  <div class="container">
    <div class="footer-grid">
      <div>
        <div class="footer-logo"><img src="assets/favicon-logo.png" alt="Logo de CaSa Labs" style="height:48px;width:auto;"> CaSa Labs</div>
        <p>Laboratorio en CaSa, dispuesto a innovar contigo.</p>
        <div class="social-row">
          <a href="https://www.facebook.com/share/18bCMAy1KV/?mibextid=wwXIfr" aria-label="Facebook" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.23 10.44 22v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22C18.34 21.23 22 17.08 22 12.06z"/></svg></a>
          <a href="https://www.instagram.com/casalabs.rd/" aria-label="Instagram" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.9 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45.53c.64-.25 1.37-.42 2.43-.47C8.94.01 9.28 0 12 0zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.25A3.25 3.25 0 1 1 12 6.75a3.25 3.25 0 0 1 0 6.5zm5.2-8.45a1.17 1.17 0 1 1 0-2.33 1.17 1.17 0 0 1 0 2.33z" transform="translate(0 2)"/></svg></a>
          <a href="https://www.linkedin.com/in/samroa" aria-label="LinkedIn" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.11 20.45H3.56V9h3.55v11.45z"/></svg></a>
        </div>
      </div>
      <div>
        <h4>Enlaces</h4>
        <ul>
          <li><a href="index.html">Inicio</a></li>
          <li><a href="servicios.html">Servicios</a></li>
          <li><a href="nosotros.html">Nosotros</a></li>
          <li><a href="preguntas-frecuentes.html">Preguntas Frecuentes</a></li>
          <li><a href="contacto.html">Contacto</a></li>
        </ul>
      </div>
      <div>
        <h4>Servicios</h4>
        <ul>
          <li><a href="servicios.html#facturador">Facturador Electrónico</a></li>
          <li><a href="servicios.html#analisis-itbis">CAMI</a></li>
          <li><a href="servicios.html#nala">NALA</a></li>
          <li><a href="servicios.html#dominio">Servidor de Dominio</a></li>
          <li><a href="servicios.html#correo">Servidor de Correo</a></li>
          <li><a href="servicios.html#web">Páginas Web</a></li>
        </ul>
      </div>
      <div>
        <h4>Contacto</h4>
        <ul>
          <li><a href="tel:+18494088173" style="display:flex;align-items:center;gap:8px"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1z"/></svg>+1 (849) 408-8173</a></li>
          <li><a href="https://wa.me/18494088173" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:8px"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M17.47 14.38c-.27-.14-1.6-.79-1.85-.88-.25-.09-.43-.14-.61.14-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.14-1.14-.42-2.17-1.34-.8-.71-1.34-1.59-1.5-1.86-.16-.27-.02-.41.12-.55.12-.12.27-.32.41-.48.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.61-1.47-.84-2.01-.22-.53-.45-.46-.61-.47-.16-.01-.34-.01-.52-.01s-.48.07-.73.34c-.25.27-.95.93-.95 2.27s.97 2.63 1.11 2.81c.14.18 1.92 2.93 4.65 4.11.65.28 1.16.45 1.55.57.65.21 1.24.18 1.71.11.52-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.07-.11-.25-.18-.52-.32zm-5.47 7.45h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74 .98 1-3.65-.24-.38A9.86 9.86 0 0 1 2 12C2 6.48 6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z"/></svg>WhatsApp</a></li>
          <li><a href="https://www.instagram.com/casalabs.rd/" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:8px"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.9 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45.53c.64-.25 1.37-.42 2.43-.47C8.94.01 9.28 0 12 0zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" transform="translate(0 2)"/></svg>@casalabs.rd</a></li>
          <li><a href="https://www.facebook.com/share/19UvfxFpg2/?mibextid=wwXIfr" target="_blank" rel="noopener" style="display:flex;align-items:center;gap:8px"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.23 10.44 22v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22C18.34 21.23 22 17.08 22 12.06z"/></svg>Facebook</a></li>
          <li><a href="mailto:info@casalabs.com.do" style="display:flex;align-items:center;gap:8px"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg>info@casalabs.com.do</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span id="year"></span> CaSa Labs. Todos los derechos reservados.</span>
      <span>CaSa Labs</span>
    </div>
  </div>`;
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
