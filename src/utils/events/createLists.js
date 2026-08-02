import createElement from "../helpers/createElement.js";
import dayjs from "../../day.js";
import { 
    colorLists,
    ulContainer,
    notificationList,
    iconsList
 } from "../helpers/dom/eventModalDom.js";
import { dayOfWeekList } from "../helpers/dom/repeatModalDom.js";



const notifications = [
    {
        name: "nessuna notifica",
        value: "0"
    },
    {
        name: "5 minuti prima",
        value: 5,
    },
    {
        name: "15 minuti prima",
        value: 15,
    },
    {
        name: "1 ora prima",
        value: 60,
    },
    {
        name: "2 ore prima",
        value: 120,
    },
    {
        name: "4 ore prima",
        value: 240,
    },
    {
        name: "24 ore prima",
        value: 1440
    }
] 

const colors = [
  { name: "Blue", value: "blue", icon: "🟦" },
  { name: "Green", value: "green", icon: "🟩" },
  { name: "Purple", value: "purple", icon: "🟪" },
  { name: "Red", value: "red", icon: "🟥" },
    { name: "Yellow", value: "yellow", icon: "🟨" },
  { name: "Orange", value: "orange", icon: "🟧" },
  { name: "Pink", value: "pink", icon: "🩷" },
];

const eventIcons = {
    notes: "✏️",
  work: "💼",
  study: "📚",
  gym: "🏋️",
  doctor: "💉",
  food: "🍕",
  travel: "✈️",
  music: "🎵",
  gaming: "🕹️",
  meeting: "📅",
  money: "💰",
  coding: "💻",
  idea: "💡",
  shopping: "🛒",
  party: "🎉",
  warning: "‼️",
  love: "🩷",
  book: "📖",
  tree: "🌳",
  luck: "🍀",
  medicine: "💊",
  dog: "🐶",
  cat: "🐱",
}
export function renderIconsList (){
    iconsList.innerHTML = "";
    Object.entries(eventIcons).forEach(([key, value])=>{
           createElement(
            iconsList, 
            "icon-list-item",
            value,
            "li",
            {
                attributes: {
                    "aria-label": `Seleziona icona ${key}`
                }
            }
        )
    })
}

export function renderColorList(){
    colorLists.innerHTML = "";

    colors.forEach(color => {
        createElement(
            colorLists, "color",
             `${color.name} <span>${color.icon}</span>`,
              "li",
                {
                    html : true,
                    dataset : {color: color.value},
                    attributes : {"aria-label": `Seleziona colore ${color.name}`}
                }
            )
    })
}

export function renderNotificationList(){
    notificationList.innerHTML = "";

    notifications.forEach(item =>{
        createElement(
            notificationList,
            "single-notification",
            item.name,
            "li",
            {
                dataset : {notification : item.value},
                attributes : {
                    "aria-label": `Imposta notifica: ${item.name}`
                }
            }
        )
    })
}

export default function createCaroseul(){
    const array = Array.from({length: 24}, (_, i) =>{
        const hour = String(i).padStart(2, "0")
       return [
        `${hour}:00`,
        `${hour}:30`
       ]
    }).flat()
ulContainer.forEach(ul => {
    ul.innerHTML = "";

    array.forEach((item)=>{
        createElement(
            ul,
             "list-item",
              item,
               "li",
                {
                    dataset : {time: item},
                    attributes: {
                        "aria-label": `Seleziona ore ${item}`
                    }
                } 
            )
    })
})

}
// con dayjs().weekday(i).day() prendo l'index stabile, che non varia con il cambio formato, il che mi verrà d'aiuto per indicare i giorni della settimana ove ripetere l'evento.
export function createDayOfWeek(){
    const array = Array.from({length: 7}, (_, i)=>{
        const days = dayjs().weekday(i).format("dddd")
        const index = dayjs().weekday(i).day()
       return {
        days : days,
        index : index
       }
    })
    array.forEach(day =>{
        createElement(
            dayOfWeekList,
             "weekly-repetion-item",
             day.days.slice(0, 1),
             "li",
             {
                dataset : {
                    day: day.days,
                    dayIndex: day.index
                },
                attributes: {
                    "aria-label": `Seleziona ${day.days}`
                }
             }
            
            )
    })
}