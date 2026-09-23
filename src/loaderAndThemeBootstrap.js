import { createLoader } from './components/features/loader/Loader.js';
import { createThemeLayers } from './components/features/theme/ThemeLayers.js';

const loader = createLoader();
const themeLayers = createThemeLayers();

document.body.prepend(themeLayers.fragment);
document.body.prepend(loader.mainComponent);

export const loaderDomElements = loader.internalDomElements;
export const themeLayersDomElements = themeLayers.internalDomElements;