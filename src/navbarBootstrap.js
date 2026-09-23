import { createNavbar } from './components/navbar/Navbar.js';

const { mainComponent, internalDomElements, renderDisplays } = createNavbar();
document.body.appendChild(mainComponent);

export const navbarDomElements = internalDomElements;
export const navbarRenderDisplays = renderDisplays;