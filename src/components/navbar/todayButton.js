import { calendarLogic } from '../../calendarLogic.js';
import { calendarPresenter } from '../../calendarPresenter.js';
import dayjs from '../../day.js';

export default function createTodayButton() {
  const button = document.createElement('button');

  button.className = 'reset';
  button.type = 'button';
  button.setAttribute('aria-label', 'Ripristina data corrente');
  button.setAttribute('data-testid', 'today-button');
  button.textContent = 'today';

  button.addEventListener('click', () => {
    calendarLogic.setDate(dayjs());
    calendarPresenter.render();
  });

  return button;
}