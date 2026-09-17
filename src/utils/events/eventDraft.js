import { AppIdGenerator } from '../../interface-adapters/services/AppIdGenerator.js';
import { createMessage } from '../helpers/createElement.js';
import { timeToMinutes } from '../helpers/timeHelper.js';

import { Event } from '../../domain/entities/event/Event.js';
import {
  dateRow,
  eventForm as eventContainer,
  eventDescriptionRow as firstRow,
  inputTitle,
  modalEvents,
  timeRow,
  toHourInput,
  toMinuteInput,
} from '../helpers/dom/eventModalDom.js';

export const globalEventState = {
  mode: 'create',
};

export const eventDraft = Event.create({
  id: AppIdGenerator.generateId(),
  title: '',
  from: '00:00',
  to: '01:00',
});

export const timeDraft = {
  from: { hour: '', minute: '' },
  to: { hour: '', minute: '' },
};

export function updateEventDraft(field, value) {
  globalEventState[field] = value;

  eventDraft.update({
    [field]: value,
  });
}

export function validateTimeRange(timeDraft) {
  const from = timeDraft.from;
  const to = timeDraft.to;

  if (
    from.hour === '' ||
    from.minute === '' ||
    to.hour === '' ||
    to.minute === ''
  )
    return false;

  const fromMinutes = timeToMinutes(`${from.hour}:${from.minute}`);
  const toMinutes = timeToMinutes(`${to.hour}:${to.minute}`);

  if (fromMinutes >= toMinutes) {
    createMessage(
      "l'orario di fine deve essere nello stesso giorno",
      timeRow,
      eventContainer,
    );
    timeDraft.to.hour = '';
    timeDraft.to.minute = '';
    toHourInput.value = '';
    toMinuteInput.value = '';

    return false;
  }
  return true;
}

export function validatorEventDraft() {
  if (!eventDraft.title) {
    createMessage('inserisci un titolo', inputTitle, firstRow);
    return false;
  }
  if (!eventDraft.date) {
    createMessage('seleziona una data', dateRow, modalEvents);
    return false;
  }
  if (!eventDraft.allDay) {
    if (!eventDraft.from || !eventDraft.to) {
      createMessage('inserisci entrambi gli orari', timeRow, modalEvents);
      return false;
    }
    if (!validateTimeRange(timeDraft)) {
      createMessage('seleziona un orario', timeRow, modalEvents);
      return false;
    }
  } else {
    globalEventState.from = '00:00';
    globalEventState.to = '23:59';
  }
  return true;
}
