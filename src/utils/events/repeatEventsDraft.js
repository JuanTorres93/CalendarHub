import { createMessage } from '../helpers/createElement.js';
import {
  repeatContainer,
  modeContainer,
  customContainer,
} from '../helpers/dom/repeatModalDom.js';
import { eventDraft } from './eventDraft.js';

export const initRepeatDraft = (type, date) => {
  eventDraft.update({
    repeat: {
      seriesId: crypto.randomUUID(),
      type,
      interval: 1,
      weekdays: [],
      customDates: [],
      until: date,
      exceptions: [],
    },
  });
};

export const clearRepeatDraft = () => {
  eventDraft.update({ repeat: null });
};

export function updateRepeatDraft(field, value) {
  if (!eventDraft.repeat) {
    return;
  }

  eventDraft.update({
    repeat: {
      ...eventDraft.repeat,
      [field]: value,
    },
  });
}

export function validatorRepeatDraft() {
  const repeat = eventDraft.repeat;

  if (!repeat || !repeat.type) {
    createMessage('inserisci una modalità', modeContainer, repeatContainer);
    return false;
  }
  if (repeat.type === 'custom' && repeat.customDates.length === 0) {
    createMessage(
      'inserisci almeno una data',
      customContainer,
      repeatContainer,
    );
    return false;
  }
  return true;
}