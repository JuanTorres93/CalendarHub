// TODO delete when refactor is complete
import "./components/componentInjector.js";
import { eventModalDomElements } from "./eventModalBootstrap.js";

import { initNavbar } from "./navbar.js";
import initCalendar from "./calendarSync.js";
import { initTutorial } from "./tutorial.js";
import { wireEventFormToEventLogic } from "./eventCreation/eventLogic.js";
import { initOptionsBanner } from "./eventCreation/infoBanner.js";
import { appready } from "./utils/loader/loader.js";
import { initiMiniCalendarInputs, wireEventFormElementsToMiniCalendar } from "./miniCalendar/miniCalendar.js";
import { initToDobinds } from "./to-do-list/toDo.js";
import { initNotifications } from "./utils/notifications/createNotifications.js";

export function injectJavascriptToMainHtml() {
  initCalendar();
  initNavbar();
  initOptionsBanner(eventModalDomElements);
  initTutorial();
  wireEventFormToEventLogic(eventModalDomElements);
  wireEventFormElementsToMiniCalendar(eventModalDomElements);
  initiMiniCalendarInputs();
  initToDobinds();

  appready();
  initNotifications();
}