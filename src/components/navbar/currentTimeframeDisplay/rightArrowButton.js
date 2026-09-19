import { calendarLogic } from '../../../calendarLogic.js';

export default function createRightArrowButton({
  timeFrame,
  ariaLabel,
  extraClasses = [],
}) {
  const button = document.createElement('button');

  button.addEventListener('click', () => goToNextTimeframe(timeFrame));

  button.className = ['right-arrow', ...extraClasses].filter(Boolean).join(' ');
  button.type = 'button';
  button.setAttribute('aria-label', ariaLabel);
  button.setAttribute('data-testid', `next-${timeFrame}-button`);

  const img = document.createElement('img');
  img.src = './images/streamline-plump-color--arrow-right-circle-1-flat.svg';
  img.className = 'icons-arrow right';
  img.alt = '';
  img.setAttribute('aria-hidden', 'true');
  button.appendChild(img);

  return button;
}

function goToNextTimeframe(timeFrame) {
  if (timeFrame === 'month') {
    calendarLogic.nextMonth();
  }
  if (timeFrame === 'week') {
    calendarLogic.nextWeek();
  }
  if (timeFrame === 'day') {
    calendarLogic.nextDay();
  }

  calendarLogic.syncAll();
}
