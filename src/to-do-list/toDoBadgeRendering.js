import {
  monthGrid,
  weekGrid,
  dayGrid,
} from "../utils/helpers/dom/mainCalendarDom.js";
import { getTodoFromLocalStorage } from "./toDoStorage.js";

function renderBadgeHelper(allTodo, dataDay, container) {
  const todoOfDay = allTodo.filter((todo) => todo.date === dataDay);
  if (todoOfDay.length > 0) {
    container.innerHTML = `<button type="button" class="todo-btn-header" data-testid="todo-badge-${dataDay}">
                    <span class="todo-count">
                    ${todoOfDay.length}
                    </span>
                    <span class="todo-icon">📜</span>
                </button>
                `;
  } else {
    container.innerHTML = "";
  }
}

function renderBadgeInMonth(allTodo) {
  const todoContainer = monthGrid.querySelectorAll(".todo-container-month");

  todoContainer.forEach((container) => {
    const dataDay = container.parentElement.parentElement.dataset.day;
    renderBadgeHelper(allTodo, dataDay, container);
  });
}
function renderBadgeInWeek(allTodo) {
  const todoContainer = weekGrid.querySelectorAll(".week-todo-container");

  todoContainer.forEach((container) => {
    const dataDay = container.parentElement.parentElement.dataset.day;
    renderBadgeHelper(allTodo, dataDay, container);
  });
}

function renderBadgeDaily(allTodo) {
  const todoContainer = dayGrid.querySelector(".daily-todo-container");
  const dataDay = dayGrid.querySelector(".daily-header").dataset.day;
  renderBadgeHelper(allTodo, dataDay, todoContainer);
}

export function initRenderBadge() {
  const allTodo = getTodoFromLocalStorage();

  renderBadgeInMonth(allTodo);
  renderBadgeInWeek(allTodo);
  renderBadgeDaily(allTodo);
}
