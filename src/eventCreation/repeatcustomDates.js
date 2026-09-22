import { createMessage } from "../utils/helpers/createElement.js";
import { updateRepeatDraft } from "../utils/events/repeatEventsDraft.js";
import { formatDate } from "../utils/events/eventsUI.js";
import dateValidator from "../utils/helpers/dateValidator.js";
import {
  repeatContainer,
  customContainer,
  customList,
} from "../utils/helpers/dom/repeatModalDom.js";

let listOfDates = [];

function renderCustomDateItem(date) {
  const item = document.createElement("li");
  item.className = "custom-date-item";
  item.dataset.day = date;
  item.setAttribute("data-testid", `custom-date-item-${date}`);

  const dateLabel = document.createElement("span");
  dateLabel.textContent = formatDate(date);

  const removeBtn = document.createElement("button");
  removeBtn.className = "remove-custom-date";
  removeBtn.type = "button";
  removeBtn.textContent = "x";

  item.appendChild(dateLabel);
  item.appendChild(removeBtn);
  customList.appendChild(item);

  return item;
}

export function validateAndReturnCustomDate(date, eventModalDomElements) {
  const initialDate = eventModalDomElements.header.firstElementChild.dataset.day;
  const isNotValid = dateValidator(initialDate, date);

  if (isNotValid) {
    return createMessage(
      "La data deve essere successiva all'evento",
      customContainer,
      repeatContainer,
    );
  } else {
    if (date && !listOfDates.includes(date)) {
      const li = renderCustomDateItem(date);

      listOfDates.push(li.dataset.day);
      syncCustomDatesDraft();
    }
  }
}

export function initCustomDateRemoval() {
  customList.addEventListener("click", (e) => {
    const btn = e.target.closest(".remove-custom-date");
    if (!btn) return;

    const li = btn.closest(".custom-date-item");
    const date = li.dataset.day;

    listOfDates = listOfDates.filter((item) => item !== date);
    syncCustomDatesDraft();
    li.remove();
  });
}

function syncCustomDatesDraft() {
  updateRepeatDraft("customDates", [...listOfDates]);
}

export function getStoredCustomDates() {
  return [...listOfDates];
}
export function clearDatesStates() {
  listOfDates = [];
  customList.innerHTML = "";
}

export function hydrateCustomDates(dates) {
  listOfDates = [...dates];
  customList.innerHTML = "";

  dates.forEach((date) => {
    renderCustomDateItem(date);
  });

  syncCustomDatesDraft();
}
