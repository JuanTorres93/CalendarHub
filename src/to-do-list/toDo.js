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
  createNewTodo,
  toDoDraft,
  initTodoDraft,
  resetStates,
  toDoItems,
  resetToDoItemsValues,
} from './toDoDraft.js';

import {
  saveTodo,
  getTodoFromLocalStorage,
  deleteItemsFromLocalStorage,
  deleteTodoListFromLocalStorage,
} from './toDoStorage.js';

import { createMessage } from '../utils/helpers/createElement.js';
import { initRenderBadge } from './toDoBadgeRendering.js';
import { handleOutsideContextualMenuClick } from './todoBadgeActions.js';

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
  const todos = getTodoFromLocalStorage();
  const currentTodo = todos.find((todo) => todo.id === todoId);
  if (!currentTodo) return;

  openTodo();
  rehydrateTodoList(currentTodo);
}

function rehydrateTodoList(todo) {
  const todos = getTodoFromLocalStorage();

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

  updateToDoCounter(todos);
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
    const isValid = titleValidator(headerTitle);
    if (!isValid) return;
    const date = toDoDraft.date;
    const title = headerTitle.value.trim();
    const existingTodo = getTodoFromLocalStorage();

    if (!activeTodoList) {
      createNewTodo(date, title);

      existingTodo.push({ ...toDoDraft });
      activeTodoList = toDoDraft.id;
      saveTodo(existingTodo);
      toDoProgress.classList.add('show-modal');
      addNewItemContainer.classList.add('show-add-new-item');
      initRenderBadge();
      return;
    }
    const updatedTodos = existingTodo.map((todo) => {
      return todo.id === activeTodoList ? { ...todo, title } : todo;
    });

    saveTodo(updatedTodos);
  });
}
function updateToDoCounter(updateList) {
  if (!updateList) return;
  const updatedActiveList = updateList.find(
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
  const existingTodo = getTodoFromLocalStorage();

  const checked = checkBtn.classList.toggle('checked');

  const modTodo = existingTodo.map((todo) => {
    return todo.id === activeTodoList
      ? {
          ...todo,
          items: todo.items.map((todoItem) => {
            return todoItem.id === itemId
              ? {
                  ...todoItem,
                  completed: checked,
                }
              : todoItem;
          }),
        }
      : todo;
  });
  saveTodo(modTodo);
  // Passo lo stato aggiornato delle ToDo al counter,
  // così evito di rileggere subito dal LocalStorage.
  updateToDoCounter(modTodo);
}

function deleteItems(id, item) {
  const modTodo = deleteItemsFromLocalStorage(id, activeTodoList);
  item.remove();
  updateToDoCounter(modTodo);
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
  const todoElement = document.createElement('article');
  todoElement.className = 'todo-item';
  todoElement.dataset.id = todoItem.id;
  todoElement.setAttribute('data-testid', `todo-item-${todoItem.id}`);

  todoElement.innerHTML = `<button type="button" class="check-btn ${todoItem.completed ? 'checked' : ''}" aria-label="Completa attività" data-testid="todo-item-check-${todoItem.id}">
            <svg viewBox="0 0 24 24" class="todo-check-icon">
                <rect x="3" y="3" width="18" height="18" rx="4"></rect>
                <path d="M7 12.5l3 3 7-7"></path>
            </svg>
        </button>

        <strong class="title-item"></strong>

        <button type="button" class="delete-item-todo-btn show-delete" aria-label="Elimina attività" data-testid="todo-item-delete-${todoItem.id}">
            <svg viewBox="0 0 24 24" class="todo-delete-icon">
                <path d="M3 6h18"></path>
                <path d="M8 6V4h8v2"></path>
                <path d="M6 6l1 15h10l1-15"></path>
                <path d="M10 11v6"></path>
                <path d="M14 11v6"></path>
            </svg>
        </button>`;

  toDoItemsContainer.appendChild(todoElement);

  const titleElement = todoElement.querySelector('.title-item');

  titleElement.textContent = todoItem.title;
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

      const existingTodo = getTodoFromLocalStorage();
      const modTodo = existingTodo.map((item) => {
        return item.id === activeTodoList
          ? {
              ...item,
              items: [...item.items, newItem],
            }
          : item;
      });
      saveTodo(modTodo);
      updateToDoCounter(modTodo);
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
