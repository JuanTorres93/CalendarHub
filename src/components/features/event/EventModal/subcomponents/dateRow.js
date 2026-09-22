import { createCheckboxIcon } from './checkboxIcon';

export function createDateRow() {
  const dateRow = document.createElement('div');
  dateRow.id = 'row-date';

  const eventDate = document.createElement('div');
  eventDate.className = 'event-date';

  const dateText = document.createElement('p');
  dateText.className = 'desc-text';
  dateText.textContent = 'Data :';

  const dateIcon = document.createElement('div');
  dateIcon.className = 'date-icon';

  const miniCalendarBtn = document.createElement('button');
  miniCalendarBtn.type = 'button';
  miniCalendarBtn.className = 'mini-calendar-btn';
  miniCalendarBtn.setAttribute('aria-label', 'Scegli data');
  miniCalendarBtn.setAttribute('aria-haspopup', 'dialog');
  miniCalendarBtn.setAttribute('data-testid', 'event-date-button');
  miniCalendarBtn.textContent = '📆';

  dateIcon.appendChild(miniCalendarBtn);
  eventDate.appendChild(dateText);
  eventDate.appendChild(dateIcon);

  const allDay = document.createElement('div');
  allDay.id = 'all-day';

  const allDayText = document.createElement('p');
  allDayText.className = 'desc-text';
  allDayText.textContent = 'Giornata Intera :';

  const allDayBtn = document.createElement('button');
  allDayBtn.id = 'all-day-btn';
  allDayBtn.type = 'button';
  allDayBtn.setAttribute('aria-label', "Evento per l'intera giornata");
  allDayBtn.setAttribute('aria-pressed', 'false');
  allDayBtn.setAttribute('data-testid', 'event-all-day-button');
  allDayBtn.appendChild(createCheckboxIcon());

  allDay.appendChild(allDayText);
  allDay.appendChild(allDayBtn);

  dateRow.appendChild(eventDate);
  dateRow.appendChild(allDay);

  return dateRow;
}
