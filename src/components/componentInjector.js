import { replaceMarkers } from './markerReplacer.js';
import createMonthGrid from './features/calendar/monthGrid.js';
import createWeekGrid from './features/calendar/weekGrid.js';
import createDailyGrid from './features/calendar/dayGrid.js';
import { calendarLogic } from '../calendarLogic.js';
import createViewModeSwitcher from './navbar/timeframeSwitcher.js';
import createTodayButton from './navbar/todayButton.js';
import createTodoListButton from './navbar/todoListButton.js';
import createTutorialButton from './navbar/tutorialButton.js';
import createTodoPanel from './features/todo/todoPanel/TodoPanel.js';

const componentBuilders = {
  replace_viewModeSwitcher() {
    return createViewModeSwitcher();
  },
  replace_todayButton() {
    return createTodayButton();
  },
  replace_todoListButton() {
    return createTodoListButton();
  },
  replace_tutorialButton() {
    return createTutorialButton();
  },
  replace_monthGrid() {
    return createMonthGrid(calendarLogic.date);
  },
  replace_weekGrid() {
    return createWeekGrid(calendarLogic.date);
  },
  replace_dayGrid() {
    return createDailyGrid(calendarLogic.date);
  },
  replace_todoPanel() {
    return createTodoPanel();
  },
};

replaceMarkers(componentBuilders);