import { formatDate } from './eventsUI.js';
import { createMessage } from '../helpers/createElement.js';
import { eventFormState } from './eventFormState.js';
import dateValidator from '../helpers/dateValidator.js';
import dayjs from '../../day.js';

export function updateIntervaltext(state, interval, eventModalDomElements) {
  const intervalText = eventModalDomElements.repeat.intervalText;
  if (state === 'custom') return;
  if (state === 'daily') {
    if (interval === 1) {
      intervalText.innerText = 'ogni giorno';
    } else {
      intervalText.innerText = `ogni ${interval} giorni`;
    }
  }
  if (state === 'weekly') {
    if (interval === 1) {
      intervalText.innerText = 'ogni settimana';
    } else {
      intervalText.innerText = `ogni ${interval} settimane`;
    }
  }
  if (state === 'monthly') {
    if (interval === 1) {
      intervalText.innerText = 'ogni mese';
    } else {
      intervalText.innerText = `ogni ${interval} mesi`;
    }
  }
}

export const unitlDateDefault = (type, currentDate, eventModalDomElements) => {
  const untilText = eventModalDomElements.repeat.untilText;
  let dateDisplayed;
  if (type === 'normal') {
    const date = eventModalDomElements.header.firstElementChild.dataset.day;
    const month = dayjs(date).add(1, 'month').format('YYYY-MM-DD');
    dateDisplayed = formatDate(month);
    untilText.innerText = dateDisplayed;

    eventFormState.repeat = {
      ...eventFormState.repeat,
      until: month,
    };

    return month;
  }
  if (type === 'edit') {
    dateDisplayed = formatDate(currentDate);
    untilText.innerText = dateDisplayed;

    eventFormState.repeat = {
      ...eventFormState.repeat,
      until: currentDate,
    };

    return currentDate;
  }
};

export function updateUntilUIAndDraft(date, eventModalDomElements) {
  const initialDate = eventModalDomElements.header.firstElementChild.dataset.day;
  const dateDisplayed = formatDate(date);

  const isNotValid = dateValidator(initialDate, date);
  if (isNotValid) {
    return createMessage(
      "La data deve essere successiva all'evento",
      eventModalDomElements.repeat.untilContainer,
      eventModalDomElements.repeat.repeatContainer,
    );
  } else {
    eventModalDomElements.repeat.untilText.innerText = dateDisplayed;

    eventFormState.repeat.until = date;
  }
}
