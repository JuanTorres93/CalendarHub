import { createMessage } from '../helpers/createElement.js';
import {
  customContainer,
  repeatContainer,
} from '../helpers/dom/repeatModalDom.js';
import { eventFormState } from './eventFormState.js';

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

  eventFormState.repeat = { ...repeatProps };
};

export function updateRepeatDraft(field, value) {
  if (!eventFormState.repeat) {
    return;
  }

  eventFormState.repeat = {
    ...eventFormState.repeat,
    [field]: value,
  };
}

export function validatorRepeatDraft() {
  // Legacy code, Repeat draft will already be validated if creation succedes
  if (
    eventFormState.repeat?.type === 'custom' &&
    eventFormState.repeat?.customDates.length === 0
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
