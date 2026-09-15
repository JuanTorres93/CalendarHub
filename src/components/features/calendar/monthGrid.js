import { createDayBox } from './dayBox.js';
import { config } from '../../../utils/config/config.js';

function createMonthGrid(currentView, gridType, gridConfig) {
  const giorniMese = currentView.daysInMonth();
  const primoGiorno = currentView.date(1);
  const firstDayIndex = currentView.startOf('month').weekday();
  const ultimoGiorno = currentView.endOf('month');
  const lastDayPrevMonth = primoGiorno.subtract(1, 'day');
  const firstDayNextMonth = ultimoGiorno.add(1, 'day');

  gridType.innerHTML = '';

  const firstRow = document.createElement('div');
  firstRow.classList.add('day-grid');
  gridType.appendChild(firstRow);

  for (let j = 0; j < 7; j++) {
    let days = currentView.weekday(j).format('dddd');

    firstRow.insertAdjacentHTML(
      'beforeend',
      `
        <div class="${gridConfig.dailybox}">${days}</div>
        `,
    );
  }
  const secondRow = document.createElement('article');
  secondRow.classList.add(`${gridConfig.boxesContainer}`);
  gridType.appendChild(secondRow);
  for (let i = 0; i < 42; i++) {
    let dataDayID, dayNumber, dayClass;
    if (i < firstDayIndex) {
      dayNumber = lastDayPrevMonth.date() - (firstDayIndex - 1 - i);
      dataDayID = lastDayPrevMonth.date(dayNumber).format('YYYY-MM-DD');
      dayClass = `${gridConfig.colorOffset}`;
    } else if (i >= giorniMese + firstDayIndex) {
      dayNumber = i - (firstDayIndex + giorniMese - 1);
      dataDayID = firstDayNextMonth.date(dayNumber).format('YYYY-MM-DD');
      dayClass = `${gridConfig.colorOffset}`;
    } else {
      dayNumber = i - firstDayIndex + 1;
      dataDayID = primoGiorno.date(dayNumber).format('YYYY-MM-DD');
      if (dataDayID === currentView.format('YYYY-MM-DD')) {
        dayClass = `${gridConfig.today} ${gridConfig.colorBox}`;
      } else {
        dayClass = `${gridConfig.colorBox}`;
      }
    }

    secondRow.appendChild(
      createDayBox({
        dataDayID,
        extraClasses: [gridConfig.boxGrid, dayClass],
        isMini: gridConfig === config.mini,
      }),
    );
  }
}

export default createMonthGrid;
