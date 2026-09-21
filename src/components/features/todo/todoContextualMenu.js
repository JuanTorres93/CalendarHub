export function createTodoContextualMenu({ items, onItemClick }) {
  const menu = document.createElement('div');
  menu.className = 'contextual-menu';
  menu.setAttribute('data-testid', 'todo-contextual-menu');

  const list = document.createElement('ul');
  list.className = 'contextual-menu-list';
  list.setAttribute('data-testid', 'todo-contextual-menu-list');

  items.forEach((item) => {
    const menuItem = createTodoMenuItem(item);

    menuItem.addEventListener('click', (e) => {
      e.stopPropagation();
      onItemClick(item);
    });

    list.appendChild(menuItem);
  });

  menu.appendChild(list);

  return menu;
}

function createTodoMenuItem(item) {
  const menuItem = document.createElement('li');

  menuItem.dataset.id = item.id;
  menuItem.dataset.action = 'rehydrate-todo';
  menuItem.setAttribute('data-testid', `todo-menu-item-${item.id}`);
  menuItem.textContent = item.title;

  return menuItem;
}
