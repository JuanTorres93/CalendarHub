import { formatDate } from './eventsUI.js';
import { createMessage } from '../helpers/createElement.js';
import { updateRepeatDraft } from './repeatEventsDraft.js';
import { globalEventState } from './eventFormState.js';
import dateValidator from '../helpers/dateValidator.js';
import dayjs from '../../day.js';
import { header } from '../helpers/dom/eventModalDom.js';
import {
  repeatContainer,
  intervalText,
  untilContainer,
  untilText,
} from '../helpers/dom/repeatModalDom.js';

export function updateIntervaltext(state, interval) {
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

export const unitlDateDefault = (type, currentDate) => {
  let dateDisplayed;
  if (type === 'normal') {
    const date = header.firstElementChild.dataset.day;
    const month = dayjs(date).add(1, 'month').format('YYYY-MM-DD');
    dateDisplayed = formatDate(month);
    untilText.innerText = dateDisplayed;

    globalEventState.repeat = {
      ...globalEventState.repeat,
      until: month,
    };

    return month;
  }
  if (type === 'edit') {
    dateDisplayed = formatDate(currentDate);
    untilText.innerText = dateDisplayed;

    globalEventState.repeat = {
      ...globalEventState.repeat,
      until: currentDate,
    };

    return currentDate;
  }
};

export function updateUntilUIAndDraft(date) {
  const initialDate = header.firstElementChild.dataset.day;
  const dateDisplayed = formatDate(date);

  const isNotValid = dateValidator(initialDate, date);
  if (isNotValid) {
    return createMessage(
      "La data deve essere successiva all'evento",
      untilContainer,
      repeatContainer,
    );
  } else {
    untilText.innerText = dateDisplayed;

    globalEventState.repeat.until = date;

    updateRepeatDraft('until', date);
  }
}
