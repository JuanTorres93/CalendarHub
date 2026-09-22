import createMonthGrid from './components/features/calendar/monthGrid.js';
import createWeekGrid from './components/features/calendar/weekGrid.js';
import createDailyGrid from './components/features/calendar/dayGrid.js';

import { calendarPresenter } from './calendarPresenter.js';
import { initRenderBadge } from './to-do-list/toDoBadgeRendering.js';
import { renderEvents } from './utils/events/eventRendering.js';
import { theme } from './utils/theme.js';
import {
  currentDailyDisplay,
  currentMonthDisplay,
  currentWeekDisplay,
  currentYearDisplay,
} from './utils/helpers/dom/mainCalendarDom.js';

calendarPresenter.init({
  createMonthGrid,
  createWeekGrid,
  createDailyGrid,
  theme,
  renderEvents,
  initRenderBadge,

  currentMonthDisplay,
  currentWeekDisplay,
  currentDailyDisplay,
  currentYearDisplay,
});

export default function initCalendar() {
  calendarPresenter.render();
}