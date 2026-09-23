export function createThemeLayers() {
  const fragment = document.createDocumentFragment();

  const prevThemeImage = document.createElement('div');
  prevThemeImage.id = 'prev-layer';
  prevThemeImage.setAttribute('aria-hidden', 'true');

  const nextThemeImage = document.createElement('div');
  nextThemeImage.id = 'next-layer';
  nextThemeImage.setAttribute('aria-hidden', 'true');

  fragment.appendChild(prevThemeImage);
  fragment.appendChild(nextThemeImage);

  return {
    fragment,
    internalDomElements: { prevThemeImage, nextThemeImage },
  };
}

export default createThemeLayers;