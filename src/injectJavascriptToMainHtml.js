// TODO delete when refactor is complete
import "./calendarGridsBootstrap.js";
import { eventModalDomElements } from "./eventModalBootstrap.js";
import { miniCalendarDomElements } from "./miniCalendarBootstrap.js";
import { loaderDomElements } from "./loaderAndThemeBootstrap.js";
import { todoPanelDomElements } from "./todoPanelBootstrap.js";

import { initNavbar } from "./navbar.js";
import initCalendar from "./calendarSync.js";
import { initTutorial } from "./tutorial.js";
import { wireEventFormToEventLogic } from "./eventCreation/eventLogic.js";
import { initOptionsBanner } from "./eventCreation/infoBanner.js";
import { appready } from "./utils/loader/loader.js";
import {
  initiMiniCalendarInputs,
  wireEventFormElementsToMiniCalendar,
  wireMiniCalendarDomElements,
} from "./miniCalendar/miniCalendarLogic.js";
import { initToDobinds, wireTodoPanelToTodoLogic } from "./to-do-list/toDo.js";
import { initNotifications } from "./utils/notifications/createNotifications.js";

export function injectJavascriptToMainHtml() {
  initCalendar();
  initNavbar();
  initOptionsBanner(eventModalDomElements, miniCalendarDomElements);
  initTutorial();
  wireEventFormToEventLogic(eventModalDomElements);
  wireEventFormElementsToMiniCalendar(eventModalDomElements);
  wireMiniCalendarDomElements(miniCalendarDomElements);
  wireTodoPanelToTodoLogic(todoPanelDomElements);
  initiMiniCalendarInputs();
  initToDobinds();

  appready(loaderDomElements.loader);
  initNotifications();
}