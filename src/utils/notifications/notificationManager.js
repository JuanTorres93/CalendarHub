import { getAllRenderableEvents } from "../events/eventRendering.js";
import dayjs from "../../day.js";

const NOTIFICATION_CHECK_INTERVAL = 30_000;
let notificationSchedulerId = null;
let lastNotificationCheck = null;

export async function requestNotificationPermission() {
  if (!("Notification" in window)) {
    return "unsupported";
  }

  if (!window.isSecureContext) {
    return "insecure";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  if (Notification.permission === "denied") {
    return "denied";
  }

  try {
    return await Notification.requestPermission();
  } catch (error) {
    console.error("Errore durante la richiesta del permesso", error);
    return "error";
  }
}

export function showNotification(title, option = {}) {
  if (!("Notification" in window)) {
    return false;
  }

  if (Notification.permission !== "granted") {
    return false;
  }
  try {
    const notification = new Notification(title, option);

    notification.addEventListener("click", () => {
      window.focus();
      notification.close();
    });

    return true;
  } catch (error) {
    console.error("Errore durante la creazione della notifica:", error);
    return false;
  }
}

export function startNotificationScheduler() {
  if (notificationSchedulerId !== null) return;

  lastNotificationCheck = Date.now();

  notificationSchedulerId = window.setInterval(
    checkDueNotifications,
    NOTIFICATION_CHECK_INTERVAL,
  );
}

function getNotificationTimestamp(event) {
  const notificationOffeset = getNotificationOffsetMs(event.notification);

  if (notificationOffeset === null) return null;

  const eventStart = dayjs(
    `${event.date} ${event.from}`,
    "YYYY-MM-DD HH:mm",
    true,
  );

  if (!eventStart.isValid()) return null;

  const eventStartTime = eventStart.valueOf();

  return eventStartTime - notificationOffeset;
}

export function stopNotificationScheduler() {
  if (notificationSchedulerId === null) return;

  window.clearInterval(notificationSchedulerId);

  notificationSchedulerId = null;
  lastNotificationCheck = null;
}

function checkDueNotifications() {
  const currentTime = Date.now();

  if (lastNotificationCheck === null) {
    lastNotificationCheck = currentTime;
    return;
  }

  const allEvents = getAllRenderableEvents();

  const eventWithNotification = allEvents.filter(
    (events) => events.notification !== "nessuna notifica",
  );

  eventWithNotification.forEach((event) => {
    const notificationTime = getNotificationTimestamp(event);

    if (notificationTime === null) return;

    const notificationIsDue =
      notificationTime > lastNotificationCheck &&
      notificationTime <= currentTime;

    if (!notificationIsDue) return;

    showNotification(event.title, {
      body: `L'evento inizia alle ${event.from}.`,
      tag: `calendarhub-${event.id}-${event.date}-${event.from}`,
      data: {
        eventId: event.id,
        eventDate: event.date,
      },
    });
  });

  lastNotificationCheck = currentTime;
}

function getNotificationOffsetMs(notificationTime) {
  switch (notificationTime) {
    case "5 minuti prima":
      return 5 * 60 * 1000;
    case "15 minuti prima":
      return 15 * 60 * 1000;
    case "1 ora prima":
      return 60 * 60 * 1000;
    case "2 ore prima":
      return 60 * 2 * 60 * 1000;
    case "4 ore prima":
      return 60 * 4 * 60 * 1000;
    case "24 ore prima":
      return 60 * 24 * 60 * 1000;

    default:
      return null;
  }
}
