import createMonthGrid from "./month.js";
import createWeekGrid from "./week.js";
import createDailyGrid from "./daily.js";

import dayjs from "./day.js";
import { config } from "./utils/config/config.js";
import { handleOpenCreate } from "./eventCreation/eventLogic.js";
import { theme } from "./utils/theme.js";
import { renderEvents} from "./utils/events/eventRendering.js";
import { renderExtraInfo } from "./eventCreation/infoBanner.js";
import { initRenderBadge } from "./to-do-list/toDoBadgeRendering.js";
import { openContextualMenu, closeContextualMenu } from "./to-do-list/todoBadgeActions.js";
import { getSelectedTodo } from "./to-do-list/toDo.js";

import {
    monthGrid, 
    weekGrid, 
    dayGrid,
    currentMonthDisplay,
    currentYearDisplay,
    currentWeekDisplay,
    currentDailyDisplay,
    leftArrowMonth,
    leftArrowWeek,
    leftArrowDay,
    rightArrowDay,
    rightArrowWeek,
    rightArrowMonth

} from "./utils/helpers/dom/mainCalendarDom.js"

 class CalendarLogic {
    constructor () {
        this.date = dayjs();
        this.currentMonth = this.date.month() +1;
        this.currentWeek = this.date.isoWeek();
        this.firstOfWeek = this.date.weekday(1);
        this.year = this.date.year();
        this.showedMonth = this.currentMonth - 1;  
        this.dayOfYear = this.date.dayOfYear() ;    
    }
  
    setDate(newDate){
        this.date = newDate
        this.syncAll()
    };
    updateOverlayDisplay(){
        const displayMonth = this.date.month(this.date.month()).format("MMMM");
        const monday = this.date.weekday(0).format("DD MMMM");
        const sunday = this.date.weekday(6).format("DD MMMM");
        const showDailyDate = this.date.format("DD MMMM");
        const year = this.date.year();
        
        currentMonthDisplay.textContent = displayMonth;
        currentWeekDisplay.textContent = `${monday} - ${sunday}`;
        currentDailyDisplay.textContent = showDailyDate;
        currentYearDisplay.textContent = year;
    }
    syncAll(){
        createMonthGrid(this.date, monthGrid, config.main);
        createWeekGrid(this.date);
        createDailyGrid(this.date);
        this.updateOverlayDisplay();
        this.highLightDayinMonth()
        this.highLightDay()
        theme(this.date)
        renderEvents()
        initRenderBadge()
    }
    nextMonth(){
        this.showedMonth++;
        this.date = this.date.add(1, "month");
        if(this.showedMonth > 12){
            this.showedMonth= 1;
            this.year++;
        }
    }
    prevMonth(){
        this.showedMonth--;
        this.date = this.date.subtract(1, "month");
        if (this.showedMonth < 1){
            this.showedMonth = 12;
            this.year--;
       }
    }
    prevWeek(){
        this.date = this.date.subtract(1, "week");
        this.currentWeek--; 
        if(this.currentWeek < 1){
            this.year--;
        }
    }
    nextWeek(){
        this.date = this.date.add(1, "week");
        this.currentWeek++; 
        if(this.currentWeek > 52){
            this.year++;
        }
    }
    prevDay(){
        this.date = this.date.subtract(1, "day");
        this.dayOfYear--;
        if(this.dayOfYear < 1){
            this.dayOfYear = 365;
            this.year--;
        }
    }
    nextDay(){
        this.date = this.date.add(1, "day");
        this.dayOfYear++;
        if(this.dayOfYear > 365){
            this.dayOfYear = 1;
            this.year++;
        }
    }


    highLightDayinMonth(){
        const highLight = document.querySelectorAll(".box-grid")
        highLight.forEach((box)=> {
            if(box.dataset.day === this.date.format("YYYY-MM-DD")){
                box.classList.add("selected")
            }
        })
    }

    highLightDay(){
        const highLight = document.querySelectorAll(".day-name");

       highLight.forEach((day)=>{
        day.classList.remove("is-today")
        if(day.dataset.day === this.date.format("YYYY-MM-DD")){
            day.classList.remove("normal-week")
            day.classList.add("is-today")
        }else{
            day.classList.remove("is-today")
            day.classList.add("normal-week")
        }
        
       })
    }
}
export const overlay = new CalendarLogic


function highlightDayMonth(button) {
    const selectedDate = button.dataset.day;
    if (!selectedDate) return;
    overlay.setDate(dayjs(selectedDate));
}

function handleMonthGridClick(e){
    const eventElement = e.target.closest(".monthly-event");
    if (eventElement) {
        e.stopPropagation();
        renderExtraInfo(eventElement, e)
        return;
    }

    const selectedBtn = e.target.closest('[data-action="select-date"]')
    const cell = e.target.closest('[data-action="create-event"]')
    const todo = e.target.closest('.todo-btn-header')
    const itemContextualMenu = e.target.closest('[data-action="rehydrate-todo"]')
    const  selectBtnAndTodoContainer = e.target.closest(".fist-row-month")
    const badgeContainer = e.target.closest(".todo-container-month")

    if(itemContextualMenu){
        e.stopPropagation()
        getSelectedTodo(itemContextualMenu.dataset.id)
        closeContextualMenu(monthGrid)
        return
    }
 
    if(selectedBtn){
        e.stopPropagation()
        highlightDayMonth(selectedBtn)
        return
    }
      if(todo){
        e.stopPropagation()
        openContextualMenu(cell.dataset.day, badgeContainer, monthGrid, cell)
        return
    }
  
    if(selectBtnAndTodoContainer){
        e.stopPropagation()
        return
    }
    if(cell){
        e.stopPropagation()
        handleOpenCreate(e)
        return
    }

}

function highLightWeek(e){
 let highLight = e.target.parentElement.dataset.day
    overlay.setDate(dayjs(highLight))
}
function OpenModalWeek (e){
    const selecthour = document.querySelectorAll(".week-box");
    const selectHalfhour = document.querySelectorAll(".week-half-box")

        selecthour.forEach( cell => cell.classList.remove("selected-week"));
        selectHalfhour.forEach( cell => cell.classList.remove("selected-week"));
    
    const box = e.target.closest(".week-box, .week-half-box");
        if (!box) return;

 
   handleOpenCreate(e)
}

function handleClickWeek(e){
    const eventElement = e.target.closest(".weekly-event,.week-allDay-event")
    const todo = e.target.closest(".todo-btn-header")
    const header = e.target.closest(".week-day-display")
    const itemContextualMenu = e.target.closest('[data-action="rehydrate-todo"]')
    const badgeContainer = e.target.closest(".week-todo-container")
    if(itemContextualMenu){
        e.stopPropagation()
        getSelectedTodo(itemContextualMenu.dataset.id)
        closeContextualMenu(weekGrid)
        return
    }
    if(eventElement){
         e.stopPropagation()
        renderExtraInfo(eventElement, e)
        return
    }
    if(todo){
        e.stopPropagation()
        openContextualMenu(header.dataset.day, badgeContainer, weekGrid)
        return
    }
    if(e.target.classList.contains("week-box") || e.target.classList.contains("week-half-box" )){
        OpenModalWeek(e)
    } 
    if(e.target.classList.contains("header-btn")){
        highLightWeek(e)
    }
}
  
//click sul giorno
//refactor futuro, impostare l'intera logica sul closest per l'highlight, e se decido di tenere il singolo click; altrimenti in caso di drag per scelta multipla di orari il sistema di closest non funzionorebbe più, perchè dovrei fare riferimento al data-time storato all'interno di ogni elemento "li"
function handleDailyClick (e){
const selectHour = document.querySelectorAll(".day-box");
    const selectHalfhour = document.querySelectorAll(".day-half-box");
    const eventElement = e.target.closest(".daily-event, .daily-allDay-event")
    const badgeContainer = e.target.closest(".daily-todo-container")
    const todo = e.target.closest(".todo-btn-header")
    const header = e.target.closest(".daily-header")
    const itemContextualMenu = e.target.closest('[data-action="rehydrate-todo"]')
     if(itemContextualMenu){
        e.stopPropagation()
        getSelectedTodo(itemContextualMenu.dataset.id)
        closeContextualMenu(dayGrid)
        return
    }
    if(todo){
        e.stopPropagation()
        openContextualMenu(header.dataset.day, badgeContainer, dayGrid)
        return
    }
    if(eventElement){
        e.stopPropagation()
        renderExtraInfo(eventElement, e)
        return
    }

    selectHour.forEach( cell => cell.classList.remove("selected-time"))
    selectHalfhour.forEach( cell => cell.classList.remove("selected-time"))

    const box = e.target.closest(".day-box, .day-half-box");
        if (!box) return;

    if( e.target.classList.contains("day-box")) {
        e.target.nextElementSibling.classList.add("selected-time")   
    } else if (e.target.classList.contains("day-half-box")){
        e.target.previousElementSibling.classList.add("selected-time")
    }
        e.target.classList.add("selected-time");
    if( e.target.closest(".day-box, .day-half-box")){
       handleOpenCreate(e)
    }
};



function bindCalendarEvents(){
    rightArrowMonth.addEventListener("click", () => {
        overlay.nextMonth();
        overlay.syncAll()
    })
    leftArrowMonth.addEventListener("click", () =>{
        overlay.prevMonth();
        overlay.syncAll()
    })
    leftArrowWeek.addEventListener("click", () => {
        overlay.prevWeek();
        overlay.syncAll()
    })
    rightArrowWeek.addEventListener("click", () => {
        overlay.nextWeek();
        overlay.syncAll()
    })
    leftArrowDay.addEventListener("click", () => {
        overlay.prevDay();
        overlay.syncAll()
    })  
    rightArrowDay.addEventListener("click", () =>{
        overlay.nextDay();
        overlay.syncAll()
    })
    monthGrid.addEventListener("click", handleMonthGridClick)
    weekGrid.addEventListener("click", handleClickWeek )
    dayGrid.addEventListener("click", handleDailyClick)
}

export default function initCalendar(){
    bindCalendarEvents()
    overlay.syncAll()
}
