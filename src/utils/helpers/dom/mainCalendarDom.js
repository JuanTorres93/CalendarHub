const prevThemeImage = document.getElementById("prev-layer");
const nextThemeImage = document.getElementById("next-layer");

const loader = document.querySelector(".loader-layer");

const navbar = document.getElementById("navbar");
const secondRow = navbar.querySelector("#layer");

const actionBtns = secondRow.querySelector(".action-btns");
const notificationPermissionBtn = actionBtns.querySelector(
  ".notifications-permission-btn",
);

const notificationIconOff = notificationPermissionBtn.querySelector(
  '[data-notification-icon="off"]',
);

const notificationIconOn = notificationPermissionBtn.querySelector(
  '[data-notification-icon="on"]',
);

const monthBody = document.getElementById("month-body");
const monthGrid = monthBody.querySelector(".month-structure");

const weekBody = document.getElementById("week-body");
const weekGrid = weekBody.querySelector("#full-week-view");

const dayBody = document.getElementById("day-body");
const dayGrid = dayBody.querySelector("#full-day-view");

export {
  prevThemeImage,
  nextThemeImage,
  loader,
  actionBtns,
  notificationPermissionBtn,
  notificationIconOff,
  notificationIconOn,
  monthGrid,
  weekGrid,
  dayGrid,
};