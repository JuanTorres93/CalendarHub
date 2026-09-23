import { createDayCell } from "./dayCell.js";
import { createDayLabel } from "./dayLabel.js";
import { config } from "../../../utils/config/config.js";
import { createMonthlyEvent } from "./monthlyEvent.js";
import { bindEventInfoClick } from "./eventInfoClick.js";
import { timeToMinutes } from "../../../utils/helpers/timeHelper.js";

const WEEKDAYS = 7;
const MONTH_GRID_CELLS = 42;

let existingMainMonthSection = null;
let existingMainMonthGrid = null;
let existingMainMonthStructure = null;
let mainMonthDayCells = [];

function createMonthGrid(currentView, isMini = false) {
  if (!isMini) {
    if (existingMainMonthStructure) {
      reRenderMainGrid(currentView);

      return existingMainMonthSection;
    }

    const grid = buildMonthGrid(currentView, isMini);

    existingMainMonthSection = grid.monthSection;
    existingMainMonthGrid = grid.monthContainer;
    existingMainMonthStructure = grid.monthStructureContainer;

    return existingMainMonthSection;
  }

  return buildMonthGrid(currentView, isMini).monthContainer;
}

export function getMonthView() {
  return existingMainMonthGrid;
}

export function getMonthStructure() {
  return existingMainMonthStructure;
}

export function renderMonthEvents(allEvents) {
  mainMonthDayCells.forEach(
    ({ dataDay, eventAllDayContainer, eventsContainer, eventElements }) => {
      eventElements.forEach((element) => element.remove());
      eventElements.length = 0;

      const eventOfDay = allEvents
        .filter((event) => event.date === dataDay)
        .sort((a, b) => timeToMinutes(a.from) - timeToMinutes(b.from));

      eventOfDay.forEach((event) => {
        const eventElement = createMonthlyEvent({ event });
        bindEventInfoClick(eventElement);

        if (event.allDay) eventAllDayContainer.appendChild(eventElement);
        else eventsContainer.appendChild(eventElement);

        eventElements.push(eventElement);
      });
    },
  );
}

function buildMonthGrid(currentView, isMini) {
  const monthSection = initMonthSection(isMini);
  const monthContainer = initMonthContainer(isMini);
  const monthStructureContainer = initMonthStructure();

  monthContainer.appendChild(monthStructureContainer);
  monthSection.appendChild(monthContainer);
  buildGridContent(monthStructureContainer, currentView, isMini);

  return { monthSection, monthContainer, monthStructureContainer };
}

function reRenderMainGrid(currentView) {
  existingMainMonthStructure.innerHTML = "";
  mainMonthDayCells = [];

  buildGridContent(existingMainMonthStructure, currentView, false);
}

function buildGridContent(monthStructureContainer, currentView, isMini) {
  const gridConfig = isMini ? config.mini : config.main;

  monthStructureContainer.appendChild(buildWeekdayHeader(currentView, gridConfig));
  monthStructureContainer.appendChild(buildDayCellsGrid(currentView, gridConfig, isMini));
}

function buildWeekdayHeader(currentView, gridConfig) {
  const weekdayHeader = document.createElement("div");
  weekdayHeader.classList.add("day-grid");

  for (let dayIndex = 0; dayIndex < WEEKDAYS; dayIndex++) {
    weekdayHeader.appendChild(
      createDayLabel({
        type: "month",
        date: currentView.weekday(dayIndex),
        className: gridConfig.dailybox,
      }),
    );
  }

  return weekdayHeader;
}

function buildDayCellsGrid(currentView, gridConfig, isMini) {
  const dayCellsGrid = document.createElement("article");
  dayCellsGrid.classList.add(gridConfig.boxesContainer);

  const monthDates = getMonthDates(currentView);

  for (let cellIndex = 0; cellIndex < MONTH_GRID_CELLS; cellIndex++) {
    const dayCellData = getDayCellData(currentView, monthDates, cellIndex, gridConfig);

    const extraClasses = [gridConfig.boxGrid, dayCellData.className];

    if (!isMini && dayCellData.isSelectedDay) {
      extraClasses.push("selected");
    }

    const dayCell = createDayCell({
      dataDayID: dayCellData.date,
      extraClasses,
      isMini,
    });

    if (!isMini) {
      mainMonthDayCells.push({
        dataDay: dayCellData.date,
        ...dayCell.internalDomElements,
        eventElements: [],
      });
    }

    dayCellsGrid.appendChild(dayCell.mainComponent);
  }

  return dayCellsGrid;
}

function getMonthDates(currentView) {
  return {
    firstDayIndex: currentView.startOf("month").weekday(),
    daysInMonth: currentView.daysInMonth(),
    lastDayPrevMonth: currentView.date(1).subtract(1, "day"),
    firstDayNextMonth: currentView.endOf("month").add(1, "day"),
  };
}

function getDayCellData(currentView, monthDates, cellIndex, gridConfig) {
  const { firstDayIndex, daysInMonth } = monthDates;

  if (cellIndex < firstDayIndex) {
    return getPreviousMonthDay(monthDates, cellIndex, gridConfig);
  }

  if (cellIndex >= daysInMonth + firstDayIndex) {
    return getNextMonthDay(monthDates, cellIndex, gridConfig);
  }

  return getCurrentMonthDay(currentView, monthDates, cellIndex, gridConfig);
}

function getPreviousMonthDay(monthDates, cellIndex, gridConfig) {
  const dayNumber =
    monthDates.lastDayPrevMonth.date() - (monthDates.firstDayIndex - 1 - cellIndex);
  const date = monthDates.lastDayPrevMonth.date(dayNumber);

  return {
    date: date.format("YYYY-MM-DD"),
    className: gridConfig.colorOffset,
  };
}

function getNextMonthDay(monthDates, cellIndex, gridConfig) {
  const dayNumber = cellIndex - (monthDates.firstDayIndex + monthDates.daysInMonth - 1);
  const date = monthDates.firstDayNextMonth.date(dayNumber);

  return {
    date: date.format("YYYY-MM-DD"),
    className: gridConfig.colorOffset,
  };
}

function getCurrentMonthDay(currentView, monthDates, cellIndex, gridConfig) {
  const dayNumber = cellIndex - monthDates.firstDayIndex + 1;
  const date = currentView.date(1).date(dayNumber);
  const isSelectedDay = date.format("YYYY-MM-DD") === currentView.format("YYYY-MM-DD");

  return {
    date: date.format("YYYY-MM-DD"),
    isSelectedDay,
    className: isSelectedDay
      ? `${gridConfig.today} ${gridConfig.colorBox}`
      : gridConfig.colorBox,
  };
}

function initMonthContainer(isMini) {
  const monthContainer = document.createElement("div");

  if (!isMini) {
    monthContainer.id = "month-body";
    monthContainer.classList.add("month-view");
    monthContainer.setAttribute("data-testid", "month-view");
  }

  return monthContainer;
}

function initMonthSection(isMini) {
  const monthSection = document.createElement("section");

  if (!isMini) {
    monthSection.id = "month-carousel";
    monthSection.setAttribute("aria-label", "Vista mensile del calendario");
  }

  return monthSection;
}

function initMonthStructure() {
  const monthStructureContainer = document.createElement("div");

  monthStructureContainer.classList.add("month-structure");

  return monthStructureContainer;
}

export default createMonthGrid;