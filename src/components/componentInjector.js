import { replaceMarkers } from './markerReplacer.js';
import createMonthGrid from './features/calendar/monthGrid.js';
import createWeekGrid from './features/calendar/weekGrid.js';
import createDailyGrid from './features/calendar/dayGrid.js';
import { calendarLogic } from '../calendarLogic.js';
import createTodoPanel from './features/todo/todoPanel/TodoPanel.js';

const componentBuilders = {
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