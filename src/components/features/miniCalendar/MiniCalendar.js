import { initMonthList, initYearList } from '../../../miniCalendar/miniCalendarCarousels.js';
import createMonthGrid from '../calendar/monthGrid.js';

export function createMiniCalendar() {
  const fragment = document.createDocumentFragment();

  const miniCalendarLayer = document.createElement('div');
  miniCalendarLayer.className = 'mini-calendar-layer';
  miniCalendarLayer.setAttribute('aria-hidden', 'true');
  miniCalendarLayer.setAttribute('data-testid', 'mini-calendar-layer');

  const calendarContainer = document.createElement('section');
  calendarContainer.id = 'mini-calendar';
  calendarContainer.className = 'day-select';
  calendarContainer.setAttribute('role', 'dialog');
  calendarContainer.setAttribute('aria-label', 'Seleziona una data');
  calendarContainer.setAttribute('data-testid', 'mini-calendar-dialog');

  const dateInput = document.createElement('div');
  dateInput.className = 'date-input';

  const dayInput = createInput({
    className: 'input-day',
    placeholder: 'DD',
    maxLength: 2,
    ariaLabel: 'Giorno',
  });

  const daySlash = document.createElement('span');
  daySlash.className = 'slash';
  daySlash.setAttribute('aria-hidden', 'true');
  daySlash.textContent = '/';

  const monthInput = createInput({
    className: 'input-month',
    placeholder: 'MM',
    maxLength: 2,
    ariaLabel: 'Mese',
  });

  const monthSlash = document.createElement('span');
  monthSlash.className = 'slash';
  monthSlash.setAttribute('aria-hidden', 'true');
  monthSlash.textContent = '/';

  const yearInput = createInput({
    className: 'input-year',
    placeholder: 'YYYY',
    maxLength: 4,
    ariaLabel: 'Anno',
  });

  dateInput.appendChild(dayInput);
  dateInput.appendChild(daySlash);
  dateInput.appendChild(monthInput);
  dateInput.appendChild(monthSlash);
  dateInput.appendChild(yearInput);

  const miniCalendar = document.createElement('article');
  miniCalendar.className = 'mini-calendar-container';
  miniCalendar.setAttribute('data-testid', 'mini-calendar-container');

  calendarContainer.appendChild(dateInput);
  calendarContainer.appendChild(miniCalendar);

  fragment.appendChild(miniCalendarLayer);
  fragment.appendChild(calendarContainer);

  return {
    fragment,
    internalDomElements: {
      miniCalendarLayer,
      calendarContainer,
      miniCalendar,
      showModal: calendarContainer,
      yearInput,
      monthInput,
      dayInput,
    },
    renderContent: (options) => {
      miniCalendar.innerHTML = '';
      const content = createMiniCalendarContent(options);
      miniCalendar.appendChild(content.mainComponent);
    },
  };
}

export function createMiniCalendarContent({
  date,
  onDatePartSelect,
  onCancel,
  onSave,
}) {
  const miniMonth = date.month(date.month()).format('MMMM');
  const miniYear = date.year();

  const miniContainer = document.createElement('div');
  miniContainer.className = 'mini-container';

  const btnsCont = document.createElement('div');
  btnsCont.className = 'mini-btns-cont';
  miniContainer.appendChild(btnsCont);

  const monthBtn = document.createElement('button');
  monthBtn.className = 'mini-month-btn';
  monthBtn.type = 'button';
  monthBtn.setAttribute(
    'aria-label',
    `Seleziona mese. Mese corrente: ${miniMonth}`,
  );
  monthBtn.textContent = miniMonth;

  const yearBtn = document.createElement('button');
  yearBtn.className = 'mini-year-btn';
  yearBtn.type = 'button';
  yearBtn.setAttribute(
    'aria-label',
    `Seleziona anno. Anno corrente: ${miniYear}`,
  );
  yearBtn.textContent = miniYear;

  const monthList = document.createElement('div');
  monthList.className = 'month-lists';

  const yearList = document.createElement('div');
  yearList.className = 'year-lists';

  monthBtn.appendChild(monthList);
  yearBtn.appendChild(yearList);
  btnsCont.appendChild(monthBtn);
  btnsCont.appendChild(yearBtn);

  initMonthList(monthBtn, monthList, onDatePartSelect, date.month());
  initYearList(yearBtn, yearList, onDatePartSelect, date.year());

  const gridCalendar = document.createElement('div');
  gridCalendar.className = 'mini-grid';
  miniContainer.appendChild(gridCalendar);

  gridCalendar.appendChild(createMonthGrid(date, true));

  const actionsCont = document.createElement('div');
  actionsCont.className = 'mini-actions';
  miniContainer.appendChild(actionsCont);

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'mini-cancel-btn';
  cancelBtn.type = 'button';
  cancelBtn.textContent = 'Annulla';
  cancelBtn.addEventListener('click', onCancel);

  const saveBtn = document.createElement('button');
  saveBtn.className = 'mini-save-btn';
  saveBtn.type = 'button';
  saveBtn.textContent = 'Salva';
  saveBtn.addEventListener('click', onSave);

  actionsCont.appendChild(cancelBtn);
  actionsCont.appendChild(saveBtn);

  return { mainComponent: miniContainer };
}

function createInput({ className, placeholder, maxLength, ariaLabel }) {
  const input = document.createElement('input');
  input.type = 'text';
  input.className = className;
  input.setAttribute('placeholder', placeholder);
  input.maxLength = maxLength;
  input.setAttribute('inputmode', 'numeric');
  input.setAttribute('aria-label', ariaLabel);

  return input;
}

export default createMiniCalendar;