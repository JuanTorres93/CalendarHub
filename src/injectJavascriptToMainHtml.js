import { initNavbar } from "./navbar.js";
import initCalendar from "./calendarSync.js";
import { initTutorial } from "./tutorial.js";
import { initEventModal } from "./eventCreation/eventLogic.js";
import { initOptionsBanner } from "./eventCreation/infoBanner.js";
import {  appready } from "./utils/loader/loader.js";
import { initiMiniCalendarInputs } from "./miniCalendar/miniCalendar.js";
import { initToDobinds } from "./to-do-list/toDo.js";
import { initNotifications } from "./utils/notifications/createNotifications.js";

export function injectJavascriptToMainHtml() {
  initCalendar()
  initNavbar()
  initOptionsBanner()
  initTutorial()
  initEventModal()
  initiMiniCalendarInputs()
  initToDobinds()
  appready()
  initNotifications()
}