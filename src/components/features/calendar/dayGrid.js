import dayjs from '../../../day.js';
import { createDayLabel } from './dayLabel.js';
import { createTodoContainer } from './todoContainer.js';
import { createHourCell } from './hourCell.js';
import { createTimeLabel } from './timeLabel.js';

let existingMainDayGrid = null;
let existingMainDayStructure = null;

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

function buildDayGrid(currentView) {
  const { dayContainer, list } = initDayContainer();
  const dayStructure = initDayStructure();

  list.appendChild(dayStructure);
  buildGridContent(dayStructure, currentView);

  return { dayContainer, dayStructure };
}

function reRenderMainGrid(currentView) {
  existingMainDayStructure.innerHTML = '';

  buildGridContent(existingMainDayStructure, currentView);
}

function buildGridContent(dayStructure, currentView) {
  const dataDay = currentView.format('YYYY-MM-DD');

  const dailyHeader = document.createElement('div');
  dailyHeader.className = 'daily-header';
  dailyHeader.dataset.day = dataDay;

  dailyHeader.appendChild(createDayLabel({ type: 'day', date: currentView }));

  const allDayContainer = document.createElement('div');
  allDayContainer.className = 'daily-allDay-container';

  dailyHeader.appendChild(allDayContainer);
  dailyHeader.appendChild(createTodoContainer({ type: 'day' }));
  dayStructure.appendChild(dailyHeader);

  const dailyMain = document.createElement('div');
  dailyMain.className = 'daily-main';

  const timeColumn = document.createElement('div');
  timeColumn.className = 'ul-day-time';

  const list = document.createElement('ul');
  list.className = 'day-list';

  timeColumn.appendChild(list);
  dailyMain.appendChild(timeColumn);
  dayStructure.appendChild(dailyMain);

  for (let i = 0; i < 24; i++) {
    const time = dayjs().hour(i).minute(0).format('HH:mm');

    list.appendChild(createTimeLabel({ type: 'day', time }));
  }

  const dayGrid = document.createElement('div');
  dayGrid.className = 'day-structure';

  const dailyName = document.createElement('ul');
  dailyName.className = 'daily-name';
  dailyName.dataset.day = dataDay;

  dayGrid.appendChild(dailyName);
  dailyMain.appendChild(dayGrid);

  for (let j = 0; j < 24; j++) {
    const dataTime = currentView.hour(j);
    const hour = dataTime.minute(0).format('HH:mm');
    const halfHour = dataTime.minute(30).format('HH:mm');

    dailyName.appendChild(
      createHourCell({
        type: 'day',
        time: hour,
        halfTime: halfHour,
        extraClasses: j === 0 ? ['first'] : [],
      }),
    );
  }
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
