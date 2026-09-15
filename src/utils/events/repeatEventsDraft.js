import { createMessage } from "../helpers/createElement.js";
import {
  repeatContainer,
  modeContainer,
  customContainer,
} from "../helpers/dom/repeatModalDom.js";

export const repeatEventsDraft = {
  seriesId: null,
  type: null,
  interval: 1,
  weekdays: [],
  customDates: [],
  until: null,
  exceptions: [],
};

export const initRepeatDraft = (type, date) => {
  ((repeatEventsDraft.seriesId = null),
    (repeatEventsDraft.type = type),
    (repeatEventsDraft.interval = 1),
    (repeatEventsDraft.weekdays = []),
    (repeatEventsDraft.customDates = []),
    (repeatEventsDraft.until = date),
    (repeatEventsDraft.exceptions = []));
};

export const clearRepeatDraft = () => {
  ((repeatEventsDraft.seriesId = null),
    (repeatEventsDraft.type = null),
    (repeatEventsDraft.interval = 1),
    (repeatEventsDraft.weekdays = []),
    (repeatEventsDraft.customDates = []),
    (repeatEventsDraft.until = null),
    (repeatEventsDraft.exceptions = []));
};

export function updateRepeatDraft(field, value) {
  repeatEventsDraft[field] = value;
}

export function validatorRepeatDraft() {
  if (!repeatEventsDraft.type) {
    createMessage("inserisci una modalità", modeContainer, repeatContainer);
    return false;
  }
  if (
    repeatEventsDraft.type === "custom" &&
    repeatEventsDraft.customDates.length === 0
  ) {
    createMessage(
      "inserisci almeno una data",
      customContainer,
      repeatContainer,
    );
    return false;
  }
  return true;
}
