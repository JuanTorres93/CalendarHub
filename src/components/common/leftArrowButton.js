export default function createLeftArrowButton({ testid, ariaLabel, extraClasses = [] }) {
  const button = document.createElement('button');

  button.className = ['left-arrow', ...extraClasses].filter(Boolean).join(' ');
  button.type = 'button';
  button.setAttribute('aria-label', ariaLabel);
  button.setAttribute('data-testid', testid);

  const img = document.createElement('img');
  img.src = './images/streamline-plump-color--arrow-right-circle-1-flat.svg';
  img.className = 'icons-arrow left';
  img.alt = '';
  img.setAttribute('aria-hidden', 'true');
  button.appendChild(img);

  return button;
}