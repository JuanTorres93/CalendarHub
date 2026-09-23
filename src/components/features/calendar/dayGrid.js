import { createDayLabel } from './dayLabel.js';
import { createTodoContainer } from './todoContainer.js';
import { createTimeColumn } from './timeColumn.js';
import { createHourColumn } from './hourColumn.js';
import { createTimedEvent } from './timedEvent.js';
import { createAllDayEvent } from './allDayEvent.js';
import { bindEventInfoClick } from './eventInfoClick.js';
import { computeEventLayout } from '../../../utils/events/eventLayout.js';

let existingMainDayGrid = null;
let existingMainDayStructure = null;
let mainDayInfo = null;

function createDayGrid(currentView) {
  if (existingMainDayStructure) {
    reRenderMainGrid(currentView);
    return existingMainDayGrid;
  }

  const grid = buildDayGrid(currentView);

  existingMainDayGrid = grid.dayContainer;
  existingMainDayStructure = grid.dayStructure;

  return existingMainDayGrid;
}

export function getDayView() {
  return existingMainDayGrid;
}

export function getDayStructure() {
  return existingMainDayStructure;
}

export function renderDayEvents(allEvents) {
  if (!mainDayInfo) return;

  const { dataDay, dailyName, allDayContainer, dayBox, eventElements } =
    mainDayInfo;

  eventElements.forEach((element) => element.remove());
  eventElements.length = 0;

  const height = dayBox.getBoundingClientRect().height;
  const heightXMinute = height / 30;

  const eventOfDay = allEvents.filter((event) => event.date === dataDay);
  const allDayEvents = eventOfDay.filter((event) => event.allDay);
  const timedEvents = eventOfDay.filter((event) => !event.allDay);

  allDayEvents.forEach((event) => {
    const eventElement = createAllDayEvent({
      event,
      allDayClass: 'daily-allDay-event',
    });

    bindEventInfoClick(eventElement);

    allDayContainer.appendChild(eventElement);

    eventElements.push(eventElement);
  });

  computeEventLayout(timedEvents, heightXMinute).forEach(
    ({ event, top, height, width, left }) => {
      const eventElement = createTimedEvent({
        event,
        eventClass: 'daily-event',
        layout: { top, height, width, left },
      });

      bindEventInfoClick(eventElement);

      dailyName.appendChild(eventElement);

      eventElements.push(eventElement);
    },
  );
}

function buildDayGrid(currentView) {
  const { dayContainer, list } = initDayContainer();
  const dayStructure = initDayStructure();

  list.appendChild(dayStructure);
  buildGridContent(dayStructure, currentView);

  return { dayContainer, dayStructure };
}

function reRenderMainGrid(currentView) {
  existingMainDayStructure.innerHTML = '';
  mainDayInfo = null;

  buildGridContent(existingMainDayStructure, currentView);
}

function buildGridContent(dayStructure, currentView) {
  const dataDay = currentView.format('YYYY-MM-DD');

  const { mainComponent: header, allDayContainer } = buildGridHeader(
    currentView,
    dataDay,
  );
  dayStructure.appendChild(header);

  const {
    mainComponent: body,
    dailyName,
    dayBox,
  } = buildGridBody(currentView, dataDay);
  dayStructure.appendChild(body);

  mainDayInfo = {
    dataDay,
    dailyName,
    allDayContainer,
    dayBox,
    eventElements: [],
  };
}

function buildGridHeader(currentView, dataDay) {
  const header = document.createElement('div');
  header.className = 'daily-header';
  header.dataset.day = dataDay;

  const allDayContainer = document.createElement('div');
  allDayContainer.className = 'daily-allDay-container';

  header.appendChild(createDayLabel({ type: 'day', date: currentView }));
  header.appendChild(allDayContainer);
  header.appendChild(createTodoContainer({ type: 'day' }));

  return { mainComponent: header, allDayContainer };
}

function buildGridBody(currentView, dataDay) {
  const body = document.createElement('div');
  body.className = 'daily-main';

  const timeColumn = createTimeColumn({ type: 'day' });
  body.appendChild(timeColumn);

  const dayStructure = document.createElement('div');
  dayStructure.className = 'day-structure';

  const dailyName = document.createElement('ul');
  dailyName.className = 'daily-name';
  dailyName.dataset.day = dataDay;

  const hourColumn = createHourColumn({ type: 'day', date: currentView });
  dailyName.appendChild(hourColumn.mainComponent);

  dayStructure.appendChild(dailyName);
  body.appendChild(dayStructure);

  return { mainComponent: body, dailyName, dayBox: hourColumn.firstHourCell };
}

function initDayContainer() {
  const dayContainer = document.createElement('div');
  dayContainer.id = 'day-body';
  dayContainer.classList.add('day-view');
  dayContainer.setAttribute('data-testid', 'day-view');

  const list = document.createElement('div');
  list.id = 'list-day';

  dayContainer.appendChild(list);

  return { dayContainer, list };
}

function initDayStructure() {
  const dayStructure = document.createElement('div');
  dayStructure.id = 'full-day-view';

  return dayStructure;
}

export default createDayGrid;
