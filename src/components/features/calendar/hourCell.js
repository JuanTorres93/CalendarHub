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

  fragment.appendChild(hourCell);
  fragment.appendChild(halfHourCell);

  return fragment;
}