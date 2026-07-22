import { isValidDateString, isValidTimeString } from "../helpers/validationHelpers.js";
import {createMessage} from "../helpers/createElement.js"
import { modalEvents } from "../helpers/dom/eventModalDom.js";
 
 export function getEvents(){
   
   try{
      const storedEvents = localStorage.getItem("calendarEvents");

      if(!storedEvents)return [];

        const parsedEvents = JSON.parse(storedEvents)

        if(!Array.isArray(parsedEvents))return [];
        
    return parsedEvents.filter((event, index) => {
      const isValid = isValidEvent(event);

      if (!isValid) {
        console.warn(`Invalid event at index ${index} in localStorage`);
      }

      return isValid;
    });

    } catch(error){
        console.error("Unable to read calendar events from localStorage:", error);
        return []
        
    }
 }

 export function saveEventsInLocalStorage(events){
 
    if(!Array.isArray(events)){
      createMessage(
      "Salvataggio non riuscito: formato dei dati non valido.",
      modalEvents,
      document.body
    );
    return false;
    };

     const hasValidEvents = events.every(isValidEvent);

    if(!hasValidEvents){
      createMessage(
        "Salvataggio non riuscito: i dati degli eventi non sono validi.",
        modalEvents,
        document.body
      )
      return false
    }

    try {
       localStorage.setItem("calendarEvents", JSON.stringify(events))
       return true
    } catch (error) {
      console.error(
      "Failed to save calendar events in localStorage:",
      error
    );
    createMessage(
      "Salvataggio non riuscito. Il browser non ha potuto memorizzare gli eventi.",
      modalEvents,
      document.body
    );

    return false;
    } 
 }

 export function deleteEventFromLocalStorage(currentId){
    const events = getEvents() 
    const updatedEvents = events.filter(event => event.id !== currentId)
    
    saveEventsInLocalStorage(updatedEvents)
 }

function isValidEvent(event) {
  if (event === null || typeof event !== "object" || Array.isArray(event)) {
    return false;
  }
  const isValidDate = isValidDateString(event.date)
  const isValidTimeFrom = isValidTimeString(event.from)
  const isValidTimeTo = isValidTimeString(event.to)
  const hasValidRepeatData = isValidRepeatConfig(event.repeat)
  if (
    typeof event.id !== "string" ||
    event.id.trim() === "" ||
    typeof event.title !== "string" ||
    event.title.trim() === "" ||
    typeof event.allDay !== "boolean" ||
    typeof event.color !== "string" ||
    typeof event.description !== "string" ||
    typeof event.urgent !== "boolean" ||
    typeof event.notification !== "string" ||
    typeof event.icon !== "string" ||
    !isValidDate ||
    !isValidTimeFrom ||
    !isValidTimeTo ||
    !hasValidRepeatData
  ) {
    return false;
  }
  return true;
}



function isValidRepeatConfig(value) {
  if (value === null) return true;

  if (typeof value !== "object" || Array.isArray(value)) return false;

  const validRepeatTypes = ["daily", "weekly", "monthly", "custom"];
  const hasValidUntilDate = isValidDateString(value.until);

  if (
    typeof value.seriesId !== "string" ||
    value.seriesId.trim() === "" ||
    typeof value.type !== "string" ||
    !validRepeatTypes.includes(value.type) ||
    typeof value.interval !== "number" ||
    !Number.isInteger(value.interval) ||
    value.interval <= 0 ||
    !hasValidUntilDate ||
    !Array.isArray(value.weekdays) ||
    !Array.isArray(value.customDates) ||
    !Array.isArray(value.exceptions)
  ) {
    return false;
  }

  const hasValidWeekdays = value.weekdays.every(
    (weekday) => Number.isInteger(weekday) && weekday >= 0 && weekday <= 6,
  );
  const hasValidCustomDates = value.customDates.every(isValidDateString);
  const hasValidExceptions = value.exceptions.every(isValidDateString);

  if (
    !hasValidWeekdays ||
    !hasValidCustomDates ||
    !hasValidExceptions ||
    (value.type === "custom" && value.customDates.length === 0)
  ) {
    return false;
  }

  return true;
}