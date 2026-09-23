import { createMiniCalendar } from './components/features/miniCalendar/MiniCalendar.js';

const { fragment, internalDomElements, renderContent } = createMiniCalendar();
document.body.appendChild(fragment);

export const miniCalendarDomElements = {
  ...internalDomElements,
  renderContent,
};