import { createDayCell } from './dayCell.js';
import { createDayLabel } from './dayLabel.js';
import { config } from '../../../utils/config/config.js';
import { calendarLogic } from '../../../calendarLogic.js';
import dayjs from '../../../day.js';

let existingMainMonthGrid = null;
let existingMainMonthStructure = null;

function createMonthGrid(currentView, isMini = false) {
  if (!isMini) {
    if (existingMainMonthStructure) {
      reRenderMainGrid(currentView);

      return existingMainMonthGrid;
    }

    const grid = buildMonthGrid(currentView, isMini);

    existingMainMonthGrid = grid.monthContainer;
    existingMainMonthStructure = grid.monthStructureContainer;

    return existingMainMonthGrid;
  }

  return buildMonthGrid(currentView, isMini).monthContainer;
}

function buildMonthGrid(currentView, isMini) {
  const monthContainer = initMonthContainer(isMini);
  const monthStructureContainer = initMonthStructure();

  if (!isMini) {
    monthStructureContainer.addEventListener('click', (e) =>
      handleMonthGridClick(e, monthStructureContainer),
    );
  }

  monthContainer.appendChild(monthStructureContainer);
  buildGridContent(monthStructureContainer, currentView, isMini);

  return { monthContainer, monthStructureContainer };
}

function reRenderMainGrid(currentView) {
  existingMainMonthStructure.innerHTML = '';

  buildGridContent(existingMainMonthStructure, currentView, false);
}

function buildGridContent(monthStructureContainer, currentView, isMini) {
  const gridConfig = isMini ? config.mini : config.main;

  const giorniMese = currentView.daysInMonth();
  const primoGiorno = currentView.date(1);
  const firstDayIndex = currentView.startOf('month').weekday();
  const ultimoGiorno = currentView.endOf('month');
  const lastDayPrevMonth = primoGiorno.subtract(1, 'day');
  const firstDayNextMonth = ultimoGiorno.add(1, 'day');

  const firstRow = document.createElement('div');
  firstRow.classList.add('day-grid');

  monthStructureContainer.appendChild(firstRow);

  for (let j = 0; j < 7; j++) {
    firstRow.appendChild(
      createDayLabel({
        type: 'month',
        date: currentView.weekday(j),
        className: gridConfig.dailybox,
      }),
    );
  }
  const secondRow = document.createElement('article');
  secondRow.classList.add(`${gridConfig.boxesContainer}`);

  monthStructureContainer.appendChild(secondRow);

  for (let i = 0; i < 42; i++) {
    let dataDayID, dayNumber, dayClass;
    if (i < firstDayIndex) {
      dayNumber = lastDayPrevMonth.date() - (firstDayIndex - 1 - i);
      dataDayID = lastDayPrevMonth.date(dayNumber).format('YYYY-MM-DD');
      dayClass = `${gridConfig.colorOffset}`;
    } else if (i >= giorniMese + firstDayIndex) {
      dayNumber = i - (firstDayIndex + giorniMese - 1);
      dataDayID = firstDayNextMonth.date(dayNumber).format('YYYY-MM-DD');
      dayClass = `${gridConfig.colorOffset}`;
    } else {
      dayNumber = i - firstDayIndex + 1;
      dataDayID = primoGiorno.date(dayNumber).format('YYYY-MM-DD');
      if (dataDayID === currentView.format('YYYY-MM-DD')) {
        dayClass = `${gridConfig.today} ${gridConfig.colorBox}`;
      } else {
        dayClass = `${gridConfig.colorBox}`;
      }
    }

    secondRow.appendChild(
      createDayCell({
        dataDayID,
        extraClasses: [gridConfig.boxGrid, dayClass],
        isMini,
      }),
    );
  }
}

function initMonthContainer(isMini) {
  const monthContainer = document.createElement('div');

  if (!isMini) {
    monthContainer.id = 'month-body';
    monthContainer.classList.add('month-view');
    monthContainer.setAttribute('data-testid', 'month-view');
  }

  return monthContainer;
}

function initMonthStructure() {
  const monthStructureContainer = document.createElement('div');

  monthStructureContainer.classList.add('month-structure');

  return monthStructureContainer;
}

// Handlers

async function handleMonthGridClick(e, monthGrid) {
  e.stopPropagation();
  const eventElement = e.target.closest('.monthly-event');

  if (eventElement) {
    const { renderExtraInfo } =
      await import('../../../eventCreation/infoBanner.js');

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
    const { getSelectedTodo } = await import('../../../to-do-list/toDo.js');
    const { closeContextualMenu } =
      await import('../../../to-do-list/todoBadgeActions.js');

    getSelectedTodo(itemContextualMenu.dataset.id);
    closeContextualMenu(monthGrid);
    return;
  }

  if (selectedBtn) {
    highlightDayMonth(selectedBtn);
    return;
  }

  if (todo) {
    const { openContextualMenu } =
      await import('../../../to-do-list/todoBadgeActions.js');

    openContextualMenu(cell.dataset.day, badgeContainer, monthGrid, cell);
    return;
  }

  if (selectBtnAndTodoContainer) {
    return;
  }

  if (cell) {
    const { handleOpenCreate } =
      await import('../../../eventCreation/eventLogic.js');

    handleOpenCreate(e);
    return;
  }
}

function highlightDayMonth(button) {
  const selectedDate = button.dataset.day;
  if (!selectedDate) return;

  calendarLogic.setDate(dayjs(selectedDate));
}

export default createMonthGrid;
