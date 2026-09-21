import dayjs from "../day.js";
import { handleListSelection } from "../utils/helpers/listSelection.js";
import renderYears from "../utils/helpers/creatYearList.js";

function btnEventsHelper(list, targetList) {
  const isOpen = list.classList.toggle("show-carousel");
  if (isOpen) {
    const target = list.querySelector(targetList);
    target?.scrollIntoView({ block: "center", behavior: "auto" });
  }
}

export function renderMonthList(currentMonthIndex) {
  const monthCaroseul = document.querySelector(".month-lists");
  const months = Array.from({ length: 12 }, (_, i) =>
    dayjs().month(i).format("MMMM"),
  );
  months.forEach((month, index) => {
    const el = document.createElement("div");
    el.className = "mini-month-item";
    el.setAttribute("data-testid", `mini-month-item-${index}`);
    el.textContent = month;

    if (index === currentMonthIndex) {
      el.classList.add("current-month-item");
    }

    monthCaroseul.appendChild(el);
  });
  return months;
}

function monthItemsEvents(btn, list, itemsOfList, onDatePartSelect) {
  btn.addEventListener("click", () =>
    btnEventsHelper(list, ".current-month-item"),
  );
  handleListSelection(
    list,
    ".mini-month-item",
    (li) => {
      onDatePartSelect("month", itemsOfList.indexOf(li.textContent));
    },
    "show-carousel",
  );
}

function yearListEvents(btn, list, onDatePartSelect) {
  btn.addEventListener("click", () =>
    btnEventsHelper(list, ".current-year-item"),
  );
  handleListSelection(
    list,
    ".mini-year-item",
    (li) => {
      onDatePartSelect("year", Number(li.textContent));
    },
    "show-carousel",
  );
}

export function initMonthList(btn, list, onDatePartSelect, currentMonthIndex) {
  const monthItems = renderMonthList(currentMonthIndex);
  monthItemsEvents(btn, list, monthItems, onDatePartSelect);
}

export function initYearList(btn, list, onDatePartSelect, currentYearIndex) {
  renderYears(
    ".year-lists",
    "mini-year-item",
    currentYearIndex,
    "current-year-item",
  );
  yearListEvents(btn, list, onDatePartSelect);
}
