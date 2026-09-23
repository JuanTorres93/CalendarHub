import dayjs from '../../../day.js';
import { createTimeLabel } from './timeLabel.js';

export function createTimeColumn({ type }) {
  const timeColumn = document.createElement('div');
  timeColumn.className = `ul-${type}-time`;

  const list = document.createElement('ul');
  list.className = type === 'day' ? 'day-list' : 'time-week';

  timeColumn.appendChild(list);

  for (let hour = 0; hour < 24; hour++) {
    const time = dayjs().hour(hour).minute(0).format('HH:mm');

    list.appendChild(
      createTimeLabel({
        type,
        time,
        extraClasses: type === 'week' && hour === 0 ? ['midnight'] : [],
      }),
    );
  }

  return timeColumn;
}