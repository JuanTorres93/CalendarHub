import { Repeat } from '../../domain/value-objets/Repeat/Repeat.js';
import { createMessage } from '../helpers/createElement.js';
import {
  customContainer,
  repeatContainer,
} from '../helpers/dom/repeatModalDom.js';
import { eventDraft } from './eventDraft.js';

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

  const repeatProps = {
    ...props,
    seriesId: 'fake-init-id',
  };

  voRepeatDraft.repeat = Repeat.create(repeatProps);

  eventDraft.update({ repeat: repeatProps });
};

export const clearRepeatDraft = () => {
  voRepeatDraft.repeat = Repeat.create(null);

  eventDraft.update({ repeat: null });
};

export function updateRepeatDraft(field, value) {
  if (!voRepeatDraft.repeat.toJSON()) {
    initRepeatDraft('daily', new Date());
  }

  const repeatProps = {
    ...voRepeatDraft.repeat.toJSON(),
    [field]: value,
  };

  voRepeatDraft.repeat = Repeat.create(repeatProps);

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
