import {
   notificationPermissionBtn,
   actionBtns,
   notificationIconOff,
   notificationIconOn
   } from "../helpers/dom/mainCalendarDom.js";

import {
    requestNotificationPermission,
     startNotificationScheduler,
     stopNotificationScheduler,
} from "./notificationManager.js"

import { createMessage } from "../helpers/createElement.js";

import {
    getNotificationEnabled,
    saveNotificationEnabled
} from "./notificationPreferencesStorage.js"

let notificationsEnabled = false;

async function enableNotifications() {
    const permission = await requestNotificationPermission();

    if(permission !== "granted") {
        notificationsEnabled = false;
        saveNotificationEnabled(false)
        stopNotificationScheduler();
        updateNotificationToggle();

        return permission
    }

    const hasBeenSaved = saveNotificationEnabled(true);

    if (!hasBeenSaved){
        return "storage-error"
    }

    notificationsEnabled = true;
    startNotificationScheduler();
    updateNotificationToggle();

    return "granted"
}

function disableNotifications() {
    const hasBeenSaved = saveNotificationEnabled(false)

    if (!hasBeenSaved){
        return false;
    }

    notificationsEnabled = false;
    stopNotificationScheduler();
    updateNotificationToggle();

    return true
}

function restoreNotifications(){
    notificationsEnabled = getNotificationEnabled()

    if(!notificationsEnabled) {
    updateNotificationToggle();    
        return
    }

    const canStart = 
    "Notification" in window &&
    window.isSecureContext &&
    Notification.permission === "granted";

    if (!canStart) {
    notificationsEnabled = false;
    saveNotificationsEnabled(false);
    updateNotificationToggle();
    return;
  }

  startNotificationScheduler();
  updateNotificationToggle();
}

async function handleNotificationToggle() {
  if (notificationsEnabled) {
    const hasBeenDisabled = disableNotifications();

    if (hasBeenDisabled) {
      createMessage(
        "Le notifiche sono state disattivate.",
        actionBtns,
        document.body
      );
    } else {
      createMessage(
        "Non è stato possibile salvare la preferenza delle notifiche.",
        actionBtns,
        document.body
      );
    }

    return;
  }

  const permission = await enableNotifications();

  if (permission === "granted") {
    createMessage(
      "Le notifiche sono state attivate.",
      actionBtns,
      document.body
    );

    return;
  }

  if (permission === "denied") {
    createMessage(
      "Le notifiche sono bloccate nelle impostazioni del browser.",
      actionBtns,
      document.body
    );

    return;
  }

  if (permission === "default") {
    createMessage(
      "Il permesso per le notifiche non è stato concesso.",
      actionBtns,
      document.body
    );

    return;
  }

  if (permission === "unsupported") {
    createMessage(
      "Questo browser non supporta le notifiche native.",
      actionBtns,
      document.body
    );

    return;
  }

  if (permission === "insecure") {
    createMessage(
      "Le notifiche richiedono una connessione sicura.",
      actionBtns,
      document.body
    );

    return;
  }

  if (permission === "storage-error") {
    createMessage(
      "Non è stato possibile salvare la preferenza delle notifiche.",
      actionBtns,
      document.body
    );

    return;
  }

  createMessage(
    "Non è stato possibile attivare le notifiche.",
    actionBtns,
    document.body
  );
}

function updateNotificationToggle(){
  const notificationsAreActive =
  notificationsEnabled &&
  "Notification" in window &&
  Notification.permission === "granted";

  notificationIconOff.classList.toggle(
    "notification-icon-hidden",
    notificationsAreActive
  );

  notificationIconOn.classList.toggle(
    "notification-icon-hidden",
    !notificationsAreActive
  );


  notificationPermissionBtn.setAttribute(
    "aria-pressed",
    String(notificationsAreActive)
  );

  notificationPermissionBtn.setAttribute(
    "aria-label",
    notificationsAreActive
      ? "Disattiva notifiche"
      : "Attiva notifiche"
  );
}

export function initNotifications() {
  restoreNotifications();

  notificationPermissionBtn.addEventListener(
    "click",
    handleNotificationToggle
  );
}