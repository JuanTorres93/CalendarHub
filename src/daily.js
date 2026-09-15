import dayjs from "./day.js";
import createElement from "./utils/helpers/createElement.js";
import { dayGrid } from "./utils/helpers/dom/mainCalendarDom.js";

function createDailyGrid(currentview) {
  dayGrid.innerHTML = "";

  let dataDay = currentview.format("YYYY-MM-DD");
  const dailyDate = currentview.format("dddd, DD");
  const dailyHeader = createElement(dayGrid, "daily-header", null, "div", {
    dataset: { day: dataDay },
  });
  createElement(dailyHeader, "daily-allDay-container", null, "div");
  createElement(dailyHeader, "daily-todo-container", null, "div");
  const dailyMain = createElement(dayGrid, "daily-main", null, "div");
  const div = createElement(dailyMain, "ul-day-time", null, "div");
  const list = createElement(div, "day-list", null, "ul");
  dailyHeader.insertAdjacentHTML(
    "afterbegin",
    `
        <div class="daily-current-header">
            <h2>${dailyDate}</h2>
        </div>
        `,
  );

  for (let i = 23; i >= 0; i--) {
    let time = dayjs().hour(i).format("HH");
    time = time + ":00";

    list.insertAdjacentHTML(
      "afterbegin",
      `
          <li class="time-lable-day">
                        <div class="hour-lable-day"><span>${time}</span></div> 
                        <div class="half-lable-day"></div>
                    </li>
            `,
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

  for (let j = 23; j >= 0; j--) {
    let dataTime = currentview.hour(j);
    let hour = dataTime.minute(0).format("HH:mm");
    let halfHour = dataTime.minute(30).format("HH:mm");
    let dayClass;
    if (j === 0) {
      dayClass = "first";
    } else {
      dayClass = "";
    }
    dailyName.insertAdjacentHTML(
      "afterbegin",
      `
        
                    <li class="day-box ${dayClass}" data-time="${hour}"> 
                    </li>
                    <li class="day-half-box" data-time="${halfHour}"> 
                    </li> 
                
        `,
    );
  }
}

export default createDailyGrid;
