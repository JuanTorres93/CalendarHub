// const displayOverlay = document.querySelectorAll(".display-overlay")
const miniCalendarLayer = document.querySelector(".mini-calendar-layer");
const calendarContainer = document.getElementById("mini-calendar");
const miniCalendar = calendarContainer.querySelector(
  ".mini-calendar-container",
);
const showModal = calendarContainer;
const yearInput = calendarContainer.querySelector(".input-year");
const monthInput = calendarContainer.querySelector(".input-month");
const dayInput = calendarContainer.querySelector(".input-day");

export {
  miniCalendarLayer,
  calendarContainer,
  miniCalendar,
  showModal,
  yearInput,
  monthInput,
  dayInput,
};
