import { AppGetAllEventsUsecase } from "../../interface-adapters/use-cases/AppGetAllEventsUsecase.js";
import { getRepeatedEvents } from "../../eventCreation/generateRepeatEvents.js";
import { timeToMinutes } from "../helpers/timeHelper.js";

export function getAllRenderableEvents() {
  const eventsUpdated = AppGetAllEventsUsecase.execute();
  const eventOccurrencies = getRepeatedEvents();

  return [...eventsUpdated, ...eventOccurrencies];
}

export function renderEvents() {
  const allEvents = getAllRenderableEvents();

  renderMonthEvents(allEvents);
  renderDailyEvents(allEvents);
  renderWeeklyEvents(allEvents);
}

function renderMonthEvents(allEvents) {
  const monthlyBoxes = document.querySelectorAll(".box-grid");

  monthlyBoxes.forEach((box) => {
    const container = box.querySelector(".monthly-events-container");
    const allDayContainer = box.querySelector(".event-allDay-container");
    if (!container || !allDayContainer) return;

    container.innerHTML = "";
    allDayContainer.innerHTML = "";

    const dataDay = box.dataset.day;
    const eventOfDay = allEvents.filter((event) => event.date === dataDay);

    eventOfDay.sort((a, b) => {
      const aTotal = timeToMinutes(a.from);
      const bTotal = timeToMinutes(b.from);

      return aTotal - bTotal;
    });

    eventOfDay.forEach((event) => {
      let eventElement;

      if (event.allDay) {
        eventElement = document.createElement("div");
        eventElement.className = "monthly-event";
        eventElement.dataset.id = event.id;
        eventElement.setAttribute("data-testid", `monthly-event-${event.id}`);

        const todayLabel = document.createElement("span");
        todayLabel.textContent = "Oggi:";

        const title = document.createElement("p");
        title.textContent = event.title;

        eventElement.appendChild(todayLabel);
        eventElement.appendChild(title);
        eventElement.classList.add("render-allDay");
      } else {
        eventElement = document.createElement("div");
        eventElement.className = "monthly-event";
        eventElement.dataset.id = event.id;
        eventElement.setAttribute("data-testid", `monthly-event-${event.id}`);

        const icon = document.createElement("span");
        icon.className = "icon-month";
        icon.textContent = event.icon;

        const title = document.createElement("span");
        title.className = "title-month";
        title.textContent = event.title;

        eventElement.appendChild(icon);
        eventElement.appendChild(title);

        if (event.isOccurrence) {
          const repeatIcon = document.createElement("small");
          repeatIcon.className = "repeat-icon";
          repeatIcon.textContent = "🔗";

          eventElement.appendChild(repeatIcon);
        }

        container.appendChild(eventElement);
      }

      if (event.allDay) allDayContainer.appendChild(eventElement);

      eventElement.addEventListener("click", (e) => {
        e.stopPropagation();
        openEventInfo(eventElement, e);
      });

      eventElement.classList.add(`event-${event.color}`);

      if (event.urgent) {
        eventElement.classList.add("event-urgent");
      }
    });
  });
}

function bindEventInfoClick(eventElement) {
  eventElement.addEventListener("click", (e) => {
    e.stopPropagation();
    openEventInfo(eventElement, e);
  });
}

async function openEventInfo(eventElement, e) {
  const { renderExtraInfo } = await import("../../eventCreation/infoBanner.js");

  renderExtraInfo(eventElement, e);
}

//ogni casella ha un'altezza coerente, ed equivale a 30 minuti, quindi ogni frazione di essa corrispondera ad un minuto
export function renderDailyEvents(allEvents) {
  const container = document.querySelector(".day-structure");
  const allDayContainer = document.querySelector(".daily-allDay-container");

  container.querySelectorAll(".daily-event").forEach((event) => event.remove());
  allDayContainer
    .querySelectorAll(".daily-allDay-event")
    .forEach((event) => event.remove());
  const dailybox = document.querySelector(".day-box");
  const dataDay = dailybox.parentElement.dataset.day;
  const height = dailybox.getBoundingClientRect().height;
  renderHelper(
    height,
    container,
    allEvents,
    dataDay,
    "daily-event",
    allDayContainer,
    "daily-allDay-event",
  );
}
export function renderWeeklyEvents(allEvents) {
  const containers = document.querySelectorAll(".day-name");
  const allDayContainers = document.querySelectorAll(".week-all-day-container");
  const allDayContainer = [...allDayContainers];
  allDayContainer.forEach((event) => (event.innerHTML = ""));
  containers.forEach((container, index) => {
    container
      .querySelectorAll(".weekly-event")
      .forEach((event) => event.remove());

    const weeklyBox = document.querySelector(".week-box");
    const height = weeklyBox.getBoundingClientRect().height;
    const dataDay = container.dataset.day;

    renderHelper(
      height,
      container,
      allEvents,
      dataDay,
      "weekly-event",
      allDayContainer[index],
      "week-allDay-event",
    );
  });
}

function renderHelper(
  height,
  container,
  eventsUpdated,
  dataDay,
  eventClass,
  allDayContainer,
  allDayClass,
) {
  const heightXMinute = height / 30;
  const eventOfDay = eventsUpdated.filter((event) => event.date === dataDay);
  const allDayEvents = eventOfDay.filter((event) => event.allDay);
  const timedEvents = eventOfDay.filter((event) => !event.allDay);

  allDayEvents.forEach((event) => {
    const eventElement = document.createElement("div");
    eventElement.className = allDayClass;
    eventElement.dataset.id = event.id;

    bindEventInfoClick(eventElement);

    const startText = document.createElement("span");
    startText.className = "all-event-start-text";
    startText.textContent = "Oggi:";

    const titleContainer = document.createElement("p");
    const titleIcon = document.createElement("span");
    titleIcon.textContent = event.icon;

    titleContainer.appendChild(titleIcon);
    titleContainer.appendChild(document.createTextNode(event.title));

    eventElement.appendChild(startText);
    eventElement.appendChild(titleContainer);
    eventElement.classList.add(`event-${event.color}`);

    if (event.urgent) {
      eventElement.classList.add("event-urgent");
    }

    allDayContainer.appendChild(eventElement);
  });
  timedEvents.forEach((event) => {
    const eventElement = document.createElement("div");
    eventElement.className = eventClass;
    eventElement.dataset.id = event.id;

    bindEventInfoClick(eventElement);

    if (event.isOccurrence) {
      const icon = document.createElement("span");
      icon.textContent = event.icon;

      const title = document.createElement("span");
      title.textContent = event.title;

      const repeatIcon = document.createElement("small");
      repeatIcon.className = "repeat-icon-alt";
      repeatIcon.textContent = "🔗";

      eventElement.appendChild(icon);
      eventElement.appendChild(title);
      eventElement.appendChild(repeatIcon);
    } else {
      const renderTime = document.createElement("span");
      renderTime.className = "render-time";
      renderTime.textContent = event.from;

      const titleContainer = document.createElement("p");
      titleContainer.className = "render-title";

      const titleIcon = document.createElement("span");
      titleIcon.textContent = event.icon;

      titleContainer.appendChild(titleIcon);
      titleContainer.appendChild(document.createTextNode(` ${event.title}`));

      eventElement.appendChild(renderTime);
      eventElement.appendChild(titleContainer);
    }

    const start = timeToMinutes(event.from);
    const end = timeToMinutes(event.to);
    const top = start * heightXMinute;
    const eventHeight = (end - start) * heightXMinute;

    const overlaps = timedEvents.filter((other) => {
      const aStart = timeToMinutes(event.from);
      const aEnd = timeToMinutes(event.to);
      const bStart = timeToMinutes(other.from);
      const bEnd = timeToMinutes(other.to);

      return aStart < bEnd && bStart < aEnd;
    });

    const overlapIndex = overlaps.findIndex((other) => {
      return other.id === event.id;
    });

    const width = 95 / overlaps.length;
    const left = overlapIndex * width;

    eventElement.classList.add(`event-${event.color}`);
    eventElement.style.top = `${top}px`;
    eventElement.style.height = `${eventHeight}px`;
    eventElement.style.width = `${width}%`;
    eventElement.style.left = `${left}%`;

    if (event.urgent) {
      eventElement.classList.add("event-urgent");
    }

    container.appendChild(eventElement);
  });
}
