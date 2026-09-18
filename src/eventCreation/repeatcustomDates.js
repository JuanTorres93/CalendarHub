import { createMessage } from '../utils/helpers/createElement.js';
import createElement from '../utils/helpers/createElement.js';
import { updateRepeatDraft } from '../utils/events/repeatEventsDraft.js';
import { formatDate } from '../utils/events/eventsUI.js';
import dateValidator from '../utils/helpers/dateValidator.js';
import {
  repeatContainer,
  customContainer,
  customList,
} from '../utils/helpers/dom/repeatModalDom.js';

import { header } from '../utils/helpers/dom/eventModalDom.js';

let listOfDates = [];

function renderCustomDateItem(date) {
  const item = createElement(customList, 'custom-date-item', '', 'li', {
    dataset: { day: date },
    attributes: { 'data-testid': `custom-date-item-${date}` },
  });

  createElement(item, null, formatDate(date), 'span');

  createElement(item, 'remove-custom-date', 'x', 'button', {
    attributes: {
      type: 'button',
    },
  });

  return item;
}

export function validateAndReturnCustomDate(date) {
  const initialDate = header.firstElementChild.dataset.day;
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
  customList.addEventListener('click', (e) => {
    const btn = e.target.closest('.remove-custom-date');
    if (!btn) return;

    const li = btn.closest('.custom-date-item');
    const date = li.dataset.day;

    listOfDates = listOfDates.filter((item) => item !== date);
    syncCustomDatesDraft();
    li.remove();
  });
}

function syncCustomDatesDraft() {
  updateRepeatDraft('customDates', [...listOfDates]);
}

export function getStoredCustomDates() {
  return [...listOfDates];
}
export function clearDatesStates() {
  listOfDates = [];
  customList.innerHTML = '';
  syncCustomDatesDraft();
}

export function hydrateCustomDates(dates) {
  listOfDates = [...dates];
  customList.innerHTML = '';

  dates.forEach((date) => {
    renderCustomDateItem(date);
  });

  syncCustomDatesDraft();
}
