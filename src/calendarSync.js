import createMonthGrid, { getMonthView } from './components/features/calendar/monthGrid.js';
import createWeekGrid, { getWeekView } from './components/features/calendar/weekGrid.js';
import createDailyGrid, { getDayView } from './components/features/calendar/dayGrid.js';

import { navbarDomElements, navbarRenderDisplays } from './navbarBootstrap.js';

import { calendarPresenter } from './calendarPresenter.js';
import { initRenderBadge } from './to-do-list/toDoBadgeRendering.js';
import { renderEvents } from './utils/events/renderEvents.js';
import { theme } from './utils/theme.js';
import { viewSwitcher } from './utils/helpers/viewSwitcher.js';
import { initMiniCalendarDeps } from './miniCalendar/miniCalendarLogic.js';

viewSwitcher.init({
  monthView: getMonthView(),
  weekView: getWeekView(),
  dayView: getDayView(),
  displayOverlays: navbarDomElements.displayOverlays,
  displayOverlayMonth: navbarDomElements.displayOverlayMonth,
});

initMiniCalendarDeps({ displayOverlays: navbarDomElements.displayOverlays });

calendarPresenter.init({
  createMonthGrid,
  createWeekGrid,
  createDailyGrid,
  theme,
  renderEvents,
  initRenderBadge,

  renderDisplays: navbarRenderDisplays,
});

export default function initCalendar() {
  calendarPresenter.render();
}