document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('footer-placeholder');
  if (!el) return;
  el.innerHTML = `
  <div class="footer-top">
    <div class="footer-brand">
      <img class="footer-logo" src="/assets/logo-casalabs-transparent.png" alt="CaSa Labs — Desarrollo web y tecnología" width="1672" height="941">
      <p>Desarrollo web, automatización fiscal y gestión digital para negocios en República Dominicana.</p>
    </div>
    <div class="footer-cols">
      <div class="footer-col">
        <h4>Navegación</h4>
        <a href="/">Inicio</a>
        <a href="/servicios">Servicios</a>
        <a href="/direct">Direct por dentro</a>
        <a href="/nosotros">Nosotros</a>
        <a href="/preguntas-frecuentes">Preguntas frecuentes</a>
        <a href="/contacto">Contacto</a>
      </div>
      <div class="footer-col footer-contact-column">
        <h4>Contacto</h4>
        <div class="footer-contact-item"><a href="tel:+18494088173" class="footer-contact-link" data-contact="phone"><span class="footer-contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.6 10.8a15.6 15.6 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20a1 1 0 0 1-1 1C10.6 21 3 13.4 3 4a1 1 0 0 1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1z"/></svg></span><span class="footer-contact-text">+1 (849) 408-8173</span></a></div>
        <div class="footer-contact-item"><a href="https://wa.me/18494088173" target="_blank" rel="noopener noreferrer" class="footer-contact-link whatsapp-link" data-contact="whatsapp"><span class="footer-contact-icon" aria-hidden="true"><svg class="whatsapp-icon" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg></span><span class="footer-contact-text">WhatsApp</span></a></div>
        <div class="footer-contact-item"><a href="https://www.instagram.com/casalabs.rd" target="_blank" rel="noopener noreferrer" class="footer-contact-link" data-contact="instagram"><span class="footer-contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2c2.72 0 3.06.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.9 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.06.06 1.4.06 4.12s-.01 3.06-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.06.05-1.4.06-4.12.06s-3.06-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.06 2 14.72 2 12s.01-3.06.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45 2.53c.64-.25 1.37-.42 2.43-.47C8.94 2.01 9.28 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 1 0 0-2.5 1.25 1.25 0 0 0 0 2.5zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/></svg></span><span class="footer-contact-text">@casalabs.rd</span></a></div>
        <div class="footer-contact-item"><a href="https://www.facebook.com/share/19UvfxFpg2/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" class="footer-contact-link" data-contact="facebook"><span class="footer-contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.23 10.44 22v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.44 2.91h-2.34V22C18.34 21.23 22 17.08 22 12.06z"/></svg></span><span class="footer-contact-text">Facebook</span></a></div>
        <div class="footer-contact-item"><a href="mailto:info@casalabs.com.do" class="footer-contact-link" data-contact="email"><span class="footer-contact-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 7 10-7"/></svg></span><span class="footer-contact-text">info@casalabs.com.do</span></a></div>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© <span id="year"></span> CaSa Labs. Todos los derechos reservados.</span>
    <span>Calle Doña Leonor #218, Edif. Ibercub Local 2 · Bávaro, Punta Cana, RD</span>
  </div>
  <nav class="legal-links" aria-label="Información legal"><a href="/aviso-legal">Aviso legal</a><a href="/politica-privacidad">Privacidad</a><a href="/politica-cookies">Cookies</a><button type="button" data-cookie-settings>Preferencias de cookies</button></nav>`;
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
