import dayjs from '../../day.js';

export function formatDate(date) {
  let year, month, day;

  year = date.slice(0, 4);
  month = date.slice(5, 7);
  day = date.slice(8, 10);
  const actualMonth = Number(month) - 1;
  const monthInLetters = dayjs().month(actualMonth).format('MMMM');

  return `${day} ${monthInLetters} ${year}`;
}

export function updateEventDateUI(date, eventModalDomElements) {
  eventModalDomElements.header.firstElementChild.textContent = formatDate(date);
  eventModalDomElements.header.firstElementChild.dataset.day = date;
}
