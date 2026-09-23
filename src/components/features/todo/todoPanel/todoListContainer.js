export function createTodoListContainer() {
  const todoContainer = document.createElement('section');
  todoContainer.setAttribute('data-id', 'list-id');
  todoContainer.className = 'to-do-container';

  const todoTitle = createTodoListTitle();
  todoContainer.appendChild(todoTitle.mainComponent);

  const progressSection = document.createElement('section');

  const progress = document.createElement('p');
  progress.className = 'todo-progress';
  progress.setAttribute('role', 'status');
  progress.setAttribute('aria-live', 'polite');
  progress.textContent = 'Nessuna Attività';

  progressSection.appendChild(progress);
  todoContainer.appendChild(progressSection);

  const itemsContainer = document.createElement('div');
  itemsContainer.className = 'todo-items-container';
  itemsContainer.setAttribute('data-testid', 'todo-items-container');
  todoContainer.appendChild(itemsContainer);

  const addTodoRow = createAddTodoRow();
  todoContainer.appendChild(addTodoRow.mainComponent);

  return {
    mainComponent: todoContainer,
    internalDomElements: {
      toDoHeader: todoTitle.internalDomElements.toDoTitle,
      headerDate: todoTitle.internalDomElements.headerDate,
      headerTitle: todoTitle.internalDomElements.headerTitle,
      deleteList: todoTitle.internalDomElements.deleteList,
      toDoItemsContainer: itemsContainer,
      addNewItemContainer: addTodoRow.internalDomElements.addTodoRow,
      itemInput: addTodoRow.internalDomElements.itemInput,
      addItemBtn: addTodoRow.internalDomElements.addItemBtn,
      toDoProgress: progress,
    },
  };
}

function createTodoListTitle() {
  const todoTitle = document.createElement('header');
  todoTitle.className = 'to-do-title';

  const date = document.createElement('p');
  date.setAttribute('data-day', '2025-10-11');
  date.className = 'date-to-do';
  date.setAttribute('data-testid', 'todo-header-date');
  date.textContent = '10-11';

  const titleInput = document.createElement('input');
  titleInput.className = 'todo-input-title';
  titleInput.setAttribute('placeholder', 'inserisci un titolo');
  titleInput.type = 'text';
  titleInput.setAttribute('aria-label', 'Titolo della lista');
  titleInput.setAttribute('data-testid', 'todo-title-input');

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete-list-btn';
  deleteButton.setAttribute('aria-label', 'Elimina lista');
  deleteButton.setAttribute('data-testid', 'todo-delete-list-button');

  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.classList.add('todo-delete-icon');

  const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path1.setAttribute('d', 'M3 6h18');
  const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path2.setAttribute('d', 'M8 6V4h8v2');
  const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path3.setAttribute('d', 'M6 6l1 15h10l1-15');
  const path4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path4.setAttribute('d', 'M10 11v6');
  const path5 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path5.setAttribute('d', 'M14 11v6');

  icon.append(path1, path2, path3, path4, path5);
  deleteButton.appendChild(icon);

  todoTitle.appendChild(date);
  todoTitle.appendChild(titleInput);
  todoTitle.appendChild(deleteButton);

  return {
    mainComponent: todoTitle,
    internalDomElements: {
      toDoTitle: todoTitle,
      headerDate: date,
      headerTitle: titleInput,
      deleteList: deleteButton,
    },
  };
}

function createAddTodoRow() {
  const addTodoRow = document.createElement('div');
  addTodoRow.className = 'add-todo-row';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'todo-input';
  input.setAttribute('placeholder', 'Nuova attività...');
  input.setAttribute('aria-label', 'Nuova attività');
  input.setAttribute('data-testid', 'todo-item-input');

  const addButton = document.createElement('button');
  addButton.type = 'button';
  addButton.className = 'add-todo-btn';
  addButton.setAttribute('aria-label', 'Aggiungi attività');
  addButton.setAttribute('data-testid', 'todo-add-item-button');
  addButton.textContent = '+';

  addTodoRow.appendChild(input);
  addTodoRow.appendChild(addButton);

  return {
    mainComponent: addTodoRow,
    internalDomElements: { addTodoRow, itemInput: input, addItemBtn: addButton },
  };
}