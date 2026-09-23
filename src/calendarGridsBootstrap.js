import createMonthGrid from './components/features/calendar/monthGrid.js';
import createWeekGrid from './components/features/calendar/weekGrid.js';
import createDailyGrid from './components/features/calendar/dayGrid.js';
import { calendarLogic } from './calendarLogic.js';

const calendarMain = document.getElementById('calendar-main');

calendarMain.appendChild(createMonthGrid(calendarLogic.date));
calendarMain.appendChild(createWeekGrid(calendarLogic.date));
calendarMain.appendChild(createDailyGrid(calendarLogic.date));