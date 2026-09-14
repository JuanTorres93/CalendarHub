export default function createCurrentTimeframeButton({ testid, extraClasses = [] }) {
  const button = document.createElement('button');

  button.className = ['big-numbers text', ...extraClasses].filter(Boolean).join(' ');
  button.type = 'button';
  button.setAttribute('aria-label', 'Apri mini calendario');
  button.setAttribute('aria-haspopup', 'dialog');
  button.setAttribute('data-testid', testid);

  return button;
}