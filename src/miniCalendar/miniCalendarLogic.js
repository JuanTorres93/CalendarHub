import { calendarLogic } from '../calendarLogic.js';
import { calendarPresenter } from '../calendarPresenter.js';
import dayjs from '../day.js';
import { validateAndReturnCustomDate } from '../eventCreation/repeatcustomDates.js';
import { eventFormState } from '../utils/events/eventFormState.js';
import { formatDate } from '../utils/helpers/timeHelper.js';
import { updateUntilUIAndDraft } from '../eventCreation/repeatEvent.js';

let miniLocalDate = null;
let miniCalendarCommitTarget = 'normal';
let displayOverlays = [];
let eventModalDomElements = null;
let miniCalendarDomElements = null;

export function initMiniCalendarDeps(deps) {
  displayOverlays = deps.displayOverlays;
}

export function wireMiniCalendarDomElements(elements) {
  miniCalendarDomElements = elements;
}

export function wireEventFormElementsToMiniCalendar(elements) {
  eventModalDomElements = elements;
}

function renderMiniCalendar(newDate) {
  miniCalendarDomElements.renderContent({
    date: newDate,
    onDatePartSelect,
    onCancel: cancelMiniCalendar,
    onSave: commitMiniDate,
  });
}

function syncMiniInputs() {
  if (!miniLocalDate) return;
  miniCalendarDomElements.yearInput.value = miniLocalDate.format('YYYY');
  miniCalendarDomElements.monthInput.value = miniLocalDate.format('MM');
  miniCalendarDomElements.dayInput.value = miniLocalDate.format('DD');
}

export function openMiniCalendar(
  type,
  date,
  commitTarget = type,
  anchorElement = null,
) {
  let top, left;
  miniCalendarCommitTarget = commitTarget;

  miniCalendarDomElements.miniCalendarLayer.classList.add(
    'show-mini-calendar-layer',
  );
  if (type === 'normal') {
    miniLocalDate = dayjs(calendarLogic.date);
    syncMiniInputs();

    renderMiniCalendar(miniLocalDate);
    miniCalendarDomElements.showModal.classList.add('show-mini-calendar');

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
    renderMiniCalendar(miniLocalDate);
    miniCalendarDomElements.showModal.classList.add('show-mini-calendar');

    const eventDateDivRect =
      eventModalDomElements.eventDateDiv.getBoundingClientRect();
    top =
      eventDateDivRect.top -
      miniCalendarDomElements.miniCalendar.clientHeight / 2;
    left = eventDateDivRect.left + 80;
  }
  miniCalendarDomElements.calendarContainer.style.top = `${top}px`;
  miniCalendarDomElements.calendarContainer.style.left = `${left}px`;
}

export function closeMiniCalendar() {
  miniCalendarDomElements.miniCalendarLayer.classList.remove(
    'show-mini-calendar-layer',
  );
  miniCalendarDomElements.showModal.classList.remove('show-mini-calendar');
  miniCalendarDomElements.calendarContainer.style.top = '';
  miniCalendarDomElements.calendarContainer.style.left = '';
  miniCalendarCommitTarget = 'normal';
  miniLocalDate = null;
}
function cancelMiniCalendar() {
  miniLocalDate = dayjs(calendarLogic.date);
  syncMiniInputs();
  renderMiniCalendar(miniLocalDate);
  closeMiniCalendar();
  miniCalendarCommitTarget = 'normal';
}

function commitMiniDate() {
  if (!miniLocalDate) return;

  const selectedDate = miniLocalDate.format('YYYY-MM-DD');
  eventFormState.date = selectedDate;

  switch (miniCalendarCommitTarget) {
    case 'normal':
      calendarLogic.setDate(dayjs(miniLocalDate));
      calendarPresenter.render();
      break;
    case 'event-date':
      eventFormState.date = selectedDate;

      eventModalDomElements.header.firstElementChild.textContent =
        formatDate(selectedDate);
      eventModalDomElements.header.firstElementChild.dataset.day = selectedDate;
      break;
    case 'repeat-until':
      updateUntilUIAndDraft(selectedDate);
      break;
    case 'custom-dates':
      validateAndReturnCustomDate(selectedDate, eventModalDomElements);
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
  renderMiniCalendar(miniLocalDate);
}

function onDatePartSelect(part, value) {
  miniLocalDate = miniLocalDate[part](value);
  syncMiniInputs();
  renderMiniCalendar(miniLocalDate);
}

export function initiMiniCalendarInputs() {
  miniCalendarDomElements.miniCalendar.addEventListener('click', (e) => {
    const selectedDay = e.target.dataset.day;
    if (!selectedDay) return;

    miniLocalDate = dayjs(selectedDay);

    syncMiniInputs();

    renderMiniCalendar(miniLocalDate);
  });

  miniCalendarDomElements.yearInput.addEventListener('change', () =>
    updateMiniDatePart('year', miniCalendarDomElements.yearInput.value),
  );
  miniCalendarDomElements.monthInput.addEventListener('change', () =>
    updateMiniDatePart('month', miniCalendarDomElements.monthInput.value),
  );
  miniCalendarDomElements.dayInput.addEventListener('change', () =>
    updateMiniDatePart('day', miniCalendarDomElements.dayInput.value),
  );
}
