import dayjs from "../../../day.js";
import { createTodoContainer } from "./todoContainer.js";
import { calendarLogic } from "../../../calendarLogic.js";

export function createDayCell({
  dataDayID,
  extraClasses = [],
  isMini = false,
}) {
  const dayCell = initDayCell({ dataDayID, extraClasses });
  const dayContainer = initDayContainer({ isMini, dataDayID });
  const todoContainer = createTodoContainer({ type: "month", isMini });
  const { eventAllDayContainer, eventsContainer } = createEventsContainers({
    isMini,
  });

  todoContainer.dayCell = dayCell;

  dayCell.appendChild(dayContainer);
  dayContainer.appendChild(todoContainer);

  if (!isMini) {
    dayCell.appendChild(eventAllDayContainer);
    dayCell.appendChild(eventsContainer);

    dayCell.addEventListener("click", (e) => {
      e.stopPropagation();
      openCreateEvent(e);
    });

    dayContainer.addEventListener("click", (e) => e.stopPropagation());
  }

  return dayCell;
}

async function openCreateEvent(e) {
  const { handleOpenCreate } =
    await import("../../../eventCreation/eventLogic.js");

  handleOpenCreate(e);
}

function initDayCell({ dataDayID, extraClasses = [] }) {
  const dayCell = document.createElement("div");
  extraClasses.forEach((extraClass) => {
    extraClass.split(" ").forEach((cls) => dayCell.classList.add(cls));
  });

  dayCell.setAttribute("data-action", "create-event");
  dayCell.setAttribute("data-day", dataDayID);
  dayCell.setAttribute("data-testid", `day-box-${dataDayID}`);

  return dayCell;
}

function initDayContainer({ isMini, dataDayID }) {
  const dayContainer = document.createElement("div");
  const insideBoxGrid = document.createElement("div");

  const dayNumberButton = createDayNumberButton({ isMini, dataDayID });

  dayContainer.classList.add(`${isMini ? "mini-" : ""}fist-row-month`);

  dayContainer.appendChild(insideBoxGrid);

  insideBoxGrid.classList.add(`${isMini ? "mini-" : ""}inside-box`);
  insideBoxGrid.appendChild(dayNumberButton);

  return dayContainer;
}

function createEventsContainers() {
  const eventAllDayContainer = document.createElement("div");
  eventAllDayContainer.classList.add("event-allDay-container");

  const eventsContainer = document.createElement("div");
  eventsContainer.classList.add("monthly-events-container");

  return { eventAllDayContainer, eventsContainer };
}

function createDayNumberButton({ isMini, dataDayID }) {
  const dayNumberButton = document.createElement("button");

  const dayNumber = dataDayID.split("-")[dataDayID.split("-").length - 1];

  const accessibleDate = dayjs(dataDayID).format("D MMMM YYYY");

  dayNumberButton.classList.add(`${isMini ? "mini-" : ""}number-box`);
  dayNumberButton.setAttribute("type", "button");
  dayNumberButton.setAttribute("data-day", dataDayID);
  dayNumberButton.setAttribute("data-action", "select-date");
  dayNumberButton.setAttribute("aria-label", `Seleziona ${accessibleDate}`);
  dayNumberButton.setAttribute("data-testid", `day-number-button-${dataDayID}`);

  dayNumberButton.textContent = dayNumber;

  if (!isMini) {
    dayNumberButton.addEventListener("click", (e) => {
      e.stopPropagation();
      calendarLogic.setDate(dayjs(dataDayID));
    });
  }

  return dayNumberButton;
}
