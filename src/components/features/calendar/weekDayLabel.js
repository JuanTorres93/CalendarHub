import { createDayLabel } from './dayLabel.js';
import { createTodoContainer } from './todoContainer.js';

export function createWeekDayLabel({ date }) {
  const weekDayLabel = document.createElement('div');
  weekDayLabel.className = 'week-day-display';
  weekDayLabel.dataset.day = date.format('YYYY-MM-DD');

  weekDayLabel.appendChild(createDayLabel({ type: 'week', date }));

  const headerContent = document.createElement('div');
  headerContent.className = 'week-header-content';

  const allDayContainer = document.createElement('div');
  allDayContainer.className = 'week-all-day-container';
  headerContent.appendChild(allDayContainer);

  headerContent.appendChild(createTodoContainer({ type: 'week' }));

  weekDayLabel.appendChild(headerContent);

  return weekDayLabel;
}