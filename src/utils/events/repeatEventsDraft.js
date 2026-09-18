import { createMessage } from '../helpers/createElement.js';
import {
  customContainer,
  repeatContainer,
} from '../helpers/dom/repeatModalDom.js';
import { eventDraft, globalEventState } from './eventDraft.js';

export const initRepeatDraft = (type, date) => {
  const props = {
    seriesId: null,
    type,
    interval: 1,
    weekdays: [],
    customDates: [],
    until: date,
    exceptions: [],
  };

  const repeatProps = {
    ...props,
    seriesId: 'fake-init-id',
  };

  globalEventState.repeat = { ...repeatProps };

  eventDraft.update({ repeat: repeatProps });
};

export const clearRepeatDraft = () => {
  eventDraft.update({ repeat: null });
};

export function updateRepeatDraft(field, value) {
  if (!eventDraft.repeat) {
    return;
  }

  if (!globalEventState.repeatForm) {
    globalEventState.repeatForm = {};
  }

  if (!globalEventState.repeat) {
    globalEventState.repeat = {};
  }

  globalEventState.repeatForm[field] = value;
  globalEventState.repeat[field] = value;

  const repeatProps = {
    ...eventDraft.repeat,
    [field]: value,
  };

  globalEventState.repeat = { ...repeatProps };

  eventDraft.update({ repeat: repeatProps });
}

export function validatorRepeatDraft() {
  // Legacy code, Repeat draft will already be validated if creation succedes
  if (
    eventDraft.repeat?.type === 'custom' &&
    eventDraft.repeat?.customDates.length === 0
  ) {
    createMessage(
      'inserisci almeno una data',
      customContainer,
      repeatContainer,
    );
    return false;
  }
  return true;
}
