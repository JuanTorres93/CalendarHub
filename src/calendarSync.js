import createMonthGrid from "./components/features/calendar/monthGrid.js";
import createWeekGrid from "./components/features/calendar/weekGrid.js";
import createDailyGrid from "./components/features/calendar/dayGrid.js";

import { calendarLogic } from "./calendarLogic.js";
import { initRenderBadge } from "./to-do-list/toDoBadgeRendering.js";
import { renderEvents } from "./utils/events/eventRendering.js";
import { theme } from "./utils/theme.js";
import {
  currentDailyDisplay,
  currentMonthDisplay,
  currentWeekDisplay,
  currentYearDisplay,
  monthGrid,
} from "./utils/helpers/dom/mainCalendarDom.js";

calendarLogic.init({
  createMonthGrid,
  monthGrid,
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
  calendarLogic.syncAll();
}
