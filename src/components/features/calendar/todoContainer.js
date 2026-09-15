export function createTodoContainer({ type = 'month', isMini = false }) {
  const config = todoContainerConfigs[type];

  const todoContainer = document.createElement('div');
  todoContainer.className = isMini ? config.mini : config.base;

  return todoContainer;
}

const todoContainerConfigs = {
  month: { base: 'todo-container-month', mini: 'mini-todo-container-month' },
  week: { base: 'week-todo-container' },
  day: { base: 'daily-todo-container' },
};
