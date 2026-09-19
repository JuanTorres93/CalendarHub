export function createModalOverlay() {
  const overlay = document.createElement('div');

  overlay.classList.add('modal-overlay');

  overlay.setAttribute('aria-hidden', 'true');

  return overlay;
}
