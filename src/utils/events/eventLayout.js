import { timeToMinutes } from '../helpers/timeHelper.js';

export function computeEventLayout(timedEvents, heightXMinute) {
  return timedEvents.map((event) => {
    const start = timeToMinutes(event.from);
    const end = timeToMinutes(event.to);

    const overlaps = timedEvents.filter((other) => {
      const aStart = timeToMinutes(event.from);
      const aEnd = timeToMinutes(event.to);
      const bStart = timeToMinutes(other.from);
      const bEnd = timeToMinutes(other.to);

      return aStart < bEnd && bStart < aEnd;
    });

    const overlapIndex = overlaps.findIndex((other) => other.id === event.id);

    return {
      event,
      top: start * heightXMinute,
      height: (end - start) * heightXMinute,
      width: 95 / overlaps.length,
      left: overlapIndex * (95 / overlaps.length),
    };
  });
}