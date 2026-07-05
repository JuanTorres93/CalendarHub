import dayjs from "./day.js";
import globalDate from "./state.js";
import createElement from "./utils/helpers/createElement.js"
import { weekGrid } from "./utils/helpers/dom/mainCalendarDom.js";

let currentview = globalDate.date;

export default function createWeekGrid (currentview) {
    weekGrid.innerHTML= "";

    const div = createElement(weekGrid, "ul-week-time", null, "div")
    const list = createElement(div, "time-week", null, "ul")
    const weekWrapper = createElement( weekGrid, "week-wrapper", null, "div")
    const weekHeaderRow = createElement(weekWrapper, "week-header-row", null, "div");
    const weekDaysRow = createElement(weekWrapper, "week-days-row", null, "div");

    for ( let i = 23; i >= 0; i--){ 
        let midnight;
        let time = dayjs().hour(i).format("HH");
        time = time + ":00";

       if (i === 0) {
        midnight = "midnight";
       } else {
        midnight = "";
       };
        list.insertAdjacentHTML("afterbegin", `
                    <li class="time-lable ${midnight}">
                        <div class="hour-lable "><span>${time}</span></div> 
                        <div class="half-lable"><span></span></div>
                    </li>
                    ` )
    }; 

    for(let j = 0 ; j < 7; j++){
        let weekNumber, dayClass, firstColoumn;
        
        //  weekNumber = parseInt(monday) + j ;
        let firstDayOfWeek = currentview.weekday(j );
        let days = firstDayOfWeek.format("dddd"); 
        let dataDay = firstDayOfWeek.format("YYYY-MM-DD");
        weekNumber = firstDayOfWeek.format("DD");
        let shrinkDays = days.substring(0,3);
       
       if (dataDay === globalDate.date.format("YYYY-MM-DD")){
        dayClass = "is-today"
       } else {
        dayClass = "normal-week"
       }
     
   weekHeaderRow.insertAdjacentHTML("beforeend", `
  <div class="week-day-display" data-day="${dataDay}">
    <button type="button" class="header-btn">
      <span class="day-label">${weekNumber}</span>
      <br><br>
      <span 
        class="day-label-text"
        data-shrinkDays="${shrinkDays}"
      >
        ${days}
      </span>
    </button>
    <div class="week-header-content">
      <div class="week-all-day-container"></div>
      <div class="week-todo-container"></div>
    </div> 
  </div>
`);

weekDaysRow.insertAdjacentHTML("beforeend", `
  <div class="week-structure">
    <ul class="day-name ${dayClass}" data-day="${dataDay}"></ul>
  </div>
`);      
        };
   const dayName = document.querySelectorAll(".day-name") 

    dayName.forEach((day) => {
    for( let k=0 ; k < 24; k++) {
    let midnight, today;
    let p = 0;
    let dayOfWeek = currentview.weekday(p + 1).hour(k);
    let hour = dayOfWeek.minute(0).format("HH:mm");
    let halfHour = dayOfWeek.minute(30).format("HH:mm");
 
    day.insertAdjacentHTML("beforeend", `
        <li class="week-box" data-time="${hour}"></li>
        <li class="week-half-box" data-time="${halfHour}"></li>
        `)
};
}) 
};








