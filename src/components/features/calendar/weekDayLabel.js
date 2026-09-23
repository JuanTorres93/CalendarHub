import { createDayLabel } from "./dayLabel.js";
import { createTodoContainer } from "./todoContainer.js";
import { calendarLogic } from "../../../calendarLogic.js";
import { calendarPresenter } from "../../../calendarPresenter.js";

export function createWeekDayLabel({ date }) {
  const weekDayLabel = document.createElement("div");
  weekDayLabel.className = "week-day-display";
  weekDayLabel.dataset.day = date.format("YYYY-MM-DD");

  const headerButton = createDayLabel({ type: "week", date });

  headerButton.addEventListener("click", (e) => {
    e.stopPropagation();
    calendarLogic.setDate(date);
    calendarPresenter.render();
  });

  weekDayLabel.appendChild(headerButton);

  const headerContent = document.createElement("div");
  headerContent.className = "week-header-content";

  const allDayContainer = document.createElement("div");
  allDayContainer.className = "week-all-day-container";
  headerContent.appendChild(allDayContainer);

  headerContent.appendChild(createTodoContainer({ type: "week" }));

  weekDayLabel.appendChild(headerContent);

  return {
    mainComponent: weekDayLabel,
    internalDomElements: { allDayContainer },
  };
}
