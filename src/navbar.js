import {
  dayView,
  displayOverlayMonth,
  displayOverlays,
  monthView,
  weekView,
} from './utils/helpers/dom/mainCalendarDom.js';
import { viewSwitcher } from './utils/helpers/viewSwitcher.js';
import { initMiniCalendarDeps } from './miniCalendar/miniCalendar.js';

viewSwitcher.init({
  monthView,
  weekView,
  dayView,
  displayOverlays,
  displayOverlayMonth,
});

initMiniCalendarDeps({ displayOverlays });

export function initNavbar() {
  viewSwitcher.initDefaultView();
}
