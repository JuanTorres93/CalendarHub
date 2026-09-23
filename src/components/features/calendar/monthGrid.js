import { createDayCell } from "./dayCell.js";
import { createDayLabel } from "./dayLabel.js";
import { config } from "../../../utils/config/config.js";
import { createMonthlyEvent } from "./monthlyEvent.js";
import { bindEventInfoClick } from "./eventInfoClick.js";
import { timeToMinutes } from "../../../utils/helpers/timeHelper.js";

let existingMainMonthGrid = null;
let existingMainMonthStructure = null;
let mainMonthDayCells = [];

function createMonthGrid(currentView, isMini = false) {
  if (!isMini) {
    if (existingMainMonthStructure) {
      reRenderMainGrid(currentView);

      return existingMainMonthGrid;
    }

    const grid = buildMonthGrid(currentView, isMini);

    existingMainMonthGrid = grid.monthContainer;
    existingMainMonthStructure = grid.monthStructureContainer;

    return existingMainMonthGrid;
  }

  return buildMonthGrid(currentView, isMini).monthContainer;
}

export function getMonthView() {
  return existingMainMonthGrid;
}

export function renderMonthEvents(allEvents) {
  mainMonthDayCells.forEach(
    ({ dataDay, eventAllDayContainer, eventsContainer, eventElements }) => {
      eventElements.forEach((element) => element.remove());
      eventElements.length = 0;

      const eventOfDay = allEvents.filter((event) => event.date === dataDay);

      eventOfDay.sort((a, b) => {
        const aTotal = timeToMinutes(a.from);
        const bTotal = timeToMinutes(b.from);

        return aTotal - bTotal;
      });

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
  const monthContainer = initMonthContainer(isMini);
  const monthStructureContainer = initMonthStructure();

  monthContainer.appendChild(monthStructureContainer);
  buildGridContent(monthStructureContainer, currentView, isMini);

  return { monthContainer, monthStructureContainer };
}

function reRenderMainGrid(currentView) {
  existingMainMonthStructure.innerHTML = "";
  mainMonthDayCells = [];

  buildGridContent(existingMainMonthStructure, currentView, false);
}

function buildGridContent(monthStructureContainer, currentView, isMini) {
  const gridConfig = isMini ? config.mini : config.main;

  const giorniMese = currentView.daysInMonth();
  const primoGiorno = currentView.date(1);
  const firstDayIndex = currentView.startOf("month").weekday();
  const ultimoGiorno = currentView.endOf("month");
  const lastDayPrevMonth = primoGiorno.subtract(1, "day");
  const firstDayNextMonth = ultimoGiorno.add(1, "day");

  const firstRow = document.createElement("div");
  firstRow.classList.add("day-grid");

  monthStructureContainer.appendChild(firstRow);

  for (let j = 0; j < 7; j++) {
    firstRow.appendChild(
      createDayLabel({
        type: "month",
        date: currentView.weekday(j),
        className: gridConfig.dailybox,
      }),
    );
  }
  const secondRow = document.createElement("article");
  secondRow.classList.add(`${gridConfig.boxesContainer}`);

  monthStructureContainer.appendChild(secondRow);

  for (let i = 0; i < 42; i++) {
    let dataDayID, dayNumber, dayClass;
    if (i < firstDayIndex) {
      dayNumber = lastDayPrevMonth.date() - (firstDayIndex - 1 - i);
      dataDayID = lastDayPrevMonth.date(dayNumber).format("YYYY-MM-DD");
      dayClass = `${gridConfig.colorOffset}`;
    } else if (i >= giorniMese + firstDayIndex) {
      dayNumber = i - (firstDayIndex + giorniMese - 1);
      dataDayID = firstDayNextMonth.date(dayNumber).format("YYYY-MM-DD");
      dayClass = `${gridConfig.colorOffset}`;
    } else {
      dayNumber = i - firstDayIndex + 1;
      dataDayID = primoGiorno.date(dayNumber).format("YYYY-MM-DD");
      if (dataDayID === currentView.format("YYYY-MM-DD")) {
        dayClass = `${gridConfig.today} ${gridConfig.colorBox}`;
        if (!isMini) {
          dayClass += ` selected`;
        }
      } else {
        dayClass = `${gridConfig.colorBox}`;
      }
    }

    const dayCell = createDayCell({
      dataDayID,
      extraClasses: [gridConfig.boxGrid, dayClass],
      isMini,
    });

    if (!isMini) {
      mainMonthDayCells.push({
        dataDay: dataDayID,
        ...dayCell.internalDomElements,
        eventElements: [],
      });
    }

    secondRow.appendChild(dayCell.mainComponent);
  }
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

function initMonthStructure() {
  const monthStructureContainer = document.createElement("div");

  monthStructureContainer.classList.add("month-structure");

  return monthStructureContainer;
}

export default createMonthGrid;
