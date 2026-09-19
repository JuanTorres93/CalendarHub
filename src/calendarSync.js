import createMonthGrid from './components/features/calendar/monthGrid.js';
import createDailyGrid from './daily.js';
import createWeekGrid from './week.js';

import { calendarLogic } from './calendarLogic.js';
import dayjs from './day.js';
import { handleOpenCreate } from './eventCreation/eventLogic.js';
import { renderExtraInfo } from './eventCreation/infoBanner.js';
import { getSelectedTodo } from './to-do-list/toDo.js';
import { initRenderBadge } from './to-do-list/toDoBadgeRendering.js';
import {
  closeContextualMenu,
  openContextualMenu,
} from './to-do-list/todoBadgeActions.js';
import { config } from './utils/config/config.js';
import { renderEvents } from './utils/events/eventRendering.js';
import { theme } from './utils/theme.js';

import {
  currentDailyDisplay,
  currentMonthDisplay,
  currentWeekDisplay,
  currentYearDisplay,
  dayGrid,
  monthGrid,
  weekGrid,
} from './utils/helpers/dom/mainCalendarDom.js';

calendarLogic.init({
  createMonthGrid,
  monthGrid,
  config,
  createWeekGrid,
  createDailyGrid,
  theme,
  renderEvents,
  initRenderBadge,
  currentMonthDisplay,
  currentWeekDisplay,
  currentDailyDisplay,
  currentYearDisplay,
});

function highlightDayMonth(button) {
  const selectedDate = button.dataset.day;
  if (!selectedDate) return;
  calendarLogic.setDate(dayjs(selectedDate));
}

function handleMonthGridClick(e) {
  const eventElement = e.target.closest('.monthly-event');
  if (eventElement) {
    e.stopPropagation();
    renderExtraInfo(eventElement, e);
    return;
  }

  const selectedBtn = e.target.closest('[data-action="select-date"]');
  const cell = e.target.closest('[data-action="create-event"]');
  const todo = e.target.closest('.todo-btn-header');
  const itemContextualMenu = e.target.closest('[data-action="rehydrate-todo"]');
  const selectBtnAndTodoContainer = e.target.closest('.fist-row-month');
  const badgeContainer = e.target.closest('.todo-container-month');

  if (itemContextualMenu) {
    e.stopPropagation();
    getSelectedTodo(itemContextualMenu.dataset.id);
    closeContextualMenu(monthGrid);
    return;
  }

  if (selectedBtn) {
    e.stopPropagation();
    highlightDayMonth(selectedBtn);
    return;
  }
  if (todo) {
    e.stopPropagation();
    openContextualMenu(cell.dataset.day, badgeContainer, monthGrid, cell);
    return;
  }

  if (selectBtnAndTodoContainer) {
    e.stopPropagation();
    return;
  }
  if (cell) {
    e.stopPropagation();
    handleOpenCreate(e);
    return;
  }
}

function highLightWeek(e) {
  let highLight = e.target.parentElement.dataset.day;
  calendarLogic.setDate(dayjs(highLight));
}
function OpenModalWeek(e) {
  const selecthour = document.querySelectorAll('.week-box');
  const selectHalfhour = document.querySelectorAll('.week-half-box');

  selecthour.forEach((cell) => cell.classList.remove('selected-week'));
  selectHalfhour.forEach((cell) => cell.classList.remove('selected-week'));

  const box = e.target.closest('.week-box, .week-half-box');
  if (!box) return;

  handleOpenCreate(e);
}

function handleClickWeek(e) {
  const eventElement = e.target.closest('.weekly-event,.week-allDay-event');
  const todo = e.target.closest('.todo-btn-header');
  const header = e.target.closest('.week-day-display');
  const itemContextualMenu = e.target.closest('[data-action="rehydrate-todo"]');
  const badgeContainer = e.target.closest('.week-todo-container');
  if (itemContextualMenu) {
    e.stopPropagation();
    getSelectedTodo(itemContextualMenu.dataset.id);
    closeContextualMenu(weekGrid);
    return;
  }
  if (eventElement) {
    e.stopPropagation();
    renderExtraInfo(eventElement, e);
    return;
  }
  if (todo) {
    e.stopPropagation();
    openContextualMenu(header.dataset.day, badgeContainer, weekGrid);
    return;
  }
  if (
    e.target.classList.contains('week-box') ||
    e.target.classList.contains('week-half-box')
  ) {
    OpenModalWeek(e);
  }
  if (e.target.classList.contains('header-btn')) {
    highLightWeek(e);
  }
}

//click sul giorno
//refactor futuro, impostare l'intera logica sul closest per l'highlight, e se decido di tenere il singolo click; altrimenti in caso di drag per scelta multipla di orari il sistema di closest non funzionorebbe più, perchè dovrei fare riferimento al data-time storato all'interno di ogni elemento "li"
function handleDailyClick(e) {
  const selectHour = document.querySelectorAll('.day-box');
  const selectHalfhour = document.querySelectorAll('.day-half-box');
  const eventElement = e.target.closest('.daily-event, .daily-allDay-event');
  const badgeContainer = e.target.closest('.daily-todo-container');
  const todo = e.target.closest('.todo-btn-header');
  const header = e.target.closest('.daily-header');
  const itemContextualMenu = e.target.closest('[data-action="rehydrate-todo"]');
  if (itemContextualMenu) {
    e.stopPropagation();
    getSelectedTodo(itemContextualMenu.dataset.id);
    closeContextualMenu(dayGrid);
    return;
  }
  if (todo) {
    e.stopPropagation();
    openContextualMenu(header.dataset.day, badgeContainer, dayGrid);
    return;
  }
  if (eventElement) {
    e.stopPropagation();
    renderExtraInfo(eventElement, e);
    return;
  }

  selectHour.forEach((cell) => cell.classList.remove('selected-time'));
  selectHalfhour.forEach((cell) => cell.classList.remove('selected-time'));

  const box = e.target.closest('.day-box, .day-half-box');
  if (!box) return;

  if (e.target.classList.contains('day-box')) {
    e.target.nextElementSibling.classList.add('selected-time');
  } else if (e.target.classList.contains('day-half-box')) {
    e.target.previousElementSibling.classList.add('selected-time');
  }
  e.target.classList.add('selected-time');
  if (e.target.closest('.day-box, .day-half-box')) {
    handleOpenCreate(e);
  }
}

function bindCalendarEvents() {
  monthGrid.addEventListener('click', handleMonthGridClick);
  weekGrid.addEventListener('click', handleClickWeek);
  dayGrid.addEventListener('click', handleDailyClick);
}

export default function initCalendar() {
  bindCalendarEvents();
  calendarLogic.syncAll();
}
