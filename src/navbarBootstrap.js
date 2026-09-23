import { createNavbar } from './components/navbar/Navbar.js';

const { mainComponent, internalDomElements, renderDisplays } = createNavbar();
document.body.insertBefore(mainComponent, document.getElementById('calendar-main'));

export const navbarDomElements = internalDomElements;
export const navbarRenderDisplays = renderDisplays;