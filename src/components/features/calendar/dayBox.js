import dayjs from '../../../day.js';

export function createDayBox({ dataDayID, extraClasses = [], isMini = false }) {
  const dayBox = initDayBox({ dataDayID, extraClasses });
  const dayContainer = initDayContainer({ isMini, dataDayID });
  const todoContainer = createTodoContainer({ isMini });
  const { eventAllDayContainer, eventsContainer } = createEventsContainers({
    isMini,
  });

  dayBox.appendChild(dayContainer);
  dayContainer.appendChild(todoContainer);

  if (!isMini) {
    dayBox.appendChild(eventAllDayContainer);
    dayBox.appendChild(eventsContainer);
  }

  return dayBox;
}

function initDayBox({ dataDayID, extraClasses = [] }) {
  const dayBox = document.createElement('div');
  extraClasses.forEach((extraClass) => {
    extraClass.split(' ').forEach((cls) => dayBox.classList.add(cls));
  });

  dayBox.setAttribute('data-action', 'create-event');
  dayBox.setAttribute('data-day', dataDayID);
  dayBox.setAttribute('data-testid', `day-box-${dataDayID}`);

  return dayBox;
}

function initDayContainer({ isMini, dataDayID }) {
  const dayContainer = document.createElement('div');
  const insideBoxGrid = document.createElement('div');

  const dayNumberButton = createDayNumberButton({ isMini, dataDayID });

  dayContainer.classList.add(`${isMini ? 'mini-' : ''}fist-row-month`);

  dayContainer.appendChild(insideBoxGrid);

  insideBoxGrid.classList.add(`${isMini ? 'mini-' : ''}inside-box`);
  insideBoxGrid.appendChild(dayNumberButton);

  return dayContainer;
}

function createEventsContainers() {
  const eventAllDayContainer = document.createElement('div');
  eventAllDayContainer.classList.add('event-allDay-container');

  const eventsContainer = document.createElement('div');
  eventsContainer.classList.add('monthly-events-container');

  return { eventAllDayContainer, eventsContainer };
}

function createDayNumberButton({ isMini, dataDayID }) {
  const dayNumberButton = document.createElement('button');

  const dayNumber = dataDayID.split('-')[dataDayID.split('-').length - 1];

  const accessibleDate = dayjs(dataDayID).format('D MMMM YYYY');

  dayNumberButton.classList.add(`${isMini ? 'mini-' : ''}number-box`);
  dayNumberButton.setAttribute('type', 'button');
  dayNumberButton.setAttribute('data-day', dataDayID);
  dayNumberButton.setAttribute('data-action', 'select-date');
  dayNumberButton.setAttribute('aria-label', `Seleziona ${accessibleDate}`);
  dayNumberButton.setAttribute('data-testid', `day-number-button-${dataDayID}`);

  dayNumberButton.textContent = dayNumber;

  return dayNumberButton;
}

function createTodoContainer({ isMini }) {
  const todoContainer = document.createElement('div');
  todoContainer.classList.add(`${isMini ? 'mini-' : ''}todo-container-month`);

  return todoContainer;
}
