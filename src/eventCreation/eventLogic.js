import dayjs from "../day.js";
import {
  eventDraft,
  validateTimeRange,
  timeDraft,
  initEventDraft,
  resetEventDraft,
} from "../utils/events/eventDraft.js";
import {
  renderColorList,
  renderNotificationList,
  renderIconsList,
} from "../utils/events/createLists.js";
import { openMiniCalendar } from "../miniCalendar/miniCalendar.js";
import {
  updateEventDraft,
  validatorEventDraft,
} from "../utils/events/eventDraft.js";
import { formatDate } from "../utils/events/eventsUI.js";
import createCaroseul from "../utils/events/createLists.js";
import { createMessage } from "../utils/helpers/createElement.js";
import { nowTarget } from "../utils/isNow.js";
import { renderEvents } from "../utils/events/eventRendering.js";
import {
  getEvents,
  saveEventsInLocalStorage,
} from "../utils/events/eventStorage.js";
import { setTimeUIAndDraft } from "../utils/helpers/timeHelper.js";
import openModal from "./eventModal.js";
import { initRepeatEvents, forceResetRepeatModalState } from "./repeatEvent.js";
import {
  handleListSelection,
  handleOutSideClick,
} from "../utils/helpers/listSelection.js";
import {
  modalEvents,
  modalOverlay,
  header,
  fromHourInput,
  fromMinuteInput,
  toHourInput,
  toMinuteInput,
  inputTitle,
  inputDesc,
  btnDesc,
  showDesc,
  categoryBtn,
  colorLists,
  colorPreview,
  urgentBtn,
  urgentCheckBox,
  miniCalendarBtn,
  allDayBtn,
  allDayCheckBox,
  timeSelectionContainer,
  listedTimeBtnFrom,
  listedTimeBtnTo,
  listedTimeFrom,
  listedTimeTo,
  repeatBtn,
  notificationBtn,
  notificationList,
  saveBtn,
  closeBtn,
  modalInfoMode,
  smallMessage,
  iconBtn,
  iconsList,
} from "../utils/helpers/dom/eventModalDom.js";

import {
  repeatContainer as repeatModal,
  repeatOverlay,
} from "../utils/helpers/dom/repeatModalDom.js";

const outsideDropdowns = [
  {
    selector: ".icons-list, #icons-btn",
    dropdown: iconsList,
    className: "show-icons-list",
  },

  {
    selector: ".description-area, .btn-description",
    dropdown: showDesc,
    className: "show-desc-area",
  },

  {
    selector: ".color-list, #color-btn",
    dropdown: colorLists,
    className: "show-color-list",
  },

  {
    selector: ".notification-list, .notification-button",
    dropdown: notificationList,
    className: "show-container",
  },

  {
    selector: ".interactive-time-list.from, .listed-time.from",
    dropdown: listedTimeFrom,
    className: "show-menù",
  },

  {
    selector: ".interactive-time-list.to, .listed-time.to",
    dropdown: listedTimeTo,
    className: "show-menù",
  },
];

const EVENT_DRAFT_FIELDS = [
  "title",
  "date",
  "from",
  "to",
  "description",
  "icon",
  "color",
  "urgent",
  "allDay",
  "repeat",
  "notification",
];

let formMode = "create";
let editingEventId = null;
let editingMotherEventId = null;
let editingOccurrenceDate = null;
let originalRepeatSnapshot = null;
let originalSeriesDate = null;

export const getData = (e) => {
  let date, time;
  const monthCell = e.target.closest(".box-grid");
  if (monthCell) {
    date = e.target.dataset.day;
    time = dayjs().minute(0).format("HH:mm");
    return {
      date: date,
      time: time,
    };
  } else {
    date = e.target.parentElement.dataset.day;
    time = e.target.dataset.time;
    return {
      date: date,
      time: time,
    };
  }
};

function classRemovalHelper(sections) {
  sections.forEach((item) => {
    if (item.section.classList.contains(item.class)) {
      item.section.classList.remove(item.class);
    }
  });
}

export function resetEventModal() {
  formMode = "create";
  editingEventId = null;
  editingMotherEventId = null;
  editingOccurrenceDate = null;
  originalRepeatSnapshot = null;
  originalSeriesDate = null;

  const sections = [
    { section: colorLists, class: "show-color-list" },
    { section: urgentCheckBox, class: "checked" },
    { section: iconsList, class: "show-icons-list" },
    { section: notificationList, class: "show-container" },
    { section: showDesc, class: "show-desc-area" },
    { section: listedTimeFrom, class: "show-menù" },
    { section: listedTimeTo, class: "show-menù" },
  ];
  if (allDayCheckBox.classList.contains("checked")) {
    allDayCheckBox.classList.remove("checked");
    timeSelectionContainer.classList.remove("hide-time-section");
  }

  classRemovalHelper(sections);
  resetEventDraft();

  iconBtn.innerText = "✏️";
  inputTitle.value = "";
  inputDesc.value = "";
  colorPreview.style.backgroundColor = "blue";
  fromHourInput.value = "";
  fromMinuteInput.value = "";
  toHourInput.value = "";
  toMinuteInput.value = "";
  notificationList.style.left = "";
  notificationBtn.innerText = "5 minuti prima";
  timeDraft.from.hour = "";
  timeDraft.from.minute = "";
  timeDraft.to.hour = "";
  timeDraft.to.minute = "";
}

const renderModeTextInfo = (mode, eventTitle) => {
  const header = modalInfoMode;
  smallMessage.innerText = "";
  switch (mode) {
    case "create":
      header.innerText = "Crea un nuovo evento!";
      break;
    case "edit":
      header.innerText = `Stai modificando : ${eventTitle}`;
      break;
    case "edit-series":
      header.innerText = `Stai modificando la serie ${eventTitle}`;
      smallMessage.innerText =
        "Le modifiche verranno applicate a tutta la serie.";
      break;
    case "edit-single-occurrence":
      header.innerText = `Stai modificando : ${eventTitle}`;
      smallMessage.innerText = "Questa occorrenza verrà separata dalla serie.";
      break;
    default:
      break;
  }
};

export function preCompiler(e) {
  const { date, time } = getData(e);
  const endTime = dayjs(time, "HH:mm").add(1, "hour").format("HH:mm");

  header.firstElementChild.textContent = formatDate(date);
  header.firstElementChild.dataset.day = date;
  header.firstElementChild.nextElementSibling.textContent = time;

  setTimeUIAndDraft(timeDraft, "from", time);
  setTimeUIAndDraft(timeDraft, "to", endTime);

  initEventDraft(date, time, endTime);
  renderModeTextInfo(formMode);
}

export function preCompilerEdit(event, mode) {
  formMode = mode;
  renderModeTextInfo(formMode, event.title);

  resetEventDraft();

  EVENT_DRAFT_FIELDS.forEach((field) => {
    if (!Object.hasOwn(event, field)) return;

    const value = event[field];

    eventDraft[field] =
      field === "repeat" && value !== null ? structuredClone(value) : value;
  });

  editingEventId = event.id;

  if (mode === "edit-single-occurrence") {
    editingEventId = null;
    editingMotherEventId = event.originalEventId
      ? event.originalEventId
      : event.id;
    editingOccurrenceDate = event.date;
    eventDraft.repeat = null;
  }

  if (mode === "edit-series") {
    // structuredClone(event.repeat) crea un clone dell'elemento
    originalRepeatSnapshot = structuredClone(event.repeat);
    originalSeriesDate = event.date;
  }

  header.firstElementChild.textContent = formatDate(event.date);
  header.firstElementChild.dataset.day = event.date; //risolve il miniCalendario data iniziale
  header.firstElementChild.nextElementSibling.textContent = event.from;

  iconBtn.innerText = event.icon;
  inputTitle.value = event.title;
  inputDesc.value = event.description;

  colorPreview.style.backgroundColor = `${event.color}`;

  if (event.urgent) {
    urgentCheckBox.classList.add("checked");
  }
  if (event.allDay) {
    allDayCheckBox.classList.add("checked");
    timeSelectionContainer.classList.add("hide-time-section");
  }
  setTimeUIAndDraft(timeDraft, "from", event.from);
  setTimeUIAndDraft(timeDraft, "to", event.to);

  notificationBtn.innerText = event.notification;
}

function updateTimeInput(part, value) {
  const num = parseInt(value);

  if (isNaN(num)) return;

  switch (part) {
    case "hour":
      if (num < 0 || num > 23) return;
      return String(num).padStart(2, "0");
      break;
    case "minute":
      if (num < 0 || num >= 60) return;
      return String(num).padStart(2, "0");
      break;
  }
}
function inputTimeHelper(timeDraft, caseType, input, classType) {
  const time = updateTimeInput(caseType, input.value);
  if (time === undefined) {
    input.value = "";
    return;
  }
  timeDraft[classType][caseType] = time;

  const current = timeDraft[classType];
  if (current.hour !== "" && current.minute !== "") {
    const finalTime = `${current.hour}:${current.minute}`;
    updateEventDraft(classType, finalTime);
  }
}

function inputTimeReader(timeDraft) {
  fromHourInput.addEventListener("change", () => {
    inputTimeHelper(timeDraft, "hour", fromHourInput, "from");
  });
  fromMinuteInput.addEventListener("change", () => {
    inputTimeHelper(timeDraft, "minute", fromMinuteInput, "from");
  });
  toHourInput.addEventListener("change", () => {
    inputTimeHelper(timeDraft, "hour", toHourInput, "to");
    validateTimeRange(timeDraft);
  });
  toMinuteInput.addEventListener("change", () => {
    inputTimeHelper(timeDraft, "minute", toMinuteInput, "to");
    validateTimeRange(timeDraft);
  });
}

function applySelectedTime(timeDraft, type, time) {
  setTimeUIAndDraft(timeDraft, type, time);
  updateEventDraft(type, time);
}

function closeModal() {
  modalOverlay.classList.remove("show-overlay");
  modalEvents.classList.remove("show-container");

  modalEvents.style.top = "";
  modalEvents.style.left = "";

  forceResetRepeatModalState();
  resetEventModal();
}

export function saveEvent() {
  const isValid = validatorEventDraft();
  if (!isValid) {
    return;
  } else {
    const events = getEvents();

    switch (formMode) {
      case "create": {
        const newEvent = {
          id: crypto.randomUUID(),
          ...eventDraft,
        };
        events.push(newEvent);
        saveEventsInLocalStorage(events);
        break;
      }

      case "edit": {
        const updatedEvents = events.map((event) => {
          return event.id === editingEventId
            ? { id: editingEventId, ...eventDraft }
            : event;
        });

        saveEventsInLocalStorage(updatedEvents);
        createMessage(
          "l'evento è stato modificato!",
          modalEvents,
          document.body,
        );
        break;
      }
      case "edit-single-occurrence": {
        const updatedEvents = events.map((event) => {
          if (event.id !== editingMotherEventId) return event;
          return {
            ...event,
            repeat: {
              ...event.repeat,
              exceptions: [...event.repeat.exceptions, editingOccurrenceDate],
            },
          };
        });
        const newEvent = {
          id: crypto.randomUUID(),
          ...eventDraft,
        };
        updatedEvents.push(newEvent);
        saveEventsInLocalStorage(updatedEvents);
        createMessage(
          "l'occorrenza è stata modificata!",
          modalEvents,
          document.body,
        );
        break;
      }
      case "edit-series": {
        const patternChanged =
          originalSeriesDate !== eventDraft.date ||
          JSON.stringify({
            type: originalRepeatSnapshot.type,
            interval: originalRepeatSnapshot.interval,
            weekdays: originalRepeatSnapshot.weekdays,
            customDates: originalRepeatSnapshot.customDates,
          }) !==
            JSON.stringify({
              type: eventDraft.repeat.type,
              interval: eventDraft.repeat.interval,
              weekdays: eventDraft.repeat.weekdays,
              customDates: eventDraft.repeat.customDates,
            });
        const updatedEvents = events.map((event) => {
          return event.id === editingEventId
            ? {
                ...eventDraft,
                id: editingEventId,

                repeat: {
                  ...eventDraft.repeat,
                  exceptions: patternChanged
                    ? []
                    : originalRepeatSnapshot.exceptions,
                },
              }
            : event;
        });
        saveEventsInLocalStorage(updatedEvents);
        createMessage(
          "la serie è stato modificata!",
          modalEvents,
          document.body,
        );
        break;
      }
    }

    closeModal();
  }
}

export function initEventFormEvents() {
  let title, desc;

  renderColorList();
  renderNotificationList();
  createCaroseul();
  renderIconsList();

  outsideDropdowns.forEach((item) => {
    handleOutSideClick(item.selector, item.dropdown, item.className);
  });

  iconBtn.addEventListener("click", () => {
    iconsList.classList.toggle("show-icons-list");
  });

  handleListSelection(
    iconsList,
    ".icon-list-item",
    (li) => {
      iconBtn.innerText = li.innerText;
      updateEventDraft("icon", li.innerText);
    },
    "show-icons-list",
  );

  btnDesc.addEventListener("click", () => {
    showDesc.classList.toggle("show-desc-area");
  });

  inputTitle.addEventListener("change", () => {
    title = inputTitle.value;
    updateEventDraft("title", title);
  });
  inputDesc.addEventListener("change", () => {
    desc = inputDesc.value;
    updateEventDraft("description", desc);
  });
  categoryBtn.addEventListener("click", () => {
    colorLists.classList.toggle("show-color-list");
  });

  handleListSelection(
    colorLists,
    ".color",
    (li) => {
      colorPreview.style.backgroundColor = li.dataset.color;
      updateEventDraft("color", li.dataset.color);
    },
    "show-color-list",
  );

  urgentBtn.addEventListener("click", () => {
    const isChecked = urgentCheckBox.classList.toggle("checked");
    updateEventDraft("urgent", isChecked);
  });

  miniCalendarBtn.addEventListener("click", () => {
    const date = header.firstElementChild.dataset.day;

    openMiniCalendar("event", date, "event-date");
  });

  allDayBtn.addEventListener("click", () => {
    const isChecked = allDayCheckBox.classList.toggle("checked");
    updateEventDraft("allDay", isChecked);
    if (isChecked) {
      timeSelectionContainer.classList.add("hide-time-section");
    } else {
      timeSelectionContainer.classList.remove("hide-time-section");
    }
  });

  inputTimeReader(timeDraft);

  listedTimeBtnFrom.addEventListener("click", (e) => {
    const isOpen = listedTimeFrom.classList.toggle("show-menù");

    if (isOpen) {
      const targetTime = eventDraft.from;
      const target = nowTarget(
        listedTimeFrom.querySelectorAll(".list-item"),
        null,
        "cellTime",
        targetTime,
      );
      target?.scrollIntoView({ block: "center", behavior: "auto" });
    }
  });
  listedTimeBtnTo.addEventListener("click", () => {
    const isOpen = listedTimeTo.classList.toggle("show-menù");

    if (isOpen) {
      const targetTime = eventDraft.to;
      const target = nowTarget(
        listedTimeTo.querySelectorAll(".list-item"),
        null,
        "cellTime",
        targetTime,
      );
      target?.scrollIntoView({ block: "center", behavior: "auto" });
    }
  });

  handleListSelection(
    listedTimeFrom,
    ".list-item",
    (li) => {
      applySelectedTime(timeDraft, "from", li.dataset.time);
      validateTimeRange(timeDraft);
    },
    "show-menù",
  );
  handleListSelection(
    listedTimeTo,
    ".list-item",
    (li) => {
      applySelectedTime(timeDraft, "to", li.dataset.time);
      validateTimeRange(timeDraft);
    },
    "show-menù",
  );

  repeatBtn.addEventListener("click", () => {
    repeatModal.classList.toggle("show-repeat-modal");
    repeatOverlay.classList.add("show-repeat-overlay");
  });

  notificationBtn.addEventListener("click", () => {
    const position = notificationBtn.getClientRects()[0].right;
    notificationList.style.left = position + "px";
    notificationList.classList.toggle("show-container");
  });

  handleListSelection(
    notificationList,
    ".single-notification",
    (li) => {
      updateEventDraft("notification", li.innerText);
      notificationBtn.innerText = li.innerText;
    },
    "show-container",
  );

  saveBtn.addEventListener("click", () => {
    saveEvent();
    renderEvents();
  });
  closeBtn.addEventListener("click", () => {
    closeModal();
  });
}

export function initEventModal() {
  initEventFormEvents();
  initRepeatEvents();
}

export function handleOpenCreate(e) {
  preCompiler(e);
  openModal(e);
}
