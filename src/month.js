import dayjs from "./day.js";

function createMonthGrid(currentView, gridType, gridConfig) {
  const giorniMese = currentView.daysInMonth();
  const primoGiorno = currentView.date(1);
  const firstDayIndex = currentView.startOf("month").weekday();
  const ultimoGiorno = currentView.endOf("month");
  const lastDayPrevMonth = primoGiorno.subtract(1, "day");
  const firstDayNextMonth = ultimoGiorno.add(1, "day");

  gridType.innerHTML = "";

  const firstRow = document.createElement("div");
  firstRow.classList.add("day-grid");
  gridType.appendChild(firstRow);

  for (let j = 0; j < 7; j++) {
    let days = currentView.weekday(j).format("dddd");

    firstRow.insertAdjacentHTML(
      "beforeend",
      `
        <div class="${gridConfig.dailybox}">${days}</div>
        `,
    );
  }
  const secondRow = document.createElement("article");
  secondRow.classList.add(`${gridConfig.boxesContainer}`);
  gridType.appendChild(secondRow);
  for (let i = 0; i < 42; i++) {
    let dataDayID, dayNumber, dayClass, today;
    if (i < firstDayIndex) {
      dayNumber = lastDayPrevMonth.date() - (firstDayIndex - 1 - i);
      dataDayID = lastDayPrevMonth.date(dayNumber).format("YYYY-MM-DD");
      dayClass = `${gridConfig.colorOffset}`;
    } else if (i >= giorniMese + firstDayIndex) {
      dayNumber = i - (firstDayIndex + giorniMese - 1);
      dataDayID = firstDayNextMonth.date(dayNumber).format("YYYY-MM-DD");
      dayClass = `${gridConfig.colorOffset}`;
    } else {
      dayNumber = i - firstDayIndex + 1;
      dataDayID = primoGiorno.date(dayNumber).format("YYYY-MM-DD");
      if (dataDayID === currentView.format("YYYY-MM-DD")) {
        dayClass = `${gridConfig.today} ${gridConfig.colorBox}`;
      } else {
        dayClass = `${gridConfig.colorBox}`;
      }
    }

    const accessibleDate = dayjs(dataDayID).format("D MMMM YYYY");

    secondRow.insertAdjacentHTML(
      "beforeend",
      `
        <div 
            class="${gridConfig.boxGrid} ${dayClass}"
            data-action="create-event"
            data-day="${dataDayID}"
            data-testid="day-box-${dataDayID}"
            >
          <div class="${gridConfig.firstRowMonth}">
            <div class="${gridConfig.insideBoxGrid}">
                <button
                    type="button"
                    class="${gridConfig.numberBox}"
                    data-day="${dataDayID}"
                    data-action="select-date"
                    aria-label="Seleziona ${accessibleDate}"
                    data-testid="day-number-button-${dataDayID}"
                    >
                    ${dayNumber}
                </button>
            </div>
            <div class="${gridConfig.todoContainer}">
            </div>
          
          </div>
         ${
           gridConfig.eventsContainer
             ? `
            <div class="${gridConfig.eventAllDay}"></div>
            <div class="${gridConfig.eventsContainer}"></div>`
             : ""
         }
        </div>
        `,
    );
  }
}

export default createMonthGrid;
