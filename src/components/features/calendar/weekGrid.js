import dayjs from '../../../day.js';
import { createHourCell } from './hourCell.js';
import { createTimeLabel } from './timeLabel.js';
import { createWeekDayLabel } from './weekDayLabel.js';
import { createTimedEvent } from './timedEvent.js';
import { createAllDayEvent } from './allDayEvent.js';
import { bindEventInfoClick } from './eventInfoClick.js';
import { computeEventLayout } from '../../../utils/events/eventLayout.js';

let existingMainWeekGrid = null;
let existingMainWeekStructure = null;
let mainWeekDays = [];

function createWeekGrid(currentView) {
  if (existingMainWeekStructure) {
    reRenderMainGrid(currentView);
    return existingMainWeekGrid;
  }

  const grid = buildWeekGrid(currentView);

  existingMainWeekGrid = grid.weekContainer;
  existingMainWeekStructure = grid.weekStructure;

  return existingMainWeekGrid;
}

export function getWeekView() {
  return existingMainWeekGrid;
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
  const { weekContainer, list } = initWeekContainer();
  const weekStructure = initWeekStructure();

  list.appendChild(weekStructure);
  buildGridContent(weekStructure, currentView);

  return { weekContainer, weekStructure };
}

function reRenderMainGrid(currentView) {
  existingMainWeekStructure.innerHTML = '';
  mainWeekDays = [];

  buildGridContent(existingMainWeekStructure, currentView);
}

function buildGridContent(weekStructure, currentView) {
  const timeColumn = document.createElement('div');
  timeColumn.className = 'ul-week-time';

  const list = document.createElement('ul');
  list.className = 'time-week';

  timeColumn.appendChild(list);
  weekStructure.appendChild(timeColumn);

  for (let i = 0; i < 24; i++) {
    const time = dayjs().hour(i).minute(0).format('HH:mm');

    list.appendChild(
      createTimeLabel({
        type: 'week',
        time,
        extraClasses: i === 0 ? ['midnight'] : [],
      }),
    );
  }

  const weekWrapper = document.createElement('div');
  weekWrapper.className = 'week-wrapper';

  const weekHeaderRow = document.createElement('div');
  weekHeaderRow.className = 'week-header-row';

  const weekDaysRow = document.createElement('div');
  weekDaysRow.className = 'week-days-row';

  weekWrapper.appendChild(weekHeaderRow);
  weekWrapper.appendChild(weekDaysRow);
  weekStructure.appendChild(weekWrapper);

  for (let j = 0; j < 7; j++) {
    const weekDay = currentView.weekday(j);
    const dataDay = weekDay.format('YYYY-MM-DD');
    const dayClass =
      dataDay === currentView.format('YYYY-MM-DD') ? 'is-today' : 'normal-week';

    const weekDayLabel = createWeekDayLabel({ date: weekDay });
    weekHeaderRow.appendChild(weekDayLabel.mainComponent);

    const dayColumn = document.createElement('div');
    dayColumn.className = 'week-structure';

    const dayName = document.createElement('ul');

    dayName.className = `day-name ${dayClass}`;
    dayName.dataset.day = dataDay;

    dayColumn.appendChild(dayName);
    weekDaysRow.appendChild(dayColumn);

    let weeklyBox = null;

    for (let k = 0; k < 24; k++) {
      const hour = weekDay.hour(k).minute(0).format('HH:mm');
      const halfHour = weekDay.hour(k).minute(30).format('HH:mm');

      const hourCell = createHourCell({
        type: 'week',
        time: hour,
        halfTime: halfHour,
      });

      if (k === 0) weeklyBox = hourCell.internalDomElements.hourCell;

      dayName.appendChild(hourCell.mainComponent);
    }

    mainWeekDays.push({
      dataDay,
      dayName,
      allDayContainer: weekDayLabel.internalDomElements.allDayContainer,
      weeklyBox,
      eventElements: [],
    });
  }
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

function initWeekStructure() {
  const weekStructure = document.createElement('div');
  weekStructure.id = 'full-week-view';

  return weekStructure;
}

export default createWeekGrid;
