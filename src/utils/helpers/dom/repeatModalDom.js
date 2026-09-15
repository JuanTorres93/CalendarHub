const modalEvents = document.querySelector(".event-container");
const eventForm = modalEvents.querySelector(".event-form");

const repeatContainer = eventForm.querySelector(".modal-repeat");
const repeatOverlay = eventForm.querySelector(".repeat-overlay");

const modeContainer = repeatContainer.querySelector(".repeat-mode-container");
const modeBtn = modeContainer.querySelector(".repeat-mode-btn");
const modeList = modeContainer.querySelector(".repeat-mode-list");

const intervalContainer = repeatContainer.querySelector(
  ".repeat-intervall-container",
);
const intervalInput = intervalContainer.querySelector(".intervall-input");
const intervalText = intervalContainer.querySelector(".dinamic-interval-text");

const weeklyContainer = repeatContainer.querySelector(
  ".weekly-repetion-container",
);
const dayOfWeekList = weeklyContainer.querySelector(".weekly-repetion-list");

const untilContainer = repeatContainer.querySelector(
  ".end-repeat-event-container",
);
const untilMiniCalendarBtn = untilContainer.querySelector(
  ".open-miniCalendar-repeation",
);
const untilText = untilContainer.querySelector(".end-repeation-event-date");

const customContainer = repeatContainer.querySelector(
  ".custom-dates-container",
);
const customMiniCalendarBtn = customContainer.querySelector(
  ".open-miniCalendar-custom-date",
);
const customList = customContainer.querySelector(".custom-dates-list");

const closeRepeatContainer = repeatContainer.querySelector(".close-repeat");
const closeBtn = closeRepeatContainer.querySelector(".cls-repeat");
const saveBtn = closeRepeatContainer.querySelector(".save-repeat");

export {
  repeatContainer,
  repeatOverlay,
  modeContainer,
  modeBtn,
  modeList,
  intervalContainer,
  intervalInput,
  intervalText,
  weeklyContainer,
  dayOfWeekList,
  untilContainer,
  untilMiniCalendarBtn,
  untilText,
  customContainer,
  customMiniCalendarBtn,
  customList,
  closeRepeatContainer,
  closeBtn,
  saveBtn,
};
