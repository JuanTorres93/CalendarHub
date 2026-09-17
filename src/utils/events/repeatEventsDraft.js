import { Repeat } from '../../domain/value-objets/Repeat/Repeat.js';
import { createMessage } from '../helpers/createElement.js';
import {
  repeatContainer,
  modeContainer,
  customContainer,
} from '../helpers/dom/repeatModalDom.js';

export const repeatEventsDraft = {
  seriesId: null,
  type: null,
  interval: 1,
  weekdays: [],
  customDates: [],
  until: null,
  exceptions: [],
};

export const voRepeatDraft = {
  repeat: Repeat.create(null),
};

export const initRepeatDraft = (type, date, seriesId = null) => {
  const props = {
    seriesId,
    type,
    interval: 1,
    weekdays: [],
    customDates: [],
    until: date,
    exceptions: [],
  };

  voRepeatDraft.repeat = Repeat.create({
    ...props,
    seriesId: props.seriesId ?? 'fake-init-id',
  });

  // Legacy code
  repeatEventsDraft.seriesId = props.seriesId;
  repeatEventsDraft.type = props.type;
  repeatEventsDraft.interval = props.interval;
  repeatEventsDraft.weekdays = props.weekdays;
  repeatEventsDraft.customDates = props.customDates;
  repeatEventsDraft.until = props.until;
  repeatEventsDraft.exceptions = props.exceptions;
};

export const clearRepeatDraft = () => {
  const props = {
    seriesId: null,
    type: null,
    interval: 1,
    weekdays: [],
    customDates: [],
    until: null,
    exceptions: [],
  };

  voRepeatDraft.repeat = Repeat.create(null);

  // Legacy code
  repeatEventsDraft.seriesId = props.seriesId;
  repeatEventsDraft.type = props.type;
  repeatEventsDraft.interval = props.interval;
  repeatEventsDraft.weekdays = props.weekdays;
  repeatEventsDraft.customDates = props.customDates;
  repeatEventsDraft.until = props.until;
  repeatEventsDraft.exceptions = props.exceptions;
};

export function updateRepeatDraft(field, value) {
  const current = voRepeatDraft.repeat.toJSON();

  if (current) {
    voRepeatDraft.repeat = Repeat.create({
      ...current,
      [field]: value,
    });
  }

  // Legacy code
  repeatEventsDraft[field] = value;
}

export function validatorRepeatDraft() {
  // Legacy code, Repeat draft will already be validated if creation succedes
  if (!repeatEventsDraft.type) {
    createMessage('inserisci una modalità', modeContainer, repeatContainer);
    return false;
  }
  if (
    repeatEventsDraft.type === 'custom' &&
    repeatEventsDraft.customDates.length === 0
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
