export default function createTodoListButton() {
  const button = document.createElement('button');

  button.className = 'new-btn inside-nav';
  button.type = 'button';
  button.setAttribute('aria-label', 'Crea nuova Todo-list');
  button.setAttribute('data-testid', 'new-todo-button');

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('width', '24');
  svg.setAttribute('height', '24');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', '#000000');
  svg.setAttribute('stroke-width', '2.75');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('class', 'lucide lucide-circle-plus-icon lucide-circle-plus');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', '12');
  circle.setAttribute('cy', '12');
  circle.setAttribute('r', '10');
  svg.appendChild(circle);

  const pathHorizontal = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathHorizontal.setAttribute('d', 'M8 12h8');
  svg.appendChild(pathHorizontal);

  const pathVertical = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathVertical.setAttribute('d', 'M12 8v8');
  svg.appendChild(pathVertical);

  button.appendChild(svg);

  return button;
}