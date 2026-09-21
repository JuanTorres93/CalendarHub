import { eventFormState } from '../events/eventFormState';

export const separateHourFromMinute = (time) => {
  const hour = time.slice(0, 2);
  const minute = time.slice(3, 5);

  return {
    hour: hour,
    minute: minute,
  };
};

export const timeToMinutes = (time) => {
  const { hour, minute } = separateHourFromMinute(time);
  //Number ritorna il numero dalla stringa, moltiplico l'ora per 60, cosi da normalizzare l'unità di misura in minuti, perchè se no sarebbe come confrontare pere con banane
  return Number(hour) * 60 + Number(minute);
};

export function setTimeUIAndDraft(type, time) {
  const { hour, minute } = separateHourFromMinute(time);

  if (type === 'from') {
    document.querySelector('.input-hour.from').value = hour;
    document.querySelector('.input-minute.from').value = minute;
  }
  if (type === 'to') {
    document.querySelector('.input-hour.to').value = hour;
    document.querySelector('.input-minute.to').value = minute;
  }

  eventFormState[type] = time;
}
