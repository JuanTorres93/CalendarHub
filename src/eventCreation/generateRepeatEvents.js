import { getEvents } from "../utils/events/eventStorage.js";
import dayjs from "../day.js";

export function getRepeatedEvents(){
    let arrayOfevents = [];
    const events = getEvents()

    const repeated = events.filter( event => {
        return event.repeat !== null
    })

    repeated.forEach(event => {
        if (event.repeat.type === "daily"){
            const getDates = generateDailyDates(event)
            const newEvents = createRepeatedEvents(event, getDates)
            arrayOfevents.push(...newEvents) 
        }
        if(event.repeat.type === "monthly"){
            const getDates = generateMonthlyDates(event)
            const newEvents = createRepeatedEvents(event, getDates)
            arrayOfevents.push(...newEvents)
        }
        if(event.repeat.type === "custom"){
            const getDates = generateCustomDates(event)
            const newEvents = createRepeatedEvents(event, getDates)
            arrayOfevents.push(...newEvents)
        }
        if(event.repeat.type === "weekly"){
            const getDates = generateWeeklyDates(event)
            const newEvents = createRepeatedEvents(event, getDates)
             arrayOfevents.push(...newEvents)
        }
    })
    return arrayOfevents
}
function helperGenerateDates(event, type){
        let arrayOfDates = []
        const begin = dayjs(event.date)
        const interval = event.repeat.interval
        let sameOrBefore = begin.isSameOrBefore(event.repeat.until) 
        for( let i = interval; sameOrBefore; i += interval ){
            sameOrBefore = begin.add(i, type).isSameOrBefore(event.repeat.until)
             const dates = begin.add(i, type).format("YYYY-MM-DD")
             if(!sameOrBefore) break
            const exceptions = event.repeat.exceptions
            if(exceptions.includes(dates)){
                continue
            }
             arrayOfDates.push(dates)
        }
       return arrayOfDates
}

function generateDailyDates(event){ 
  return  helperGenerateDates(event, "day")
}

function generateMonthlyDates(event){
  return helperGenerateDates(event, "month")
}

function generateWeeklyDates(event){
 let arrayOfDates = []
    const begin = dayjs(event.date)
    const interval = event.repeat.interval
    let sameOrBefore = begin.isSameOrBefore(event.repeat.until) 
 if(event.repeat.weekdays.length === 0 ){
        for( let i = interval; sameOrBefore; i += interval ){
            sameOrBefore = begin.add(i, "week").isSameOrBefore(event.repeat.until) 
             const dates = begin.add(i, "week").format("YYYY-MM-DD")
             if(!sameOrBefore) break
            const exceptions = event.repeat.exceptions
            if(exceptions.includes(dates)){
                continue
            }
             arrayOfDates.push(dates)
        }
       return arrayOfDates
 } else {
        for(let i = 0; sameOrBefore; i += interval){
            sameOrBefore = begin.add(i, "week").isSameOrBefore(event.repeat.until) 
             const dates = begin.add(i, "week")
             if(!sameOrBefore) break
             const exceptions = event.repeat.exceptions

             event.repeat.weekdays.forEach((item) => {
                const candidate = dates.day(item)
                const candidateDate = candidate.format("YYYY-MM-DD")
                  if (exceptions.includes(candidateDate)) return
               if(
                begin.isBefore(candidate) &&
                candidate.isSameOrBefore(event.repeat.until)
               ){
            
                arrayOfDates.push(candidate.format("YYYY-MM-DD"))
               }
             })
        }
        return arrayOfDates
 }

}
function generateCustomDates(event){
    let dates = [];
    const exceptions = event.repeat.exceptions
        
        event.repeat.customDates.forEach(date => {
        if(exceptions.includes(date)) return
        dates.push(date)
        })
   return dates
}

function createRepeatedEvents(baseEvent, dates){
    return dates.map(date => {
        return {
            ...baseEvent,
            id: `${baseEvent.repeat.seriesId}-${date}`,
            originalEventId: baseEvent.id,
            seriesId: baseEvent.repeat.seriesId, 
            isOccurrence: true,
            date
        }
    })
}



