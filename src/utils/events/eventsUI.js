import createElement from "../helpers/createElement.js";
import dayjs from "../../day.js";
import { header } from "../helpers/dom/eventModalDom.js";

//questa funzione avrà acnhe il compito di cambiare il formato mostrato nel modulo eventi in ue/usa
export function formatDate(date) {
  let year, month, day;

  year = date.slice(0, 4);
  month = date.slice(5, 7);
  day = date.slice(8, 10);
  const actualMonth = Number(month) - 1;
  const monthInLetters = dayjs().month(actualMonth).format("MMMM");

  return `${day} ${monthInLetters} ${year}`;
}

export function updateEventDateUI(date) {
  header.firstElementChild.textContent = formatDate(date);
  header.firstElementChild.dataset.day = date;
}
