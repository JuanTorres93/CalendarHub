export function createTodoBadge({ count, dataDay }) {
  const badge = document.createElement('button');
  badge.className = 'todo-btn-header';
  badge.type = 'button';
  badge.setAttribute('data-testid', `todo-badge-${dataDay}`);

  const countSpan = document.createElement('span');
  countSpan.classList.add('todo-count');
  countSpan.textContent = count;

  const icon = document.createElement('span');
  icon.classList.add('todo-icon');
  icon.textContent = '📜';

  badge.appendChild(countSpan);
  badge.appendChild(icon);

  return badge;
}