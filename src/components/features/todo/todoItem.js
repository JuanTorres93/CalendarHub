export function createTodoItem(todoItem) {
  const todoElement = document.createElement('article');
  todoElement.className = 'todo-item';
  todoElement.dataset.id = todoItem.id;
  todoElement.setAttribute('data-testid', `todo-item-${todoItem.id}`);

  const checkButton = document.createElement('button');
  checkButton.type = 'button';
  checkButton.className = `check-btn ${todoItem.completed ? 'checked' : ''}`;
  checkButton.setAttribute('aria-label', 'Completa attività');
  checkButton.setAttribute('data-testid', `todo-item-check-${todoItem.id}`);
  checkButton.appendChild(createCheckIcon());

  const title = document.createElement('strong');
  title.className = 'title-item';
  title.textContent = todoItem.title;

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete-item-todo-btn show-delete';
  deleteButton.setAttribute('aria-label', 'Elimina attività');
  deleteButton.setAttribute('data-testid', `todo-item-delete-${todoItem.id}`);
  deleteButton.appendChild(createDeleteIcon());

  todoElement.appendChild(checkButton);
  todoElement.appendChild(title);
  todoElement.appendChild(deleteButton);

  return todoElement;
}

function createCheckIcon() {
  const icon = createSvg('todo-check-icon');

  const rect = document.createElementNS(SVG_NAMESPACE, 'rect');
  rect.setAttribute('x', '3');
  rect.setAttribute('y', '3');
  rect.setAttribute('width', '18');
  rect.setAttribute('height', '18');
  rect.setAttribute('rx', '4');

  const path = document.createElementNS(SVG_NAMESPACE, 'path');
  path.setAttribute('d', 'M7 12.5l3 3 7-7');

  icon.appendChild(rect);
  icon.appendChild(path);

  return icon;
}

function createDeleteIcon() {
  const icon = createSvg('todo-delete-icon');

  ['M3 6h18', 'M8 6V4h8v2', 'M6 6l1 15h10l1-15', 'M10 11v6', 'M14 11v6'].forEach(
    (d) => {
      const path = document.createElementNS(SVG_NAMESPACE, 'path');
      path.setAttribute('d', d);
      icon.appendChild(path);
    },
  );

  return icon;
}

const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

function createSvg(className) {
  const icon = document.createElementNS(SVG_NAMESPACE, 'svg');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.classList.add(className);

  return icon;
}