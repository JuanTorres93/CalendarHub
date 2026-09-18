import { openMiniCalendar } from '../../miniCalendar/miniCalendar.js';

export default function createCurrentYearDisplay() {
  const container = document.createElement('div');

  container.id = 'show-year';

  const button = document.createElement('button');

  button.className = 'big-numbers year';
  button.type = 'button';
  button.setAttribute('aria-label', 'Apri mini calendario');
  button.setAttribute('aria-haspopup', 'dialog');
  button.setAttribute('data-testid', 'show-year-mini-calendar-button');

  button.addEventListener('click', (e) =>
    openMiniCalendar('normal', null, 'normal', e.currentTarget),
  );

  container.appendChild(button);

  return container;
}