import {
  calendarContainer,
  dayInput,
  miniCalendar,
  miniCalendarLayer,
  monthInput,
  showModal,
  yearInput,
} from '../utils/helpers/dom/miniCalendarDom.js';

import { overlay } from '../calendarSync.js';
import dayjs from '../day.js';
import { validateAndReturnCustomDate } from '../eventCreation/repeatcustomDates.js';
import { config } from '../utils/config/config.js';
import { updateEventDraft } from '../utils/events/eventDraft.js';
import { updateEventDateUI } from '../utils/events/eventsUI.js';
import { updateUntilUIAndDraft } from '../utils/events/repeatEventsUi.js';
import createElement from '../utils/helpers/createElement.js';
import { initMonthList, initYearList } from './miniCalendarCarousels.js';

import { displayOverlays } from '../utils/helpers/dom/mainCalendarDom.js';

import { eventDateDiv } from '../utils/helpers/dom/eventModalDom.js';
import createMonthGrid from '../components/features/calendar/monthGrid.js';

let miniLocalDate = null;
let miniCalendarCommitTarget = 'normal';

function syncMiniInputs() {
  if (!miniLocalDate) return;
  yearInput.value = miniLocalDate.format('YYYY');
  monthInput.value = miniLocalDate.format('MM');
  dayInput.value = miniLocalDate.format('DD');
}

export function openMiniCalendar(
  type,
  date,
  commitTarget = type,
  anchorElement = null,
) {
  let top, left;
  miniCalendarCommitTarget = commitTarget;

  miniCalendarLayer.classList.add('show-mini-calendar-layer');
  if (type === 'normal') {
    miniLocalDate = dayjs(overlay.date);
    syncMiniInputs();

    createMiniCalendar(miniLocalDate);
    showModal.classList.add('show-mini-calendar');

    if (anchorElement) {
      const rect = anchorElement.getBoundingClientRect();
      top = rect.top;
      left = rect.left - 120;
    } else {
      displayOverlays.forEach((item) => {
        const display = item.closest('.show-display');
        if (!display) return;

        const displayRect = display.getBoundingClientRect();
        top = displayRect.top;
        left = displayRect.left + 80;
      });
    }
  }
  if (type === 'event') {
    miniLocalDate = dayjs(date);
    syncMiniInputs();
    createMiniCalendar(miniLocalDate);
    showModal.classList.add('show-mini-calendar');

    const eventDateDivRect = eventDateDiv.getBoundingClientRect();
    top = eventDateDivRect.top - miniCalendar.clientHeight / 2;
    left = eventDateDivRect.left + 80;
  }
  calendarContainer.style.top = `${top}px`;
  calendarContainer.style.left = `${left}px`;
}

export function closeMiniCalendar() {
  miniCalendarLayer.classList.remove('show-mini-calendar-layer');
  showModal.classList.remove('show-mini-calendar');
  calendarContainer.style.top = '';
  calendarContainer.style.left = '';
  miniCalendarCommitTarget = 'normal';
  miniLocalDate = null;
}
function cancelMiniCalendar() {
  miniLocalDate = dayjs(overlay.date);
  syncMiniInputs();
  createMiniCalendar(miniLocalDate);
  closeMiniCalendar();
  miniCalendarCommitTarget = 'normal';
}

function commitMiniDate() {
  if (!miniLocalDate) return;

  const selectedDate = miniLocalDate.format('YYYY-MM-DD');

  switch (miniCalendarCommitTarget) {
    case 'normal':
      overlay.setDate(dayjs(miniLocalDate));
      break;
    case 'event-date':
      updateEventDraft('date', selectedDate);
      updateEventDateUI(selectedDate);
      break;
    case 'repeat-until':
      updateUntilUIAndDraft(selectedDate);
      break;
    case 'custom-dates':
      validateAndReturnCustomDate(selectedDate);
      break;
  }
  closeMiniCalendar();
}

function updateMiniDatePart(part, value) {
  const num = parseInt(value);
  if (isNaN(num) || !miniLocalDate) return;

  switch (part) {
    case 'year':
      if (num < 1900 || num > 2200) return;
      miniLocalDate = miniLocalDate.year(num);
      break;
    case 'month':
      if (num < 1 || num > 12) return;
      miniLocalDate = miniLocalDate.month(num - 1);
      break;
    case 'day':
      if (num < 1 || num > 31) return;
      miniLocalDate = miniLocalDate.date(num);
      break;
  }

  syncMiniInputs();
  createMiniCalendar(miniLocalDate);
}

function selectDays(e) {
  const miniGrid = document.querySelector('.mini-boxes-container');
  if (!miniGrid) return;

  miniGrid.addEventListener('click', (e) => {
    const selectedDay = e.target.dataset.day;
    if (!selectedDay) return;
    miniLocalDate = dayjs(selectedDay);
    syncMiniInputs();
    createMiniCalendar(miniLocalDate);
  });
}

function onDatePartSelect(part, value) {
  miniLocalDate = miniLocalDate[part](value);
  syncMiniInputs();
  createMiniCalendar(miniLocalDate);
}

function createMiniCalendar(newDate) {
  miniCalendar.innerHTML = '';

  const miniMonth = newDate.month(newDate.month()).format('MMMM');
  const miniYear = newDate.year();

  const div = createElement(miniCalendar, 'mini-container', null, 'div');
  const btnsCont = createElement(div, 'mini-btns-cont', null, 'div');
  const monthBtn = createElement(
    btnsCont,
    'mini-month-btn',
    `${miniMonth}`,
    'button',
    {
      attributes: {
        type: 'button',
        'aria-label': `Seleziona mese. Mese corrente: ${miniMonth}`,
      },
    },
  );
  const yearBtn = createElement(
    btnsCont,
    'mini-year-btn',
    `${miniYear}`,
    'button',
    {
      attributes: {
        type: 'button',
        'aria-label': `Seleziona anno. Anno corrente: ${miniYear}`,
      },
    },
  );

  const monthList = createElement(monthBtn, 'month-lists', null, 'div');
  const yearList = createElement(yearBtn, 'year-lists', null, 'div');

  initMonthList(monthBtn, monthList, onDatePartSelect, newDate.month());
  initYearList(yearBtn, yearList, onDatePartSelect, newDate.year());

  const gridCalendar = createElement(div, 'mini-grid', null, 'div');
  const actionsCont = createElement(div, 'mini-actions', null, 'div');
  const cancelBtn = createElement(
    actionsCont,
    'mini-cancel-btn',
    'Annulla',
    'button',
    {
      attributes: {
        type: 'button',
      },
    },
  );
  const saveBtn = createElement(
    actionsCont,
    'mini-save-btn',
    'Salva',
    'button',
    {
      attributes: {
        type: 'button',
      },
    },
  );

  createMonthGrid(newDate, gridCalendar, config.mini);
  selectDays();

  cancelBtn.addEventListener('click', cancelMiniCalendar);
  saveBtn.addEventListener('click', commitMiniDate);
}

export function initiMiniCalendarInputs() {
  yearInput.addEventListener('change', () =>
    updateMiniDatePart('year', yearInput.value),
  );
  monthInput.addEventListener('change', () =>
    updateMiniDatePart('month', monthInput.value),
  );
  dayInput.addEventListener('change', () =>
    updateMiniDatePart('day', dayInput.value),
  );
}
