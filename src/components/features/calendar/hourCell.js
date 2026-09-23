export function createHourCell({ type, time, halfTime, extraClasses = [] }) {
  const fragment = document.createDocumentFragment();

  const hourCell = document.createElement('li');
  hourCell.className = `${type}-box`;
  hourCell.setAttribute('data-time', time);

  extraClasses.forEach((extraClass) => {
    extraClass.split(' ').forEach((cls) => hourCell.classList.add(cls));
  });

  const halfHourCell = document.createElement('li');
  halfHourCell.className = `${type}-half-box`;
  halfHourCell.setAttribute('data-time', halfTime);

  if (type === 'week') {
    hourCell.addEventListener('click', handleWeekCellClick);
    halfHourCell.addEventListener('click', handleWeekCellClick);
  } else if (type === 'day') {
    hourCell.addEventListener('click', handleDayCellClick);
    halfHourCell.addEventListener('click', handleDayCellClick);
  }

  fragment.appendChild(hourCell);
  fragment.appendChild(halfHourCell);

  return {
    mainComponent: fragment,
    internalDomElements: { hourCell },
  };
}

async function handleWeekCellClick(e) {
  openCreateEvent(e);
}

function handleDayCellClick(e) {
  const cell = e.currentTarget;

  [...cell.parentElement.children].forEach((child) =>
    child.classList.remove('selected-time'),
  );

  if (cell.classList.contains('day-box')) {
    cell.nextElementSibling.classList.add('selected-time');
  } else {
    cell.previousElementSibling.classList.add('selected-time');
  }

  cell.classList.add('selected-time');

  openCreateEvent(e);
}

async function openCreateEvent(e) {
  const { handleOpenCreate } =
    await import('../../../eventCreation/eventLogic.js');

  handleOpenCreate(e);
}
