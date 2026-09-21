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
  }

  fragment.appendChild(hourCell);
  fragment.appendChild(halfHourCell);

  return fragment;
}

async function handleWeekCellClick(e) {
  const { handleOpenCreate } =
    await import('../../../eventCreation/eventLogic.js');

  handleOpenCreate(e);
}
