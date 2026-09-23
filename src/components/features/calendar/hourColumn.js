import { createHourCell } from './hourCell.js';

export function createHourColumn({ type, date }) {
  const column = document.createDocumentFragment();

  let firstHourCell = null;

  for (let hour = 0; hour < 24; hour++) {
    const currentHour = date.hour(hour);
    const hourCell = createHourCell({
      type,
      time: currentHour.minute(0).format('HH:mm'),
      halfTime: currentHour.minute(30).format('HH:mm'),
      extraClasses: type === 'day' && hour === 0 ? ['first'] : [],
    });

    if (hour === 0) firstHourCell = hourCell.internalDomElements.hourCell;

    column.appendChild(hourCell.mainComponent);
  }

  return { mainComponent: column, firstHourCell };
}