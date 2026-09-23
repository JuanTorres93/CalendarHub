export function createLoader() {
  const loader = document.createElement('div');
  loader.className = 'loader-layer';
  loader.setAttribute('data-testid', 'loader');

  const loaderBox = document.createElement('div');
  loaderBox.className = 'loader-box';

  const text = document.createElement('p');
  text.className = 'loader-text';
  text.textContent = 'CARICAMENTO IN CORSO';

  const spinner = document.createElement('span');
  spinner.className = 'loader-spinner';
  spinner.setAttribute('aria-hidden', 'true');

  const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  icon.setAttribute('width', '50');
  icon.setAttribute('height', '50');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('fill', 'none');
  icon.setAttribute('stroke', 'currentColor');
  icon.setAttribute('stroke-width', '2');
  icon.setAttribute('stroke-linecap', 'round');
  icon.setAttribute('stroke-linejoin', 'round');
  icon.setAttribute('class', 'lucide lucide-loader-icon lucide-loader');
  icon.innerHTML =
    '<path class="active-line" d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/>';

  spinner.appendChild(icon);
  loaderBox.appendChild(text);
  loaderBox.appendChild(spinner);
  loader.appendChild(loaderBox);

  return {
    mainComponent: loader,
    internalDomElements: { loader },
  };
}

export default createLoader;