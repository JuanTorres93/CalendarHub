import dayjs from "../../day.js";
import { dayOfWeekList } from "../helpers/dom/repeatModalDom.js";

const notifications = [
  {
    name: "nessuna notifica",
    value: "0",
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
    value: 1440,
  },
];

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
};
export function renderIconsList(eventModalDomElements) {
  eventModalDomElements.iconsList.innerHTML = "";
  Object.entries(eventIcons).forEach(([key, value]) => {
    const item = document.createElement("li");
    item.className = "icon-list-item";
    item.setAttribute("aria-label", `Seleziona icona ${key}`);
    item.setAttribute("data-testid", `icon-option-${key}`);
    item.textContent = value;

    eventModalDomElements.iconsList.appendChild(item);
  });
}

export function renderColorList(eventModalDomElements) {
  eventModalDomElements.colorLists.innerHTML = "";

  colors.forEach((color) => {
    const item = document.createElement("li");
    item.className = "color";
    item.dataset.color = color.value;
    item.setAttribute("aria-label", `Seleziona colore ${color.name}`);
    item.setAttribute("data-testid", `color-option-${color.value}`);
    item.innerHTML = `${color.name} <span>${color.icon}</span>`;

    eventModalDomElements.colorLists.appendChild(item);
  });
}

export function renderNotificationList(eventModalDomElements) {
  eventModalDomElements.notificationList.innerHTML = "";

  notifications.forEach((item) => {
    const option = document.createElement("li");
    option.className = "single-notification";
    option.dataset.notification = item.value;
    option.setAttribute("aria-label", `Imposta notifica: ${item.name}`);
    option.setAttribute("data-testid", `notification-option-${item.value}`);
    option.textContent = item.name;

    eventModalDomElements.notificationList.appendChild(option);
  });
}

export default function createCaroseul(eventModalDomElements) {
  const array = Array.from({ length: 24 }, (_, i) => {
    const hour = String(i).padStart(2, "0");
    return [`${hour}:00`, `${hour}:30`];
  }).flat();
  eventModalDomElements.ulContainer.forEach((ul) => {
    ul.innerHTML = "";

    array.forEach((item) => {
      const option = document.createElement("li");
      option.className = "list-item";
      option.dataset.time = item;
      option.setAttribute("aria-label", `Seleziona ore ${item}`);
      option.textContent = item;

      ul.appendChild(option);
    });
  });
}
// con dayjs().weekday(i).day() prendo l'index stabile, che non varia con il cambio formato, il che mi verrà d'aiuto per indicare i giorni della settimana ove ripetere l'evento.
export function createDayOfWeek() {
  const array = Array.from({ length: 7 }, (_, i) => {
    const days = dayjs().weekday(i).format("dddd");
    const index = dayjs().weekday(i).day();
    return {
      days: days,
      index: index,
    };
  });
  array.forEach((day) => {
    const item = document.createElement("li");
    item.className = "weekly-repetion-item";
    item.dataset.day = day.days;
    item.dataset.dayIndex = day.index;
    item.setAttribute("aria-label", `Seleziona ${day.days}`);
    item.setAttribute("data-testid", `weekly-repetion-item-${day.index}`);
    item.textContent = day.days.slice(0, 1);

    dayOfWeekList.appendChild(item);
  });
}