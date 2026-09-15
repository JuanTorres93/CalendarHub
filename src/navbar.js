import dayjs from "./day.js";
import { isNow } from "./utils/isNow.js";
import { openMiniCalendar } from "./miniCalendar/miniCalendar.js";
import { overlay } from "./calendarSync.js";
import { openTodo } from "./to-do-list/toDo.js";
import { resetTutorial } from "./tutorial.js";
import {
  renderDailyEvents,
  renderWeeklyEvents,
  getAllRenderableEvents,
} from "./utils/events/eventRendering.js";
import {
  monthBtn,
  weekBtn,
  dayBtn,
  monthView,
  weekView,
  dayView,
  allOverlays,
  displayOverlays,
  displayOverlayMonth,
  resetBtn as reset,
  newTodoBtn,
  tutorialBtn,
  currentYearDisplay,
} from "./utils/helpers/dom/mainCalendarDom.js";

let currentState = 0;

function switchView(index) {
  const gridView = [monthView, weekView, dayView];
  const overlays = [...displayOverlays];
  if (currentState !== index) {
    gridView.forEach((view, i) =>
      view.classList.toggle("show-section", i === index),
    );
    overlays.forEach((ov, i) =>
      ov.classList.toggle("show-display", i === index),
    );
    currentState = index;
  }
}

function initDefaultView() {
  currentState = 0;
  monthView.classList.add("show-section");
  displayOverlayMonth.classList.add("show-display");
}

function bindNavEvents() {
  allOverlays.forEach((overlayElement) => {
    overlayElement.addEventListener("click", () => openMiniCalendar("normal"));
  });

  currentYearDisplay.addEventListener("click", (e) =>
    openMiniCalendar("normal", null, "normal", e.currentTarget),
  );

  monthBtn.addEventListener("click", () => {
    switchView(0);
  });

  weekBtn.addEventListener("click", () => {
    switchView(1);
    const allEvents = getAllRenderableEvents();
    renderWeeklyEvents(allEvents);
    isNow();
  });

  dayBtn.addEventListener("click", () => {
    switchView(2);
    const allEvents = getAllRenderableEvents();
    renderDailyEvents(allEvents);
    isNow();
  });
  reset.addEventListener("click", function () {
    overlay.setDate(dayjs());
  });
  newTodoBtn.addEventListener("click", () => {
    openTodo(overlay.date.format("YYYY-MM-DD"));
  });
  tutorialBtn.addEventListener("click", resetTutorial);
}

export function initNavbar() {
  initDefaultView();
  bindNavEvents();
}
