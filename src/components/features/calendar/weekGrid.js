import { createTimeColumn } from './timeColumn.js';
import { createHourColumn } from './hourColumn.js';
import { createWeekDayLabel } from './weekDayLabel.js';
import { createTimedEvent } from './timedEvent.js';
import { createAllDayEvent } from './allDayEvent.js';
import { bindEventInfoClick } from './eventInfoClick.js';
import { computeEventLayout } from '../../../utils/events/eventLayout.js';

let existingMainWeekSection = null;
let existingMainWeekGrid = null;
let existingMainWeekStructure = null;
let mainWeekDays = [];

function createWeekGrid(currentView) {
  if (existingMainWeekStructure) {
    reRenderMainGrid(currentView);
    return existingMainWeekSection;
  }

  const grid = buildWeekGrid(currentView);

  existingMainWeekSection = grid.weekSection;
  existingMainWeekGrid = grid.weekContainer;
  existingMainWeekStructure = grid.weekStructure;

  return existingMainWeekSection;
}

export function getWeekView() {
  return existingMainWeekGrid;
}

export function getWeekStructure() {
  return existingMainWeekStructure;
}

export function getWeekHourCells() {
  return mainWeekDays.flatMap((day) => day.weekHourCells);
}

export function getTodayWeekDay() {
  return mainWeekDays.find((day) => day.dayName.classList.contains('is-today'));
}

export function renderWeekEvents(allEvents) {
  mainWeekDays.forEach(
    ({ dataDay, dayName, allDayContainer, weeklyBox, eventElements }) => {
      eventElements.forEach((element) => element.remove());
      eventElements.length = 0;

      const height = weeklyBox.getBoundingClientRect().height;
      const heightXMinute = height / 30;

      const eventOfDay = allEvents.filter((event) => event.date === dataDay);
      const allDayEvents = eventOfDay.filter((event) => event.allDay);
      const timedEvents = eventOfDay.filter((event) => !event.allDay);

      allDayEvents.forEach((event) => {
        const eventElement = createAllDayEvent({
          event,
          allDayClass: 'week-allDay-event',
        });

        bindEventInfoClick(eventElement);

        allDayContainer.appendChild(eventElement);

        eventElements.push(eventElement);
      });

      computeEventLayout(timedEvents, heightXMinute).forEach(
        ({ event, top, height, width, left }) => {
          const eventElement = createTimedEvent({
            event,
            eventClass: 'weekly-event',
            layout: { top, height, width, left },
          });

          bindEventInfoClick(eventElement);

          dayName.appendChild(eventElement);

          eventElements.push(eventElement);
        },
      );
    },
  );
}

function buildWeekGrid(currentView) {
  const weekSection = initWeekSection();
  const { weekContainer, list } = initWeekContainer();
  const weekStructure = initWeekStructure();

  list.appendChild(weekStructure);
  weekSection.appendChild(weekContainer);
  buildGridContent(weekStructure, currentView);

  return { weekSection, weekContainer, weekStructure };
}

function reRenderMainGrid(currentView) {
  existingMainWeekStructure.innerHTML = '';
  mainWeekDays = [];

  buildGridContent(existingMainWeekStructure, currentView);
}

function buildGridContent(weekStructure, currentView) {
  weekStructure.appendChild(createTimeColumn({ type: 'week' }));

  const weekWrapper = document.createElement('div');
  weekWrapper.className = 'week-wrapper';

  const headerRow = document.createElement('div');
  headerRow.className = 'week-header-row';

  const daysRow = document.createElement('div');
  daysRow.className = 'week-days-row';

  weekWrapper.appendChild(headerRow);
  weekWrapper.appendChild(daysRow);
  weekStructure.appendChild(weekWrapper);

  for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
    const day = currentView.weekday(dayIndex);
    const dataDay = day.format('YYYY-MM-DD');

    const dayLabel = createWeekDayLabel({ date: day });
    headerRow.appendChild(dayLabel.mainComponent);

    const dayColumn = buildDayColumn(day, dataDay, currentView);
    daysRow.appendChild(dayColumn.mainComponent);

    mainWeekDays.push({
      dataDay,
      dayName: dayColumn.dayName,
      allDayContainer: dayLabel.internalDomElements.allDayContainer,
      weeklyBox: dayColumn.hourCells[0],
      weekHourCells: dayColumn.hourCells,
      eventElements: [],
    });
  }
}

function buildDayColumn(day, dataDay, currentView) {
  const dayColumn = document.createElement('div');
  dayColumn.className = 'week-structure';

  const dayName = document.createElement('ul');
  dayName.className = `day-name ${getDayClass(dataDay, currentView)}`;
  dayName.dataset.day = dataDay;

  const hourColumn = createHourColumn({ type: 'week', date: day });
  dayName.appendChild(hourColumn.mainComponent);

  dayColumn.appendChild(dayName);

  return { mainComponent: dayColumn, dayName, hourCells: hourColumn.hourCells };
}

function getDayClass(dataDay, currentView) {
  return dataDay === currentView.format('YYYY-MM-DD') ? 'is-today' : 'normal-week';
}

function initWeekContainer() {
  const weekContainer = document.createElement('div');
  weekContainer.id = 'week-body';
  weekContainer.classList.add('week-view');
  weekContainer.setAttribute('data-testid', 'week-view');

  const list = document.createElement('div');
  list.id = 'list-week';

  weekContainer.appendChild(list);

  return { weekContainer, list };
}

function initWeekSection() {
  const weekSection = document.createElement('section');
  weekSection.className = 'week-carousel';
  weekSection.setAttribute('aria-label', 'Vista settimanale del calendario');

  return weekSection;
}

function initWeekStructure() {
  const weekStructure = document.createElement('div');
  weekStructure.id = 'full-week-view';

  return weekStructure;
}

export default createWeekGrid;