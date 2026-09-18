import { calendarLogic } from './calendarLogic.js';
import dayjs from './day.js';
import { openTodo } from './to-do-list/toDo.js';
import { resetTutorial } from './tutorial.js';
import {
  dayView,
  displayOverlayMonth,
  displayOverlays,
  monthView,
  newTodoBtn,
  resetBtn as reset,
  tutorialBtn,
  weekView,
} from './utils/helpers/dom/mainCalendarDom.js';
import { viewSwitcher } from './utils/helpers/viewSwitcher.js';
import { initMiniCalendarDeps } from './miniCalendar/miniCalendar.js';

viewSwitcher.init({
  monthView,
  weekView,
  dayView,
  displayOverlays,
  displayOverlayMonth,
});

initMiniCalendarDeps({ displayOverlays });

function initDefaultView() {
  viewSwitcher.initDefaultView();
}

function bindNavEvents() {
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
