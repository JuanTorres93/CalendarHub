const prevThemeImage = document.getElementById("prev-layer");
const nextThemeImage = document.getElementById("next-layer");

const loader = document.querySelector(".loader-layer");

const navbar = document.getElementById("navbar");

const firstRow = navbar.querySelector("#first-layer");
const secondRow = navbar.querySelector("#layer");

const modeBtnsContainer = firstRow.querySelector(".mode-btns");
const dayBtn = modeBtnsContainer.querySelector("#day-btn");
const weekBtn = modeBtnsContainer.querySelector("#week-btn");
const monthBtn = modeBtnsContainer.querySelector("#month-btn");

const currentYearDisplay = firstRow.querySelector(".big-numbers.year");
const allOverlays = secondRow.querySelectorAll(".big-numbers.text");

const displayOverlays = secondRow.querySelectorAll(".display-overlay");
const displayOverlayMonth = secondRow.querySelector(".display-overlay.month");
const displayOverlayWeek = secondRow.querySelector(".display-overlay.week");
const displayOverlayDay = secondRow.querySelector(".display-overlay.day");

const currentMonthDisplay =
  displayOverlayMonth.querySelector(".big-numbers.text");
const currentWeekDisplay = displayOverlayWeek.querySelector(".week-displayed");
const currentDailyDisplay = displayOverlayDay.querySelector(".day-displayed");

const leftArrowMonth = displayOverlayMonth.querySelector(".left-arrow");
const rightArrowMonth = displayOverlayMonth.querySelector(".right-arrow");

const leftArrowWeek = displayOverlayWeek.querySelector(".left-arrow");
const rightArrowWeek = displayOverlayWeek.querySelector(".right-arrow");

const leftArrowDay = displayOverlayDay.querySelector(".left-arrow");
const rightArrowDay = displayOverlayDay.querySelector(".right-arrow");

const actionBtns = secondRow.querySelector(".action-btns");
const resetBtn = actionBtns.querySelector(".reset");
const newTodoBtn = actionBtns.querySelector(".new-btn");
const tutorialBtn = actionBtns.querySelector(".tutorial-btn");
const notificationPermissionBtn = actionBtns.querySelector(
  ".notifications-permission-btn",
);

const notificationIconOff = notificationPermissionBtn.querySelector(
  '[data-notification-icon="off"]',
);

const notificationIconOn = notificationPermissionBtn.querySelector(
  '[data-notification-icon="on"]',
);

const monthCarousel = document.getElementById("month-carousel");
const monthBody = monthCarousel.querySelector("#month-body");
const monthGrid = monthBody.querySelector(".month-structure");
const monthView = monthCarousel.querySelector(".month-view");

const weekCarousel = document.querySelector(".week-carousel");
const weekBody = weekCarousel.querySelector("#week-body");
const weekGrid = weekBody.querySelector("#full-week-view");
const weekView = weekCarousel.querySelector(".week-view");

const dayCarousel = document.getElementById("day-corousel");
const dayBody = dayCarousel.querySelector("#day-body");
const dayGrid = dayBody.querySelector("#full-day-view");
const dayView = dayCarousel.querySelector(".day-view");

export {
  prevThemeImage,
  nextThemeImage,
  loader,
  navbar,
  firstRow,
  secondRow,
  modeBtnsContainer,
  dayBtn,
  weekBtn,
  monthBtn,
  currentYearDisplay,
  allOverlays,
  displayOverlays,
  displayOverlayMonth,
  displayOverlayWeek,
  displayOverlayDay,
  currentMonthDisplay,
  currentWeekDisplay,
  currentDailyDisplay,
  leftArrowMonth,
  rightArrowMonth,
  leftArrowWeek,
  rightArrowWeek,
  leftArrowDay,
  rightArrowDay,
  actionBtns,
  resetBtn,
  newTodoBtn,
  tutorialBtn,
  notificationPermissionBtn,
  notificationIconOff,
  notificationIconOn,
  monthCarousel,
  monthBody,
  monthGrid,
  monthView,
  weekCarousel,
  weekBody,
  weekGrid,
  weekView,
  dayCarousel,
  dayBody,
  dayGrid,
  dayView,
};
