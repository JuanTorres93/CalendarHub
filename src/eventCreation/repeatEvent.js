import {
  updateRepeatDraft,
  initRepeatDraft,
  validatorRepeatDraft,
} from '../utils/events/repeatEventsDraft.js';
import {
  handleListSelection,
  handleOutSideClick,
} from '../utils/helpers/listSelection.js';
import {
  updateIntervaltext,
  unitlDateDefault,
} from '../utils/events/repeatEventsUi.js';
import { createMessage } from '../utils/helpers/createElement.js';
import { createDayOfWeek } from '../utils/events/createLists.js';
import { openMiniCalendar } from '../miniCalendar/miniCalendar.js';
import {
  getStoredCustomDates,
  initCustomDateRemoval,
  clearDatesStates,
} from './repeatcustomDates.js';
import { eventFormState } from '../utils/events/eventFormState.js';
import { hydrateCustomDates } from './repeatcustomDates.js';
import { Repeat } from '../domain/value-objets/Repeat/Repeat.js';
import dayjs from '../day.js';

import {
  repeatContainer,
  modeBtn,
  modeList,
  intervalContainer,
  weeklyContainer,
  untilContainer,
  customContainer,
  intervalInput,
  dayOfWeekList,
  untilMiniCalendarBtn,
  customMiniCalendarBtn,
  repeatOverlay,
  closeBtn,
  saveBtn,
} from '../utils/helpers/dom/repeatModalDom.js';

let editMode = false;
let repeatUiState = 'default';
let selectedDays = [];
let eventModalDomElements = null;

function removeClassHelper(sections) {
  sections.forEach((section) => {
    if (section.classList.contains('show-repeat-section')) {
      section.classList.remove('show-repeat-section');
    }
  });
}

function repeatModalUiState(state) {
  const sections = [
    intervalContainer,
    weeklyContainer,
    untilContainer,
    customContainer,
  ];
  switch (state) {
    case 'default':
      removeClassHelper(sections);
      break;
    case 'daily':
      removeClassHelper(sections);
      intervalContainer.classList.add('show-repeat-section');
      untilContainer.classList.add('show-repeat-section');
      break;
    case 'weekly':
      eventFormState.repeat.weekdays = [...selectedDays];

      removeClassHelper(sections);
      intervalContainer.classList.add('show-repeat-section');
      untilContainer.classList.add('show-repeat-section');
      weeklyContainer.classList.add('show-repeat-section');
      break;
    case 'monthly':
      removeClassHelper(sections);
      intervalContainer.classList.add('show-repeat-section');
      untilContainer.classList.add('show-repeat-section');
      break;
    case 'custom':
      eventFormState.repeat.customDates = getStoredCustomDates();

      removeClassHelper(sections);
      customContainer.classList.add('show-repeat-section');
      break;
  }
}

export function rehydrateRepeatModal() {
  editMode = true;

  const repeatDraftInfo = eventFormState.repeat;
  if (repeatDraftInfo === null) return;

  initRepeatDraft(
    repeatDraftInfo.type,
    repeatDraftInfo.until,
    repeatDraftInfo.seriesId,
  );

  repeatUiState = repeatDraftInfo.type;
  repeatModalUiState(repeatUiState);

  modeBtn.innerText = repeatDraftInfo.type;
  intervalInput.value = repeatDraftInfo.interval;

  updateIntervaltext(repeatDraftInfo.type, repeatDraftInfo.interval);

  const days = repeatContainer.querySelectorAll('.weekly-repetion-item');
  days.forEach((item) => {
    if (repeatDraftInfo.weekdays.includes(Number(item.dataset.dayIndex))) {
      item.classList.add('weekly-repetion-item-selected');
    }
  });

  unitlDateDefault('edit', repeatDraftInfo.until, eventModalDomElements);

  hydrateCustomDates(repeatDraftInfo.customDates);

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
      intervalContainer,
      repeatContainer,
    );
    return false;
  }
  if (state === 'daily' && interval > 30) {
    createMessage(
      "l'intervallo giornaliero non può superare 30 giorni",
      intervalContainer,
      repeatContainer,
    );
    return false;
  }

  if (state === 'weekly' && interval > 12) {
    createMessage(
      "l'intervallo settimanale non può superare 12 settimane",
      intervalContainer,
      repeatContainer,
    );
    return false;
  }

  if (state === 'monthly' && interval > 24) {
    createMessage(
      "l'intervallo mensile non può superare 24 mesi",
      intervalContainer,
      repeatContainer,
    );
    return false;
  }

  return true;
}

function resetRepeatModalState() {
  repeatUiState = 'default';
  editMode = false;
  selectedDays = [];

  modeBtn.innerText = '';
  intervalInput.value = '';

  modeList.classList.remove('show-mode-list');

  dayOfWeekList
    .querySelectorAll('.weekly-repetion-item-selected')
    .forEach((item) => item.classList.remove('weekly-repetion-item-selected'));

  repeatModalUiState('default');
}

//devo aggiungfere la funzione per chiudere

function closeRepeatEvent() {
  repeatContainer.classList.remove('show-repeat-modal');
  repeatOverlay.classList.remove('show-repeat-overlay');
  if (editMode) {
    return;
  }
  resetRepeatModalState();
  clearDatesStates();
}

export function forceResetRepeatModalState() {
  resetRepeatModalState();
  clearDatesStates();
}

function saveRepeatEvent() {
  const isValid = validatorRepeatDraft();
  if (!isValid) {
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
  createDayOfWeek();
  handleOutSideClick(
    '.repeat-mode-list, .repeat-mode-btn',
    modeList,
    'show-mode-list',
  );

  modeBtn.addEventListener('click', () => {
    modeList.classList.toggle('show-mode-list');
  });

  handleListSelection(
    modeList,
    '.repeat-mode-list-item',
    (li) => {
      repeatUiState = li.dataset.repeatType;

      eventFormState.repeat = {
        ...eventFormState.repeat,
        type: li.dataset.repeatType,
      };

      const date = unitlDateDefault('normal', undefined, eventModalDomElements);

      initRepeatDraft(repeatUiState, date);

      intervalInput.value = eventFormState.repeat.interval;
      modeBtn.innerText = li.innerText;

      repeatModalUiState(repeatUiState);
      updateIntervaltext(repeatUiState, eventFormState.repeat.interval);
    },
    'show-mode-list',
  );

  intervalInput.addEventListener('change', () => {
    const newValue = Number(intervalInput.value);
    if (!intervalInputValidator(repeatUiState, newValue)) {
      intervalInput.value = eventFormState.repeat.interval;
      return;
    }

    eventFormState.repeat.interval = newValue;

    updateIntervaltext(repeatUiState, eventFormState.repeat.interval);
  });

  dayOfWeekList.addEventListener('click', (e) => {
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

    updateRepeatDraft('weekdays', selectedDays);
  });

  untilMiniCalendarBtn.addEventListener('click', () => {
    if (editMode) {
      const untilDateRestored = unitlDateDefault(
        'edit',
        eventFormState.repeat.until,
        eventModalDomElements,
      );
      openMiniCalendar('event', untilDateRestored, 'repeat-until');
    } else {
      const date = unitlDateDefault('normal', undefined, eventModalDomElements);
      openMiniCalendar('event', date, 'repeat-until');
    }
  });

  customMiniCalendarBtn.addEventListener('click', () => {
    const date = eventModalDomElements.header.firstElementChild.dataset.day;
    openMiniCalendar('event', date, 'custom-dates');
  });

  initCustomDateRemoval();

  closeBtn.addEventListener('click', () => {
    closeRepeatEvent();
  });

  saveBtn.addEventListener('click', (e) => {
    saveRepeatEvent(e);
  });
}
