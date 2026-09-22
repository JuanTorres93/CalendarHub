import { calendarLogic } from '../../../calendarLogic.js';
import { calendarPresenter } from '../../../calendarPresenter.js';

export default function createLeftArrowButton({
  timeFrame,
  ariaLabel,
  extraClasses = [],
}) {
  const button = document.createElement('button');

  button.addEventListener('click', () => goToPreviousTimeframe(timeFrame));

  button.className = ['left-arrow', ...extraClasses].filter(Boolean).join(' ');
  button.type = 'button';
  button.setAttribute('aria-label', ariaLabel);
  button.setAttribute('data-testid', `previous-${timeFrame}-button`);

  const img = document.createElement('img');
  img.src = './images/streamline-plump-color--arrow-right-circle-1-flat.svg';
  img.className = 'icons-arrow left';
  img.alt = '';
  img.setAttribute('aria-hidden', 'true');
  button.appendChild(img);

  return button;
}

function goToPreviousTimeframe(timeFrame) {
  if (timeFrame === 'month') {
    calendarLogic.prevMonth();
  }
  if (timeFrame === 'week') {
    calendarLogic.prevWeek();
  }
  if (timeFrame === 'day') {
    calendarLogic.prevDay();
  }

  calendarPresenter.render();
}
