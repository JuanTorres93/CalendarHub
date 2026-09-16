import { getRepeatedEvents } from '../../eventCreation/generateRepeatEvents.js';
import createElement from '../helpers/createElement.js';
import { timeToMinutes } from '../helpers/timeHelper.js';
import { getEvents } from './eventStorage.js';

export function getAllRenderableEvents() {
  const eventsUpdated = getEvents();
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
  const monthlyBoxes = document.querySelectorAll('.box-grid');

  monthlyBoxes.forEach((box) => {
    const container = box.querySelector('.monthly-events-container');
    const allDayContainer = box.querySelector('.event-allDay-container');
    if (!container || !allDayContainer) return;

    container.innerHTML = '';
    allDayContainer.innerHTML = '';

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
        eventElement = createElement(
          allDayContainer,
          'monthly-event',
          '',
          'div',
          {
            dataset: { id: event.id },
            attributes: { 'data-testid': `monthly-event-${event.id}` },
          },
        );

        createElement(eventElement, null, 'Oggi:', 'span');

        createElement(eventElement, null, event.title, 'p');

        eventElement.classList.add('render-allDay');
      } else {
        eventElement = createElement(container, 'monthly-event', '', 'div', {
          dataset: { id: event.id },
          attributes: { 'data-testid': `monthly-event-${event.id}` },
        });

        createElement(eventElement, 'icon-month', event.icon, 'span');

        createElement(eventElement, 'title-month', event.title, 'span');

        if (event.isOccurrence) {
          createElement(eventElement, 'repeat-icon', '🔗', 'small');
        }
      }

      eventElement.classList.add(`event-${event.color}`);

      if (event.urgent) {
        eventElement.classList.add('event-urgent');
      }
    });
  });
}

//ogni casella ha un'altezza coerente, ed equivale a 30 minuti, quindi ogni frazione di essa corrispondera ad un minuto
export function renderDailyEvents(allEvents) {
  const container = document.querySelector('.day-structure');
  const allDayContainer = document.querySelector('.daily-allDay-container');

  container.querySelectorAll('.daily-event').forEach((event) => event.remove());
  allDayContainer
    .querySelectorAll('.daily-allDay-event')
    .forEach((event) => event.remove());
  const dailybox = document.querySelector('.day-box');
  const dataDay = dailybox.parentElement.dataset.day;
  const height = dailybox.getBoundingClientRect().height;
  renderHelper(
    height,
    container,
    allEvents,
    dataDay,
    'daily-event',
    allDayContainer,
    'daily-allDay-event',
  );
}
export function renderWeeklyEvents(allEvents) {
  const containers = document.querySelectorAll('.day-name');
  const allDayContainers = document.querySelectorAll('.week-all-day-container');
  const allDayContainer = [...allDayContainers];
  allDayContainer.forEach((event) => (event.innerHTML = ''));
  containers.forEach((container, index) => {
    container
      .querySelectorAll('.weekly-event')
      .forEach((event) => event.remove());

    const weeklyBox = document.querySelector('.week-box');
    const height = weeklyBox.getBoundingClientRect().height;
    const dataDay = container.dataset.day;

    renderHelper(
      height,
      container,
      allEvents,
      dataDay,
      'weekly-event',
      allDayContainer[index],
      'week-allDay-event',
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
    const eventElement = createElement(
      allDayContainer,
      allDayClass,
      '',
      'div',
      {
        dataset: { id: event.id },
      },
    );

    createElement(eventElement, 'all-event-start-text', 'Oggi:', 'span');

    const titleContainer = createElement(eventElement, null, '', 'p');

    createElement(titleContainer, null, event.icon, 'span');

    titleContainer.appendChild(document.createTextNode(event.title));

    eventElement.classList.add(`event-${event.color}`);

    if (event.urgent) {
      eventElement.classList.add('event-urgent');
    }
  });
  timedEvents.forEach((event) => {
    const eventElement = createElement(container, eventClass, '', 'div', {
      dataset: { id: event.id },
    });

    if (event.isOccurrence) {
      createElement(eventElement, null, event.icon, 'span');

      createElement(eventElement, null, event.title, 'span');

      createElement(eventElement, 'repeat-icon-alt', '🔗', 'small');
    } else {
      createElement(eventElement, 'render-time', event.from, 'span');

      const titleContainer = createElement(
        eventElement,
        'render-title',
        '',
        'p',
      );

      createElement(titleContainer, null, event.icon, 'span');

      titleContainer.appendChild(document.createTextNode(` ${event.title}`));
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
      eventElement.classList.add('event-urgent');
    }
  });
}
