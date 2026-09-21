import "./modalOverlayInjector.js";
import { replaceMarkers } from "./markerReplacer.js";
import createMonthGrid from "./features/calendar/monthGrid.js";
import createWeekGrid from "./features/calendar/weekGrid.js";
import createDailyGrid from "./features/calendar/dayGrid.js";
import { calendarLogic } from "../calendarLogic.js";
import createCurrentTimeframeDisplay from "./navbar/currentTimeframeDisplay/currentTimeframeDisplay.js";
import createLeftArrowButton from "./navbar/currentTimeframeDisplay/leftArrowButton.js";
import createRightArrowButton from "./navbar/currentTimeframeDisplay/rightArrowButton.js";
import createViewModeSwitcher from "./navbar/timeframeSwitcher.js";
import createTodayButton from "./navbar/todayButton.js";
import createTodoListButton from "./navbar/todoListButton.js";
import createTutorialButton from "./navbar/tutorialButton.js";
import createCurrentYearDisplay from "./navbar/currentYearDisplay.js";

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
  replace_currentYearDisplay() {
    return createCurrentYearDisplay();
  },
  replace_leftArrowButton(parts) {
    const [, timeFrame, ariaLabel, ...extraClasses] = parts;
    return createLeftArrowButton({ timeFrame, ariaLabel, extraClasses });
  },
  replace_rightArrowButton(parts) {
    const [, timeFrame, ariaLabel, ...extraClasses] = parts;
    return createRightArrowButton({ timeFrame, ariaLabel, extraClasses });
  },
  replace_currentTimeframeDisplay(parts) {
    const [, timeframe] = parts;
    return createCurrentTimeframeDisplay(timeframe);
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
};

replaceMarkers(componentBuilders);
