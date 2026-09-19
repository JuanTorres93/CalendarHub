import { resetTutorial } from '../../tutorial.js';

export default function createTutorialButton() {
  const button = document.createElement('button');

  button.className = 'tutorial-btn';
  button.type = 'button';
  button.setAttribute('aria-label', 'Apri tutorial');

  button.addEventListener('click', resetTutorial);

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
  svg.setAttribute(
    'class',
    'lucide lucide-circle-question-mark-icon lucide-circle-question-mark',
  );
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', '12');
  circle.setAttribute('cy', '12');
  circle.setAttribute('r', '10');
  svg.appendChild(circle);

  const pathQuestion = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathQuestion.setAttribute('d', 'M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3');
  svg.appendChild(pathQuestion);

  const pathDot = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  pathDot.setAttribute('d', 'M12 17h.01');
  svg.appendChild(pathDot);

  button.appendChild(svg);

  return button;
}