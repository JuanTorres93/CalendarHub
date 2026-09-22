import createMonthGrid, { getMonthView } from './components/features/calendar/monthGrid.js';
import createWeekGrid, { getWeekView } from './components/features/calendar/weekGrid.js';
import createDailyGrid, { getDayView } from './components/features/calendar/dayGrid.js';

import createCurrentTimeframeDisplay from './components/navbar/currentTimeframeDisplay/currentTimeframeDisplay.js';
import createCurrentYearDisplay from './components/navbar/currentYearDisplay.js';

import { calendarPresenter } from './calendarPresenter.js';
import { initRenderBadge } from './to-do-list/toDoBadgeRendering.js';
import { renderEvents } from './utils/events/eventRendering.js';
import { theme } from './utils/theme.js';
import { viewSwitcher } from './utils/helpers/viewSwitcher.js';
import { initMiniCalendarDeps } from './miniCalendar/miniCalendar.js';

const monthDisplay = createCurrentTimeframeDisplay('month');
const weekDisplay = createCurrentTimeframeDisplay('week');
const dayDisplay = createCurrentTimeframeDisplay('day');
const yearDisplay = createCurrentYearDisplay();

const firstLayer = document.getElementById('first-layer');
const layer = document.getElementById('layer');
const actionBtns = layer.querySelector('.action-btns');

firstLayer.appendChild(yearDisplay.node);
layer.insertBefore(monthDisplay.node, actionBtns);
layer.insertBefore(weekDisplay.node, actionBtns);
layer.insertBefore(dayDisplay.node, actionBtns);

const displayOverlays = [monthDisplay.node, weekDisplay.node, dayDisplay.node];

viewSwitcher.init({
  monthView: getMonthView(),
  weekView: getWeekView(),
  dayView: getDayView(),
  displayOverlays,
  displayOverlayMonth: monthDisplay.node,
});

initMiniCalendarDeps({ displayOverlays });

calendarPresenter.init({
  createMonthGrid,
  createWeekGrid,
  createDailyGrid,
  theme,
  renderEvents,
  initRenderBadge,

  renderDisplays: [
    monthDisplay.render,
    weekDisplay.render,
    dayDisplay.render,
    yearDisplay.render,
  ],
});

export default function initCalendar() {
  calendarPresenter.render();
}