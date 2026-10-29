(() => {
  'use strict';
  const cards = [...document.querySelectorAll('.capture-card')];
  const filters = [...document.querySelectorAll('[data-filter]')];
  const dialog = document.getElementById('capture-dialog');
  if (!cards.length || !dialog || typeof dialog.showModal !== 'function') return;
  const full = document.getElementById('capture-full');
  const viewport = dialog.querySelector('.capture-viewport');
  const zoom = dialog.querySelector('[data-capture-zoom]');
  let visible = cards;
  let index = 0;
  let trigger;
  let previousOverflow;
  function resetZoom() {
    viewport.classList.remove('is-zoomed');
    viewport.scrollTop = 0;
    viewport.scrollLeft = 0;
    zoom.setAttribute('aria-pressed', 'false');
    zoom.textContent = 'Ampliar detalles';
  }
  function show(next) {
    index = (next + visible.length) % visible.length;
    const link = visible[index].querySelector('.capture-open');
    const image = link.querySelector('img');
    full.src = link.href;
    full.alt = image.alt;
    full.style.setProperty('--capture-width', image.getAttribute('width') + 'px');
    document.getElementById('capture-dialog-title').textContent = link.dataset.title;
    document.getElementById('capture-dialog-description').textContent = link.dataset.description;
    document.getElementById('capture-position').textContent = `${index + 1} de ${visible.length}`;
    document.getElementById('capture-original').href = link.href;
    resetZoom();
  }
  function filter(value, updateURL = true) {
    const selected = filters.some(button => button.dataset.filter === value) ? value : 'todos';
    cards.forEach(card => { card.hidden = selected !== 'todos' && card.dataset.group !== selected; });
    visible = cards.filter(card => !card.hidden);
    filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === selected)));
    document.getElementById('capture-count').textContent = `Mostrando ${visible.length} ${visible.length === 1 ? 'captura' : 'capturas'}`;
    if (updateURL) history.replaceState(null, '', selected === 'todos' ? '#capturas' : '#' + selected);
  }
  filters.forEach(button => button.addEventListener('click', () => filter(button.dataset.filter)));
  cards.forEach(card => card.querySelector('.capture-open').addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    trigger = event.currentTarget;
    show(visible.indexOf(card));
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialog.showModal();
    dialog.querySelector('[data-capture-close]').focus();
  }));
  dialog.querySelector('[data-capture-close]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-capture-prev]').addEventListener('click', () => show(index - 1));
  dialog.querySelector('[data-capture-next]').addEventListener('click', () => show(index + 1));
  zoom.addEventListener('click', () => {
    const enabled = viewport.classList.toggle('is-zoomed');
    zoom.setAttribute('aria-pressed', String(enabled));
    zoom.textContent = enabled ? 'Ajustar a pantalla' : 'Ampliar detalles';
  });
  dialog.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); show(index + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); show(index - 1); }
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    full.removeAttribute('src');
    trigger?.focus();
  });
  function applyHash() {
    const value = location.hash.slice(1);
    filter(value, false);
    if (filters.some(button => button.dataset.filter === value) || value === 'capturas') document.getElementById('capturas').scrollIntoView();
  }
  window.addEventListener('hashchange', applyHash);
  applyHash();
})();
