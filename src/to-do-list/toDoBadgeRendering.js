import {
  monthGrid,
  weekGrid,
  dayGrid,
} from '../utils/helpers/dom/mainCalendarDom.js';
import { getTodoListsFromLocalStorage } from './toDoStorage.js';
import { openContextualMenu } from './todoBadgeActions.js';
import { createTodoBadge } from '../components/features/todo/todoBadge.js';

function renderBadgeHelper(allTodo, dataDay, container, grid, dayCell) {
  const todoOfDay = allTodo.filter((todo) => todo.date === dataDay);

  container.innerHTML = '';

  if (todoOfDay.length === 0) return;

  const badge = createTodoBadge({ count: todoOfDay.length, dataDay });
  container.appendChild(badge);

  badge.addEventListener('click', (e) => {
    e.stopPropagation();
    openContextualMenu(dataDay, container, grid, dayCell);
  });
}

function renderBadgeInMonth(allTodo) {
  const todoContainer = monthGrid.querySelectorAll('.todo-container-month');

  todoContainer.forEach((container) => {
    const dayCell = container.dayCell;
    const dataDay = dayCell.dataset.day;

    renderBadgeHelper(allTodo, dataDay, container, monthGrid, dayCell);
  });
}

function renderBadgeInWeek(allTodo) {
  const todoContainer = weekGrid.querySelectorAll('.week-todo-container');

  todoContainer.forEach((container) => {
    const dataDay = container.parentElement.parentElement.dataset.day;

    renderBadgeHelper(allTodo, dataDay, container, weekGrid);
  });
}

function renderBadgeDaily(allTodo) {
  const todoContainer = dayGrid.querySelector('.daily-todo-container');
  const dataDay = dayGrid.querySelector('.daily-header').dataset.day;

  renderBadgeHelper(allTodo, dataDay, todoContainer, dayGrid);
}

export function initRenderBadge() {
  const allTodo = getTodoListsFromLocalStorage();

  renderBadgeInMonth(allTodo);
  renderBadgeInWeek(allTodo);
  renderBadgeDaily(allTodo);
}
