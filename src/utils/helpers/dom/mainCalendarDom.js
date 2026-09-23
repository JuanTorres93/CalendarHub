const prevThemeImage = document.getElementById("prev-layer");
const nextThemeImage = document.getElementById("next-layer");

const loader = document.querySelector(".loader-layer");

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
  monthGrid,
  weekGrid,
  dayGrid,
};