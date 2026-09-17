import { Repeat } from '../../domain/value-objets/Repeat/Repeat.js';
import { createMessage } from '../helpers/createElement.js';
import {
  customContainer,
  repeatContainer,
} from '../helpers/dom/repeatModalDom.js';

export const voRepeatDraft = {
  repeat: Repeat.create(null),
};

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

  voRepeatDraft.repeat = Repeat.create({
    ...props,
    seriesId: 'fake-init-id',
  });
};

export const clearRepeatDraft = () => {
  voRepeatDraft.repeat = Repeat.create(null);
};

export function updateRepeatDraft(field, value) {
  if (!voRepeatDraft.repeat.toJSON()) {
    initRepeatDraft('daily', new Date());
  }

  voRepeatDraft.repeat = Repeat.create({
    ...voRepeatDraft.repeat.toJSON(),
    [field]: value,
  });
}

export function validatorRepeatDraft() {
  // Legacy code, Repeat draft will already be validated if creation succedes
  if (
    voRepeatDraft.repeat?.type === 'custom' &&
    voRepeatDraft.repeat?.customDates.length === 0
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
