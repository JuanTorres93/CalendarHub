import {
  handleListSelection,
  handleOutSideClick,
} from '../utils/helpers/listSelection.js';
import { createMessage } from '../utils/helpers/createElement.js';
import { openMiniCalendar } from '../miniCalendar/miniCalendar.js';
import {
  getStoredCustomDates,
  initCustomDateRemoval,
  clearDatesStates,
} from './repeatcustomDates.js';
import { eventFormState } from '../utils/events/eventFormState.js';
import { hydrateCustomDates } from './repeatcustomDates.js';
import { Repeat } from '../domain/value-objets/Repeat/Repeat.js';
import { formatDate } from '../utils/events/eventsUI.js';
import dateValidator from '../utils/helpers/dateValidator.js';
import dayjs from '../day.js';

let editMode = false;
let repeatUiState = 'default';
let selectedDays = [];
let eventModalDomElements = null;

function updateIntervaltext(state, interval) {
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

const unitlDateDefault = (type, currentDate) => {
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

export function updateUntilUIAndDraft(date) {
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

function removeClassHelper(sections) {
  sections.forEach((section) => {
    if (section.classList.contains('show-repeat-section')) {
      section.classList.remove('show-repeat-section');
    }
  });
}

function repeatModalUiState(state) {
  const sections = [
    eventModalDomElements.repeat.intervalContainer,
    eventModalDomElements.repeat.weeklyContainer,
    eventModalDomElements.repeat.untilContainer,
    eventModalDomElements.repeat.customContainer,
  ];
  switch (state) {
    case 'default':
      removeClassHelper(sections);
      break;
    case 'daily':
      removeClassHelper(sections);
      eventModalDomElements.repeat.intervalContainer.classList.add(
        'show-repeat-section',
      );
      eventModalDomElements.repeat.untilContainer.classList.add(
        'show-repeat-section',
      );
      break;
    case 'weekly':
      eventFormState.repeat.weekdays = [...selectedDays];

      removeClassHelper(sections);
      eventModalDomElements.repeat.intervalContainer.classList.add(
        'show-repeat-section',
      );
      eventModalDomElements.repeat.untilContainer.classList.add(
        'show-repeat-section',
      );
      eventModalDomElements.repeat.weeklyContainer.classList.add(
        'show-repeat-section',
      );
      break;
    case 'monthly':
      removeClassHelper(sections);
      eventModalDomElements.repeat.intervalContainer.classList.add(
        'show-repeat-section',
      );
      eventModalDomElements.repeat.untilContainer.classList.add(
        'show-repeat-section',
      );
      break;
    case 'custom':
      eventFormState.repeat.customDates = getStoredCustomDates();

      removeClassHelper(sections);
      eventModalDomElements.repeat.customContainer.classList.add(
        'show-repeat-section',
      );
      break;
  }
}

export function rehydrateRepeatModal() {
  editMode = true;

  const repeatDraftInfo = eventFormState.repeat;
  if (repeatDraftInfo === null) return;

  repeatUiState = repeatDraftInfo.type;
  repeatModalUiState(repeatUiState);

  eventModalDomElements.repeat.modeBtn.innerText = repeatDraftInfo.type;
  eventModalDomElements.repeat.intervalInput.value = repeatDraftInfo.interval;

  updateIntervaltext(
    repeatDraftInfo.type,
    repeatDraftInfo.interval,
  );

  const days = eventModalDomElements.repeat.repeatContainer.querySelectorAll(
    '.weekly-repetion-item',
  );
  days.forEach((item) => {
    if (repeatDraftInfo.weekdays.includes(Number(item.dataset.dayIndex))) {
      item.classList.add('weekly-repetion-item-selected');
    }
  });

  unitlDateDefault('edit', repeatDraftInfo.until);

  hydrateCustomDates(repeatDraftInfo.customDates, eventModalDomElements);

  eventFormState.repeat.type = repeatDraftInfo.type;
  eventFormState.repeat.interval = repeatDraftInfo.interval;
  eventFormState.repeat.weekdays = [...repeatDraftInfo.weekdays];
  eventFormState.repeat.until = repeatDraftInfo.until;
  eventFormState.repeat.exceptions = [...repeatDraftInfo.exceptions];

  selectedDays = [...repeatDraftInfo.weekdays];
}

//controllo se è un numero o meno con : !Number.isInteger(interval)
function intervalInputValidator(state, interval) {
  if (!Number.isInteger(interval) || interval < 1) {
    createMessage(
      'inserisci un intervallo valido',
      eventModalDomElements.repeat.intervalContainer,
      eventModalDomElements.repeat.repeatContainer,
    );
    return false;
  }
  if (state === 'daily' && interval > 30) {
    createMessage(
      "l'intervallo giornaliero non può superare 30 giorni",
      eventModalDomElements.repeat.intervalContainer,
      eventModalDomElements.repeat.repeatContainer,
    );
    return false;
  }

  if (state === 'weekly' && interval > 12) {
    createMessage(
      "l'intervallo settimanale non può superare 12 settimane",
      eventModalDomElements.repeat.intervalContainer,
      eventModalDomElements.repeat.repeatContainer,
    );
    return false;
  }

  if (state === 'monthly' && interval > 24) {
    createMessage(
      "l'intervallo mensile non può superare 24 mesi",
      eventModalDomElements.repeat.intervalContainer,
      eventModalDomElements.repeat.repeatContainer,
    );
    return false;
  }

  return true;
}

function resetRepeatModalState() {
  repeatUiState = 'default';
  editMode = false;
  selectedDays = [];

  eventModalDomElements.repeat.modeBtn.innerText = '';
  eventModalDomElements.repeat.intervalInput.value = '';

  eventModalDomElements.repeat.modeList.classList.remove('show-mode-list');

  eventModalDomElements.repeat.dayOfWeekList
    .querySelectorAll('.weekly-repetion-item-selected')
    .forEach((item) => item.classList.remove('weekly-repetion-item-selected'));

  repeatModalUiState('default');
}

//devo aggiungfere la funzione per chiudere

function closeRepeatEvent() {
  eventModalDomElements.repeat.repeatContainer.classList.remove(
    'show-repeat-modal',
  );
  eventModalDomElements.repeatOverlay.classList.remove('show-repeat-overlay');
  if (editMode) {
    return;
  }
  resetRepeatModalState();
  clearDatesStates(eventModalDomElements);
}

export function forceResetRepeatModalState() {
  resetRepeatModalState();
  clearDatesStates(eventModalDomElements);
}

function saveRepeatEvent() {
  // Repeat draft is already validated by the Repeat value object at creation. This is here for italian message reference
  if (
    eventFormState.repeat?.type === 'custom' &&
    eventFormState.repeat?.customDates.length === 0
  ) {
    createMessage(
      'inserisci almeno una data',
      eventModalDomElements.repeat.customContainer,
      eventModalDomElements.repeat.repeatContainer,
    );
    return;
  }

  const seriesId = crypto.randomUUID();

  const currentFromDraft = eventFormState.repeat;

  if (currentFromDraft) {
    eventFormState.repeat = {
      ...currentFromDraft,
      seriesId,
    };
  }

  eventFormState.repeat = {
    ...eventFormState.repeat,
    seriesId,
  };

  Repeat.create({
    ...defaultRepeatFormProps(eventFormState.date),
    ...eventFormState.repeat,
  });

  closeRepeatEvent();
}

function defaultRepeatFormProps(eventDate) {
  return {
    interval: 1,
    weekdays: [],
    customDates: [],
    until: dayjs(eventDate).add(1, 'month').format('YYYY-MM-DD'),
    exceptions: [],
  };
}

export function initRepeatEvents(refs) {
  eventModalDomElements = refs;
  handleOutSideClick(
    '.repeat-mode-list, .repeat-mode-btn',
    eventModalDomElements.repeat.modeList,
    'show-mode-list',
  );

  eventModalDomElements.repeat.modeBtn.addEventListener('click', () => {
    eventModalDomElements.repeat.modeList.classList.toggle('show-mode-list');
  });

  handleListSelection(
    eventModalDomElements.repeat.modeList,
    '.repeat-mode-list-item',
    (li) => {
      repeatUiState = li.dataset.repeatType;

      eventFormState.repeat = {
        ...eventFormState.repeat,
        type: li.dataset.repeatType,
      };

      const date = unitlDateDefault('normal', undefined);

      eventFormState.repeat = {
        seriesId: 'fake-init-id',
        type: repeatUiState,
        interval: 1,
        weekdays: [],
        customDates: [],
        until: date,
        exceptions: [],
      };

      eventModalDomElements.repeat.intervalInput.value =
        eventFormState.repeat.interval;
      eventModalDomElements.repeat.modeBtn.innerText = li.innerText;

      repeatModalUiState(repeatUiState);
      updateIntervaltext(
        repeatUiState,
        eventFormState.repeat.interval,
      );
    },
    'show-mode-list',
  );

  eventModalDomElements.repeat.intervalInput.addEventListener('change', () => {
    const newValue = Number(eventModalDomElements.repeat.intervalInput.value);
    if (!intervalInputValidator(repeatUiState, newValue)) {
      eventModalDomElements.repeat.intervalInput.value =
        eventFormState.repeat.interval;
      return;
    }

    eventFormState.repeat.interval = newValue;

    updateIntervaltext(
      repeatUiState,
      eventFormState.repeat.interval,
    );
  });

  eventModalDomElements.repeat.dayOfWeekList.addEventListener('click', (e) => {
    const li = e.target.closest('.weekly-repetion-item');
    if (!li) return;
    const selected = li.classList.toggle('weekly-repetion-item-selected');
    const dayIndex = Number(li.dataset.dayIndex);
    if (selected) {
      if (selectedDays.includes(dayIndex)) return;
      selectedDays.push(dayIndex);
      selectedDays.sort((a, b) => a - b);
    } else {
      if (selectedDays.includes(dayIndex)) {
        selectedDays = selectedDays.filter((day) => day !== dayIndex);
      }
    }

    eventFormState.repeat.weekdays = [...selectedDays];
  });

  eventModalDomElements.repeat.untilMiniCalendarBtn.addEventListener(
    'click',
    () => {
      if (editMode) {
        const untilDateRestored = unitlDateDefault(
          'edit',
          eventFormState.repeat.until,
        );
        openMiniCalendar('event', untilDateRestored, 'repeat-until');
      } else {
        const date = unitlDateDefault(
          'normal',
          undefined,
        );
        openMiniCalendar('event', date, 'repeat-until');
      }
    },
  );

  eventModalDomElements.repeat.customMiniCalendarBtn.addEventListener(
    'click',
    () => {
      const date = eventModalDomElements.header.firstElementChild.dataset.day;
      openMiniCalendar('event', date, 'custom-dates');
    },
  );

  initCustomDateRemoval(eventModalDomElements);

  eventModalDomElements.repeat.closeBtn.addEventListener('click', () => {
    closeRepeatEvent();
  });

  eventModalDomElements.repeat.saveBtn.addEventListener('click', (e) => {
    saveRepeatEvent(e);
  });
}
