import { AppGetAllTodoListsUsecase } from '../interface-adapters/use-cases/AppGetAllTodoListsUsecase.js';

import {
  todoLayer,
  createList,
  newToDoBtn,
  closeToDo,
  toDoHeader,
  headerDate,
  headerTitle,
  deleteList,
  toDoItemsContainer,
  addNewItemContainer,
  itemInput,
  addItemBtn,
  toDoProgress,
} from '../utils/helpers/dom/toDoDom.js';

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
let activeTodoList = null;
let todoContextDate = null;

function cleanActiveTodoUi() {
  addNewItemContainer.classList.remove('show-add-new-item');
  toDoItemsContainer.innerHTML = '';
  toDoProgress.classList.remove('show-modal');
  toDoProgress.innerText = EMPTY_TODO_MESSAGE;
}

function resetTodoForm() {
  headerTitle.value = '';
}

export function openTodo(date) {
  const viewportWidth = window.innerWidth;
  createList.classList.add('show-modal');
  todoLayer.classList.add('show-modal');
  const toDoWidth = createList.clientWidth;
  let toDoPosition = viewportWidth / 2 - toDoWidth / 2;

  createList.style.left = `${toDoPosition}px`;

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

  headerTitle.value = todo.title;
  renderTodoHeader(todo.date);

  toDoProgress.classList.add('show-modal');
  addNewItemContainer.classList.add('show-add-new-item');

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

  toDoHeader.classList.add('show-title-header');
  headerDate.textContent = date;
}

function initHeader() {
  renderTodoHeader(todoContextDate);
}

function closeToDoList() {
  resetTodoForm();
  toDoHeader.classList.remove('show-title-header');
  todoLayer.classList.remove('show-modal');
  createList.classList.remove('show-modal');
  cleanActiveTodoUi();
  activeTodoList = null;
  todoContextDate = null;
}

function handleCreateTodoList() {
  newToDoBtn.addEventListener('click', () => {
    if (!activeTodoList) {
      return initHeader();
    } else {
      resetTodoForm();
      cleanActiveTodoUi();
      activeTodoList = null;
    }
  });

  headerTitle.addEventListener('change', () => {
    const date = todoContextDate;
    const title = headerTitle.value.trim();

    if (!activeTodoList) {
      const createdTodoList = createTodoList(date, title);

      activeTodoList = createdTodoList.id;
      toDoProgress.classList.add('show-modal');
      addNewItemContainer.classList.add('show-add-new-item');

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
    toDoProgress.innerText = EMPTY_TODO_MESSAGE;
    return;
  }

  toDoProgress.innerText = `${completed}/${total} attività completate`;
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
  toDoItemsContainer.appendChild(createTodoItem(todoItem));
}

function handleCreateItems() {
  addItemBtn.addEventListener('click', () => {
    const title = itemInput.value.trim();
    if (!title) {
      createMessage('Aggiungi un titolo', itemInput, addNewItemContainer);
      return;
    }

    const newItem = {
      title,
      completed: false,
    };
    renderTodoItem(newItem);

    addTodoToList(activeTodoList, title);
    updateToDoCounter();

    itemInput.value = '';
  });
}

export function initToDobinds() {
  handleCreateTodoList();
  handleCreateItems();
  handleOutsideContextualMenuClick();

  toDoItemsContainer.addEventListener('click', handleTodoItemActions);

  deleteList.addEventListener('click', deleteAndCleanTodoList);

  closeToDo.addEventListener('click', closeToDoList);
}
