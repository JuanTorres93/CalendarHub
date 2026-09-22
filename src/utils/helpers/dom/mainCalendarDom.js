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

const weekCarousel = document.querySelector(".week-carousel");
const weekBody = weekCarousel.querySelector("#week-body");
const weekGrid = weekBody.querySelector("#full-week-view");

const dayCarousel = document.getElementById("day-corousel");
const dayBody = dayCarousel.querySelector("#day-body");
const dayGrid = dayBody.querySelector("#full-day-view");

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
  weekCarousel,
  weekBody,
  weekGrid,
  dayCarousel,
  dayBody,
  dayGrid,
};