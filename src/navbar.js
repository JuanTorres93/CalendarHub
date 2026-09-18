import dayjs from './day.js';
import { isNow } from './utils/isNow.js';
import { openMiniCalendar } from './miniCalendar/miniCalendar.js';
import { calendarLogic } from './calendarLogic.js';
import { openTodo } from './to-do-list/toDo.js';
import { resetTutorial } from './tutorial.js';
import { viewSwitcher } from './utils/helpers/viewSwitcher.js';
import {
  renderDailyEvents,
  renderWeeklyEvents,
  getAllRenderableEvents,
} from './utils/events/eventRendering.js';
import {
  monthBtn,
  weekBtn,
  dayBtn,
  monthView,
  weekView,
  dayView,
  allOverlays,
  displayOverlays,
  displayOverlayMonth,
  resetBtn as reset,
  newTodoBtn,
  tutorialBtn,
  currentYearDisplay,
} from './utils/helpers/dom/mainCalendarDom.js';

viewSwitcher.init({
  monthView,
  weekView,
  dayView,
  displayOverlays,
  displayOverlayMonth,
});

function initDefaultView() {
  viewSwitcher.initDefaultView();
}

function bindNavEvents() {
  allOverlays.forEach((overlayElement) => {
    overlayElement.addEventListener('click', () => openMiniCalendar('normal'));
  });

  currentYearDisplay.addEventListener('click', (e) =>
    openMiniCalendar('normal', null, 'normal', e.currentTarget),
  );

  weekBtn.addEventListener('click', () => {
    const allEvents = getAllRenderableEvents();

    renderWeeklyEvents(allEvents);
    isNow();
  });

  dayBtn.addEventListener('click', () => {
    const allEvents = getAllRenderableEvents();

    renderDailyEvents(allEvents);
    isNow();
  });
  reset.addEventListener('click', function () {
    calendarLogic.setDate(dayjs());
  });
  newTodoBtn.addEventListener('click', () => {
    openTodo(calendarLogic.date.format('YYYY-MM-DD'));
  });
  tutorialBtn.addEventListener('click', resetTutorial);
}

export function initNavbar() {
  initDefaultView();
  bindNavEvents();
}
