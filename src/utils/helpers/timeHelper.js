import { timeDraft } from '../events/eventDraft';

const fromHourInput = document.querySelector('.input-hour.from');
const fromMinuteInput = document.querySelector('.input-minute.from');
const toHourInput = document.querySelector('.input-hour.to');
const toMinuteInput = document.querySelector('.input-minute.to');

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
    fromHourInput.value = hour;
    fromMinuteInput.value = minute;
  }
  if (type === 'to') {
    toHourInput.value = hour;
    toMinuteInput.value = minute;
  }

  timeDraft[type].hour = hour;
  timeDraft[type].minute = minute;
}
