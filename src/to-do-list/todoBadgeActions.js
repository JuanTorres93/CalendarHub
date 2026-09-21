import { getTodoFromLocalStorage } from "./toDoStorage.js";
import getDropDownPosition from "../utils/helpers/dropDownPositioner.js";
import { monthGrid } from "../utils/helpers/dom/mainCalendarDom.js";

let todoMenuContext;

function createItemsOfTodoMenu(items, father) {
  items.forEach((item) => {
    const menuItem = document.createElement("li");
    menuItem.dataset.id = item.id;
    menuItem.dataset.action = "rehydrate-todo";
    menuItem.setAttribute("data-testid", `todo-menu-item-${item.id}`);
    menuItem.textContent = item.title;

    father.appendChild(menuItem);

    menuItem.addEventListener("click", async (e) => {
      e.stopPropagation();
      const { getSelectedTodo } = await import("./toDo.js");

      getSelectedTodo(menuItem.dataset.id);
      closeContextualMenu(todoMenuContext);
    });
  });
}

export function openContextualMenu(
  date,
  fatherCell,
  contextElement,
  monthCell,
) {
  const allTodo = getTodoFromLocalStorage();
  const existingMenu = contextElement.querySelector(".contextual-menu");

  if (existingMenu) {
    closeContextualMenu(contextElement);
  }
  todoMenuContext = contextElement;

  const todoOfTheDay = allTodo.filter((todo) => todo.date === date);

  const menu = document.createElement("div");
  menu.className = "contextual-menu";
  menu.setAttribute("data-testid", "todo-contextual-menu");

  const ul = document.createElement("ul");
  ul.className = "contextual-menu-list";
  ul.setAttribute("data-testid", "todo-contextual-menu-list");

  menu.appendChild(ul);
  fatherCell.appendChild(menu);

  createItemsOfTodoMenu(todoOfTheDay, ul);
  if (contextElement === monthGrid) {
    //ho alzato lo z-index del padre perchè le celle vengono generate una dopo l'altra,
    //questo siginifica che il menu veniva sovrascritto dalla cella successiva.
    //infatti se il menu si apriva su una cella precedente, questo non veniva sovvrascritto
    menu.style.zIndex = "100";
    monthCell.style.zIndex = "99";
  }

  getDropDownPosition(menu, fatherCell);
}

export function handleOutsideContextualMenuClick() {
  document.addEventListener("click", (e) => {
    if (!todoMenuContext) return;
    const menu = todoMenuContext.querySelector(".contextual-menu");
    if (menu) {
      const inside = e.target.closest(".contextual-menu");
      if (!inside) {
        closeContextualMenu(todoMenuContext);
      }
    }
  });
}

function cleanUpZIndexMonth() {
  const cells = monthGrid.querySelectorAll(".box-grid");
  cells.forEach((cell) => (cell.style.zIndex = "10"));
  return;
}

export function closeContextualMenu(contextElement) {
  const menu = contextElement.querySelector(".contextual-menu");
  if (!menu) return;
  menu.remove();

  if (contextElement === monthGrid) {
    cleanUpZIndexMonth();
  }
  todoMenuContext = null;
}
