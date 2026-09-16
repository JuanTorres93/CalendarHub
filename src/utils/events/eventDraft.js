import { AppIdGenerator } from '../../interface-adapters/services/AppIdGenerator.js';
import { createMessage } from '../helpers/createElement.js';
import { timeToMinutes } from '../helpers/timeHelper.js';

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
import { Event } from '../../domain/entities/event/Event.js';
import { toItalianNotification } from '../../interface-adapters/other/bidirectionalItalianDomainMapper.js';

export const eventDraft = {
  title: '',
  date: '',
  from: '',
  to: '',
  description: '',
  icon: '✏️',
  color: 'blue',
  urgent: false,
  allDay: false,
  repeat: null,
  notification: '5 minuti prima',
};

export function initEventDraft(date, time, endTime) {
  const event = Event.create({
    id: AppIdGenerator.generateId(),
    title: 'Go back to blank when finished refactor',
    date,
    from: time,
    to: endTime,
  });

  // TODO handle this empty string when refactor advances
  eventDraft.title = '';

  eventDraft.date = event.date;
  eventDraft.from = event.from;
  eventDraft.to = event.to;
  eventDraft.description = event.description;
  eventDraft.icon = event.icon;
  eventDraft.color = event.color;
  eventDraft.urgent = event.urgent;
  eventDraft.allDay = event.allDay;
  eventDraft.repeat = event.repeat;
  eventDraft.notification = toItalianNotification(event.notification);
}

export function resetEventDraft() {
  const event = Event.create({
    id: AppIdGenerator.generateId(),
    title: 'Go back to blank when finished refactor',
  });

  // TODO handle all these empty strings when refactor advances
  eventDraft.title = '';
  eventDraft.date = '';
  eventDraft.from = '';
  eventDraft.to = '';

  eventDraft.description = event.description;
  eventDraft.icon = event.icon;
  eventDraft.color = event.color;
  eventDraft.urgent = event.urgent;
  eventDraft.allDay = event.allDay;
  eventDraft.repeat = event.repeat;
  eventDraft.notification = toItalianNotification(event.notification);
}

export const timeDraft = {
  from: { hour: '', minute: '' },
  to: { hour: '', minute: '' },
};

export function updateEventDraft(field, value) {
  // if(!value)return
  eventDraft[field] = value;
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
    updateEventDraft('to', '');
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
    updateEventDraft('from', '00:00');
    updateEventDraft('to', '23:59');
  }
  return true;
}
