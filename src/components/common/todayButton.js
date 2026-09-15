export default function createTodayButton() {
  const button = document.createElement('button');

  button.className = 'reset';
  button.type = 'button';
  button.setAttribute('aria-label', 'Ripristina data corrente');
  button.setAttribute('data-testid', 'today-button');
  button.textContent = 'today';

  return button;
}