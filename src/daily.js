import dayjs from "./day.js";
import createElement from "./utils/helpers/createElement.js";
import { dayGrid } from "./utils/helpers/dom/mainCalendarDom.js";
import { createHourCell } from "./components/features/calendar/hourCell.js";
import { createTimeLabel } from "./components/features/calendar/timeLabel.js";
import { createDayLabel } from "./components/features/calendar/dayLabel.js";
import { createTodoContainer } from "./components/features/calendar/todoContainer.js";

function createDailyGrid(currentview) {
  dayGrid.innerHTML = "";

  let dataDay = currentview.format("YYYY-MM-DD");
  const dailyHeader = createElement(dayGrid, "daily-header", null, "div", {
    dataset: { day: dataDay },
  });
  dailyHeader.appendChild(createDayLabel({ type: "day", date: currentview }));
  createElement(dailyHeader, "daily-allDay-container", null, "div");
  dailyHeader.appendChild(createTodoContainer({ type: "day" }));

  const dailyMain = createElement(dayGrid, "daily-main", null, "div");
  const div = createElement(dailyMain, "ul-day-time", null, "div");
  const list = createElement(div, "day-list", null, "ul");

  for (let i = 0; i < 24; i++) {
    const time = dayjs().hour(i).minute(0).format("HH:mm");

    list.appendChild(
      createTimeLabel({
        type: "day",
        time,
      }),
    );
  }
  const dayStructure = createElement(dailyMain, "day-structure", null, "div");

  dayStructure.insertAdjacentHTML(
    "afterbegin",
    `
    <ul class="daily-name" data-day=${dataDay}> </ul>
    `,
  );
  const dailyName = dayStructure.querySelector(".daily-name");

  for (let j = 0; j < 24; j++) {
    const dataTime = currentview.hour(j);
    const hour = dataTime.minute(0).format("HH:mm");
    const halfHour = dataTime.minute(30).format("HH:mm");

    dailyName.appendChild(
      createHourCell({
        type: "day",
        time: hour,
        halfTime: halfHour,
        extraClasses: j === 0 ? ["first"] : [],
      }),
    );
  }
}

export default createDailyGrid;
