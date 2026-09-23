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

export function isNow({ dayHourCells, weekHourCells, todayWeekDay, weekStructure }) {
  const targetDay = nowTarget(dayHourCells, "day", "currentTime");
  const targetHourWeek = nowTarget(weekHourCells, "week", "cellTime", "08:00");

  if (targetDay) {
    targetDay.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  if (weekStructure && todayWeekDay && targetHourWeek) {
    const weekTargetBox = todayWeekDay.weekHourCells[0];

    weekStructure.scrollTo({
      left:
        todayWeekDay.dayName.closest(".week-structure").offsetLeft -
        weekStructure.clientWidth / 2 +
        weekTargetBox.clientWidth / 2,
      top: targetHourWeek.offsetTop,
      behavior: "smooth",
    });
  }
}

//nel target left e top di scrollTo, bisogna accedere al valore dei rispettivi offset, se no ritorna undefined ovviamente.