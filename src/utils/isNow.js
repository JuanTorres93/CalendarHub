import dayjs from "../day.js";

export function nowTarget(target, type, nowType, targetTime) {
  let now, targetHour;
  if (nowType === "currentTime") {
    now = dayjs().minute(0).format("HH:mm");
  }
  if (nowType === "cellTime") {
    now = targetTime;
  }
  target.forEach((hour) => {
    if (hour.dataset.time === now) {
      if (type === "day") {
        hour.classList.add("today");
        hour.nextElementSibling.classList.add("today");
      }
      targetHour = hour;
    }
  });
  return targetHour;
}

export function isNow() {
  const selectHourDaily = document.querySelectorAll(".day-box");
  const selectHourWeek = document.querySelectorAll(".week-box");

  const weekTargetBox = document.querySelector(".week-box");
  const targetWeekDay = document.querySelector(".day-name.is-today");
  const container = document.querySelector("#full-week-view");

  const targetDay = nowTarget(selectHourDaily, "day", "currentTime");
  const targetHourWeek = nowTarget(selectHourWeek, "week", "cellTime", "08:00");

  if (targetDay) {
    targetDay.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  if (container && targetWeekDay && targetHourWeek) {
    container.scrollTo({
      left:
        targetWeekDay.closest(".week-structure").offsetLeft -
        container.clientWidth / 2 +
        weekTargetBox.clientWidth / 2,
      top: targetHourWeek.offsetTop,
      behavior: "smooth",
    });
  }
}

//nel target left e top di scrollTo, bisogna accedere al valore dei rispettivi offset, se no ritorna undefined ovviamente.
