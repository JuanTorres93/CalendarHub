const NOTIFICATIONS_ENABLED_KEY = "notificationsEnabled";

export function saveNotificationEnabled(value) {
  if (typeof value !== "boolean") return false;

  try {
    localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, JSON.stringify(value));

    return true;
  } catch (error) {
    console.error("Impossibile salvare la preferenza delle notifiche:", error);
    return false;
  }
}

export function getNotificationEnabled() {
  try {
    const storedPreference = localStorage.getItem(NOTIFICATIONS_ENABLED_KEY);

    if (storedPreference === null) return false;

    const parsedPreference = JSON.parse(storedPreference);

    return typeof parsedPreference === "boolean" ? parsedPreference : false;
  } catch (error) {
    console.error("Impossibile leggere la preferenza delle notifiche:", error);

    return false;
  }
}
