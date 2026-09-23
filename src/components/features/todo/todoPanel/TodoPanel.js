import { createTodoListContainer } from './todoListContainer.js';

export function createTodoPanel() {
  const fragment = document.createDocumentFragment();

  const todoLayer = document.createElement('div');
  todoLayer.className = 'todo-layer';
  todoLayer.setAttribute('aria-hidden', 'true');

  const todoPanel = document.createElement('section');
  todoPanel.className = 'todo-panel';
  todoPanel.setAttribute('role', 'dialog');
  todoPanel.setAttribute('aria-labelledby', 'todo-panel-title');
  todoPanel.setAttribute('data-testid', 'todo-panel');

  const panelHeader = createTodoPanelHeader();
  todoPanel.appendChild(panelHeader.mainComponent);

  const listsHeader = createTodoListsHeader();
  todoPanel.appendChild(listsHeader.mainComponent);

  const listContainer = createTodoListContainer();
  todoPanel.appendChild(listContainer.mainComponent);

  fragment.appendChild(todoLayer);
  fragment.appendChild(todoPanel);

  return {
    fragment,
    internalDomElements: {
      todoLayer,
      createList: todoPanel,
      newToDoBtn: listsHeader.internalDomElements.newToDoBtn,
      closeToDo: panelHeader.internalDomElements.closeToDo,
      ...listContainer.internalDomElements,
    },
  };
}

function createTodoPanelHeader() {
  const todoHeader = document.createElement('div');
  todoHeader.className = 'todo-header';

  const title = document.createElement('h2');
  title.id = 'todo-panel-title';
  title.className = 'title-main-todo';
  title.textContent = 'To-do List';

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'close-todo-btn';
  closeButton.setAttribute('aria-label', 'Chiudi To-do List');
  closeButton.setAttribute('data-testid', 'todo-close-button');
  closeButton.textContent = '✕';

  todoHeader.appendChild(title);
  todoHeader.appendChild(closeButton);

  return {
    mainComponent: todoHeader,
    internalDomElements: { closeToDo: closeButton },
  };
}

function createTodoListsHeader() {
  const myListRow = document.createElement('div');
  myListRow.className = 'my-list-row';

  const myListText = document.createElement('p');
  myListText.className = 'my-list-text';
  myListText.textContent = 'My Lists';

  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'my-list-buttons-container';

  const newListButton = document.createElement('button');
  newListButton.type = 'button';
  newListButton.className = 'new-list';
  newListButton.setAttribute('data-testid', 'todo-new-list-button');
  newListButton.textContent = 'New';

  buttonsContainer.appendChild(newListButton);
  myListRow.appendChild(myListText);
  myListRow.appendChild(buttonsContainer);

  const underline = document.createElement('div');
  underline.className = 'underline';

  const fragment = document.createDocumentFragment();
  fragment.appendChild(myListRow);
  fragment.appendChild(underline);

  return {
    mainComponent: fragment,
    internalDomElements: { newToDoBtn: newListButton },
  };
}

export default createTodoPanel;