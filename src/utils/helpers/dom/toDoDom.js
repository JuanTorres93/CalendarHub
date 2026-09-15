const todoLayer = document.querySelector(".todo-layer");
const createList = document.querySelector(".todo-panel");
const newToDoBtn = createList.querySelector(".new-list");
const toDoHeader = createList.querySelector(".to-do-title");
const closeToDo = createList.querySelector(".close-todo-btn");
const headerDate = toDoHeader.querySelector(".date-to-do");
const headerTitle = toDoHeader.querySelector(".todo-input-title");
const deleteList = toDoHeader.querySelector(".delete-list-btn");
const toDoItemsContainer = createList.querySelector(".todo-items-container");
const addNewItemContainer = createList.querySelector(".add-todo-row");
const itemInput = addNewItemContainer.querySelector(".todo-input");
const addItemBtn = addNewItemContainer.querySelector(".add-todo-btn");
const toDoProgress = createList.querySelector(".todo-progress");

export {
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
};
