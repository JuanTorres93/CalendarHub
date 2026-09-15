import dayjs from "../../day.js";

export function isValidDateString(value) {
  if (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    dayjs(value, "YYYY-MM-DD", true).isValid()
  ) {
    return true;
  } else {
    return false;
  }
}

export function isValidTimeString(value) {
  if (typeof value === "string" && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)) {
    return true;
  } else {
    return false;
  }
}
