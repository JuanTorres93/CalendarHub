import dayjs from "./day.js";
import { dayGrid } from "./utils/helpers/dom/mainCalendarDom.js";
import { createHourCell } from "./components/features/calendar/hourCell.js";
import { createTimeLabel } from "./components/features/calendar/timeLabel.js";
import { createDayLabel } from "./components/features/calendar/dayLabel.js";
import { createTodoContainer } from "./components/features/calendar/todoContainer.js";

function createDailyGrid(currentview) {
  dayGrid.innerHTML = "";

  const dataDay = currentview.format("YYYY-MM-DD");

  const dailyHeader = document.createElement("div");
  dailyHeader.className = "daily-header";
  dailyHeader.dataset.day = dataDay;

  dailyHeader.appendChild(createDayLabel({ type: "day", date: currentview }));

  const allDayContainer = document.createElement("div");
  allDayContainer.className = "daily-allDay-container";

  dailyHeader.appendChild(allDayContainer);
  dailyHeader.appendChild(createTodoContainer({ type: "day" }));
  dayGrid.appendChild(dailyHeader);

  const dailyMain = document.createElement("div");
  dailyMain.className = "daily-main";

  const div = document.createElement("div");
  div.className = "ul-day-time";

  const list = document.createElement("ul");
  list.className = "day-list";

  div.appendChild(list);
  dailyMain.appendChild(div);

  for (let i = 0; i < 24; i++) {
    const time = dayjs().hour(i).minute(0).format("HH:mm");

    list.appendChild(
      createTimeLabel({
        type: "day",
        time,
      }),
    );
  }

  const dayStructure = document.createElement("div");
  dayStructure.className = "day-structure";

  dailyMain.appendChild(dayStructure);
  dayGrid.appendChild(dailyMain);

  const dailyName = document.createElement("ul");
  dailyName.className = "daily-name";
  dailyName.dataset.day = dataDay;

  dayStructure.appendChild(dailyName);

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
