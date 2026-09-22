export function createCheckboxIcon() {
  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  icon.setAttribute('width', '32');
  icon.setAttribute('height', '32');
  icon.setAttribute('viewBox', '0 0 512 512');

  const checkPath = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path',
  );
  checkPath.classList.add('checkBox');
  checkPath.setAttribute('fill', 'none');
  checkPath.setAttribute('stroke', 'currentColor');
  checkPath.setAttribute('stroke-linecap', 'round');
  checkPath.setAttribute('stroke-linejoin', 'round');
  checkPath.setAttribute('stroke-width', '32');
  checkPath.setAttribute('d', 'M352 176L217.6 336L160 272');

  const checkboxRect = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'rect',
  );
  checkboxRect.classList.add('square-checkbox');
  checkboxRect.setAttribute('width', '384');
  checkboxRect.setAttribute('height', '384');
  checkboxRect.setAttribute('x', '64');
  checkboxRect.setAttribute('y', '64');
  checkboxRect.setAttribute('fill', 'none');
  checkboxRect.setAttribute('stroke', 'currentColor');
  checkboxRect.setAttribute('stroke-linejoin', 'round');
  checkboxRect.setAttribute('stroke-width', '32');
  checkboxRect.setAttribute('rx', '48');
  checkboxRect.setAttribute('ry', '48');

  icon.appendChild(checkPath);
  icon.appendChild(checkboxRect);

  return icon;
}
