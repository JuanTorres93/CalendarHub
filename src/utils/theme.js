import dayjs from "../day.js";
import {
  prevThemeImage as prev,
  nextThemeImage as next,
} from "./helpers/dom/mainCalendarDom.js";

const backgroundImage = (fileName) => {
  return `${import.meta.env.BASE_URL}images/background/${fileName}`;
};

const seasonalBackgrounds = {
  spring: backgroundImage("primavera.png"),
  summer: backgroundImage("estate.png"),
  autumn: backgroundImage("autunno.png"),
  winter: backgroundImage("inverno.png"),
};

const seasonLoadMap = {
  winter: {
    active: "winter",
    prev: "autumn",
    next: "spring",
  },

  spring: {
    active: "spring",
    prev: "winter",
    next: "summer",
  },

  summer: {
    active: "summer",
    prev: "spring",
    next: "autumn",
  },

  autumn: {
    active: "autumn",
    prev: "summer",
    next: "winter",
  },
};

function getSeason(date) {
  const month = date.month();

  if (month >= 2 && month < 5) return seasonLoadMap.spring;
  if (month >= 5 && month < 8) return seasonLoadMap.summer;
  if (month >= 8 && month < 11) return seasonLoadMap.autumn;
  return seasonLoadMap.winter;
}

export const theme = (date) => {
  const season = getSeason(date);
  document.body.style.backgroundImage = `url(${seasonalBackgrounds[season.active]})`;
  prev.style.backgroundImage = `url(${seasonalBackgrounds[season.prev]})`;
  next.style.backgroundImage = `url(${seasonalBackgrounds[season.next]})`;
};

//non serve importare theme nell'index, perchè lo chiama syncAll, che viene già passato nell'index
