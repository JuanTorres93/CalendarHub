import { AppGetAllTodoListsUsecase } from '../interface-adapters/use-cases/AppGetAllTodoListsUsecase.js';

import {
  getTodoListsFromLocalStorage,
  deleteTodoFromList,
  deleteTodoListFromLocalStorage,
  createTodoList,
  addTodoToList,
  renameTodoList,
  toggleTodoCompletion,
} from './toDoStorage.js';

import { createMessage } from '../utils/helpers/createElement.js';
import { initRenderBadge } from './toDoBadgeRendering.js';
import { handleOutsideContextualMenuClick } from './todoBadgeActions.js';
import { createTodoItem } from '../components/features/todo/todoItem.js';

const EMPTY_TODO_MESSAGE = 'Nessuna attività';
let todoPanelDomElements = null;
let activeTodoList = null;
let todoContextDate = null;

export function wireTodoPanelToTodoLogic(elements) {
  todoPanelDomElements = elements;
}

function cleanActiveTodoUi() {
  todoPanelDomElements.addNewItemContainer.classList.remove('show-add-new-item');
  todoPanelDomElements.toDoItemsContainer.innerHTML = '';
  todoPanelDomElements.toDoProgress.classList.remove('show-modal');
  todoPanelDomElements.toDoProgress.innerText = EMPTY_TODO_MESSAGE;
}

function resetTodoForm() {
  todoPanelDomElements.headerTitle.value = '';
}

export function openTodo(date) {
  const viewportWidth = window.innerWidth;
  todoPanelDomElements.createList.classList.add('show-modal');
  todoPanelDomElements.todoLayer.classList.add('show-modal');
  const toDoWidth = todoPanelDomElements.createList.clientWidth;
  let toDoPosition = viewportWidth / 2 - toDoWidth / 2;

  todoPanelDomElements.createList.style.left = `${toDoPosition}px`;

  if (date) {
    todoContextDate = date;
  }
}

export function getSelectedTodo(todoId) {
  const todos = getTodoListsFromLocalStorage();
  const currentTodo = todos.find((todo) => todo.id === todoId);
  if (!currentTodo) return;

  openTodo();
  rehydrateTodoList(currentTodo);
}

function rehydrateTodoList(todo) {
  activeTodoList = todo.id;
  todoContextDate = todo.date;

  cleanActiveTodoUi();

  todoPanelDomElements.headerTitle.value = todo.title;
  renderTodoHeader(todo.date);

  todoPanelDomElements.toDoProgress.classList.add('show-modal');
  todoPanelDomElements.addNewItemContainer.classList.add('show-add-new-item');

  todo.items.forEach((item) => {
    renderTodoItem(item);
  });

  updateToDoCounter();
}

function formatTodoHeaderDate(fullDate) {
  const month = fullDate.slice(5, 7);
  const day = fullDate.slice(8, 10);

  return `${day}-${month}`;
}

function renderTodoHeader(fullDate) {
  const date = formatTodoHeaderDate(fullDate);

  todoPanelDomElements.toDoHeader.classList.add('show-title-header');
  todoPanelDomElements.headerDate.textContent = date;
}

function initHeader() {
  renderTodoHeader(todoContextDate);
}

function closeToDoList() {
  resetTodoForm();
  todoPanelDomElements.toDoHeader.classList.remove('show-title-header');
  todoPanelDomElements.todoLayer.classList.remove('show-modal');
  todoPanelDomElements.createList.classList.remove('show-modal');
  cleanActiveTodoUi();
  activeTodoList = null;
  todoContextDate = null;
}

function handleCreateTodoList() {
  todoPanelDomElements.newToDoBtn.addEventListener('click', () => {
    if (!activeTodoList) {
      return initHeader();
    } else {
      resetTodoForm();
      cleanActiveTodoUi();
      activeTodoList = null;
    }
  });

  todoPanelDomElements.headerTitle.addEventListener('change', () => {
    const date = todoContextDate;
    const title = todoPanelDomElements.headerTitle.value.trim();

    if (!activeTodoList) {
      const createdTodoList = createTodoList(date, title);

      activeTodoList = createdTodoList.id;
      todoPanelDomElements.toDoProgress.classList.add('show-modal');
      todoPanelDomElements.addNewItemContainer.classList.add('show-add-new-item');

      initRenderBadge();

      return;
    }

    renameTodoList(activeTodoList, title);
  });
}

function updateToDoCounter() {
  const allTodo = AppGetAllTodoListsUsecase.execute();
  const updatedActiveList = allTodo.find(
    (todoList) => todoList.id === activeTodoList,
  );
  if (!updatedActiveList) return;

  const total = updatedActiveList.items.length;
  const completed = updatedActiveList.items.filter(
    (todoItem) => todoItem.completed,
  ).length;

  if (total === 0) {
    todoPanelDomElements.toDoProgress.innerText = EMPTY_TODO_MESSAGE;
    return;
  }

  todoPanelDomElements.toDoProgress.innerText = `${completed}/${total} attività completate`;
}

function handleCompletedItems(itemId, checkBtn) {
  checkBtn.classList.toggle('checked');

  toggleTodoCompletion(itemId);

  updateToDoCounter();
}

function deleteItems(id, domItem) {
  deleteTodoFromList(id, activeTodoList);

  domItem.remove();

  updateToDoCounter();
}

function deleteAndCleanTodoList() {
  if (!activeTodoList) return;

  deleteTodoListFromLocalStorage(activeTodoList);
  initRenderBadge();
  resetTodoForm();
  cleanActiveTodoUi();
  activeTodoList = null;
}

function handleTodoItemActions(e) {
  const item = e.target.closest('.todo-item');
  if (!item) return;

  const id = item.dataset.id;

  const deleteBtn = e.target.closest('.delete-item-todo-btn');
  const checkBtn = e.target.closest('.check-btn');

  if (deleteBtn) {
    deleteItems(id, item);
    return;
  }

  if (checkBtn) {
    handleCompletedItems(id, checkBtn);
    return;
  }
}

function renderTodoItem(todoItem) {
  todoPanelDomElements.toDoItemsContainer.appendChild(createTodoItem(todoItem));
}

function handleCreateItems() {
  todoPanelDomElements.addItemBtn.addEventListener('click', () => {
    const title = todoPanelDomElements.itemInput.value.trim();
    if (!title) {
      createMessage('Aggiungi un titolo', todoPanelDomElements.itemInput, todoPanelDomElements.addNewItemContainer);
      return;
    }

    const newItem = {
      title,
      completed: false,
    };
    renderTodoItem(newItem);

    addTodoToList(activeTodoList, title);
    updateToDoCounter();

    todoPanelDomElements.itemInput.value = '';
  });
}

export function initToDobinds() {
  handleCreateTodoList();
  handleCreateItems();
  handleOutsideContextualMenuClick();

  todoPanelDomElements.toDoItemsContainer.addEventListener('click', handleTodoItemActions);

  todoPanelDomElements.deleteList.addEventListener('click', deleteAndCleanTodoList);

  todoPanelDomElements.closeToDo.addEventListener('click', closeToDoList);
}
