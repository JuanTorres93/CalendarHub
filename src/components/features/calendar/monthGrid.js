import { createDayCell } from "./dayCell.js";
import { createDayLabel } from "./dayLabel.js";
import { config } from "../../../utils/config/config.js";

let existingMainMonthGrid = null;
let existingMainMonthStructure = null;

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

function buildMonthGrid(currentView, isMini) {
  const monthContainer = initMonthContainer(isMini);
  const monthStructureContainer = initMonthStructure();

  monthContainer.appendChild(monthStructureContainer);
  buildGridContent(monthStructureContainer, currentView, isMini);

  return { monthContainer, monthStructureContainer };
}

function reRenderMainGrid(currentView) {
  existingMainMonthStructure.innerHTML = "";

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
      } else {
        dayClass = `${gridConfig.colorBox}`;
      }
    }

    secondRow.appendChild(
      createDayCell({
        dataDayID,
        extraClasses: [gridConfig.boxGrid, dayClass],
        isMini,
      }),
    );
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
