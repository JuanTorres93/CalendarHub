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
  toDoDraft,
  initTodoDraft,
  resetStates,
  toDoItems,
  resetToDoItemsValues,
} from './toDoDraft.js';

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
  // Sync draft date so "New" creates another list for the same rehydrated day.
  initTodoDraft(todo.date);

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
  const currentDay = todoContextDate;

  renderTodoHeader(currentDay);
  initTodoDraft(currentDay);
}

function titleValidator(title) {
  if (!title.value.trim()) return false;
  return true;
}

function closeToDoList() {
  resetStates('close');
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
      resetStates('delete');
      cleanActiveTodoUi();
      activeTodoList = null;
    }
  });

  headerTitle.addEventListener('change', () => {
    const date = toDoDraft.date;
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
  resetStates('delete');
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
  itemInput.addEventListener('change', () => {
    const isValid = titleValidator(itemInput);
    if (!isValid) return;
    toDoItems.title = itemInput.value.trim();
  });

  addItemBtn.addEventListener('click', () => {
    if (!toDoItems.title) {
      createMessage('Aggiungi un titolo', itemInput, addNewItemContainer);
      return;
    } else {
      // toDoItems.id = crypto.randomUUID()
      const newItem = {
        ...toDoItems,
        id: crypto.randomUUID(),
      };
      //add "checked" to the check-btn
      renderTodoItem(newItem);

      addTodoToList(activeTodoList, newItem.title);
      updateToDoCounter();
    }
    resetToDoItemsValues();
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
