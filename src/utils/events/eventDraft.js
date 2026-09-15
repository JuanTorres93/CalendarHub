import createElement from "../helpers/createElement.js";
import { createMessage } from "../helpers/createElement.js";
import { timeToMinutes } from "../helpers/timeHelper.js";

import {
  modalEvents,
  eventForm as eventContainer,
  inputTitle,
  eventDescriptionRow as firstRow,
  toHourInput,
  toMinuteInput,
  timeRow,
  dateRow,
} from "../helpers/dom/eventModalDom.js";

export const eventDraft = {
  title: "",
  date: "",
  from: "",
  to: "",
  description: "",
  icon: "✏️",
  color: "blue",
  urgent: false,
  allDay: false,
  repeat: null,
  notification: "5 minuti prima",
};

export function initEventDraft(date, time, endTime) {
  eventDraft.title = "";
  eventDraft.date = date;
  eventDraft.from = time;
  eventDraft.to = endTime;
  eventDraft.description = "";
  eventDraft.icon = "✏️";
  eventDraft.color = "blue";
  eventDraft.urgent = false;
  eventDraft.allDay = false;
  eventDraft.repeat = null;
  eventDraft.notification = "5 minuti prima";
}

export function resetEventDraft() {
  eventDraft.title = "";
  eventDraft.date = "";
  eventDraft.from = "";
  eventDraft.to = "";
  eventDraft.description = "";
  eventDraft.icon = "✏️";
  eventDraft.color = "blue";
  eventDraft.urgent = false;
  eventDraft.allDay = false;
  eventDraft.repeat = null;
  eventDraft.notification = "5 minuti prima";
}

export const timeDraft = {
  from: { hour: "", minute: "" },
  to: { hour: "", minute: "" },
};

export function updateEventDraft(field, value) {
  // if(!value)return
  eventDraft[field] = value;
}

export function validateTimeRange(timeDraft) {
  const from = timeDraft.from;
  const to = timeDraft.to;

  if (
    from.hour === "" ||
    from.minute === "" ||
    to.hour === "" ||
    to.minute === ""
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
    timeDraft.to.hour = "";
    timeDraft.to.minute = "";
    updateEventDraft("to", "");
    toHourInput.value = "";
    toMinuteInput.value = "";

    return false;
  }
  return true;
}

export function validatorEventDraft() {
  if (!eventDraft.title) {
    createMessage("inserisci un titolo", inputTitle, firstRow);
    return false;
  }
  if (!eventDraft.date) {
    createMessage("seleziona una data", dateRow, modalEvents);
    return false;
  }
  if (!eventDraft.allDay) {
    if (!eventDraft.from || !eventDraft.to) {
      createMessage("inserisci entrambi gli orari", timeRow, modalEvents);
      return false;
    }
    if (!validateTimeRange(timeDraft)) {
      createMessage("seleziona un orario", timeRow, modalEvents);
      return false;
    }
  } else {
    updateEventDraft("from", "00:00");
    updateEventDraft("to", "23:59");
  }
  return true;
}
