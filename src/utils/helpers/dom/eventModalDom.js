const modalOverlay = document.querySelector(".modal-overlay");
const modalEvents = document.querySelector(".event-container");

const eventForm = modalEvents.querySelector(".event-form");

const currentEventMode = modalEvents.querySelector(".current-event-mode");
const modalInfoMode = currentEventMode.querySelector(".modal-info-mode");
const smallMessage = currentEventMode.querySelector(
  ".current-mode-secondary-message",
);

const header = eventForm.querySelector(".show-date");

const eventDescriptionRow = eventForm.querySelector(".event-description");
const iconBtn = eventDescriptionRow.querySelector("#icons-btn");
const iconsList = eventDescriptionRow.querySelector(".icons-list");
const inputTitle = eventDescriptionRow.querySelector(".input-name");
const btnDesc = eventDescriptionRow.querySelector(".btn-description");
const showDesc = eventDescriptionRow.querySelector(".description-area");
const inputDesc = eventDescriptionRow.querySelector(".description-area-text");

const categoryRow = eventForm.querySelector(".category-selector");
const categoryBtn = categoryRow.querySelector("#color-btn");
const colorLists = categoryRow.querySelector(".color-list");
const colorPreview = categoryRow.querySelector(".color-preview");
const urgentBtn = categoryRow.querySelector("#urgent-btn");
const urgentCheckBox = urgentBtn.querySelector(".checkBox");

const dateRow = eventForm.querySelector("#row-date");
const eventDateDiv = dateRow.querySelector(".event-date");
const miniCalendarBtn = dateRow.querySelector(".mini-calendar-btn");
const allDayBtn = dateRow.querySelector("#all-day-btn");
const allDayCheckBox = allDayBtn.querySelector(".checkBox");

const timeRow = eventForm.querySelector("#row-time");
const timeSelectionContainer = timeRow.querySelector(".time-selection");

const fromHourInput = timeRow.querySelector(".input-hour.from");
const fromMinuteInput = timeRow.querySelector(".input-minute.from");
const toHourInput = timeRow.querySelector(".input-hour.to");
const toMinuteInput = timeRow.querySelector(".input-minute.to");

const listedTimeBtnFrom = timeRow.querySelector(".listed-time.from");
const listedTimeBtnTo = timeRow.querySelector(".listed-time.to");
const listedTimeFrom = timeRow.querySelector(".interactive-time-list.from");
const listedTimeTo = timeRow.querySelector(".interactive-time-list.to");
const ulContainer = timeRow.querySelectorAll(".interactive-time-list");

const repeatBtn = timeRow.querySelector(".event-repeat-btn");

const notificationRow = eventForm.querySelector("#notification-row");
const notificationBtn = notificationRow.querySelector(".notification-button");
const notificationList = notificationRow.querySelector(".notification-list");
const saveBtn = notificationRow.querySelector("#save-event");
const closeBtn = notificationRow.querySelector(".close-btn");

const repeatOverlay = eventForm.querySelector(".repeat-overlay");

export {
  modalOverlay,
  modalEvents,
  eventForm,
  currentEventMode,
  modalInfoMode,
  smallMessage,
  header,
  eventDescriptionRow,
  iconBtn,
  iconsList,
  inputTitle,
  btnDesc,
  showDesc,
  inputDesc,
  categoryRow,
  categoryBtn,
  colorLists,
  colorPreview,
  urgentBtn,
  urgentCheckBox,
  dateRow,
  eventDateDiv,
  miniCalendarBtn,
  allDayBtn,
  allDayCheckBox,
  timeRow,
  timeSelectionContainer,
  fromHourInput,
  fromMinuteInput,
  toHourInput,
  toMinuteInput,
  listedTimeBtnFrom,
  listedTimeBtnTo,
  listedTimeFrom,
  listedTimeTo,
  ulContainer,
  repeatBtn,
  notificationRow,
  notificationBtn,
  notificationList,
  saveBtn,
  closeBtn,
  repeatOverlay,
};
