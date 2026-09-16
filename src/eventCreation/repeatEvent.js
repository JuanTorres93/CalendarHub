import dayjs from '../day.js';
import {
  repeatEventsDraft,
  updateRepeatDraft,
  initRepeatDraft,
  clearRepeatDraft,
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
import { eventDraft, globalEventState } from '../utils/events/eventDraft.js';
import { hydrateCustomDates } from './repeatcustomDates.js';

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
  customList,
  repeatOverlay,
  closeBtn,
  saveBtn,
} from '../utils/helpers/dom/repeatModalDom.js';

import { header } from '../utils/helpers/dom/eventModalDom.js';

let editMode = false;
let repeatUiState = 'default';
let selectedDays = [];
let temporanyStorageForCustomDates = [];

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
      repeatEventsDraft.weekdays = [...selectedDays];
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
      repeatEventsDraft.customDates = getStoredCustomDates();
      removeClassHelper(sections);
      customContainer.classList.add('show-repeat-section');
      break;
  }
}

export function rehydrateRepeatModal() {
  editMode = true;
  const repeatDraftInfo = eventDraft.repeat;
  if (repeatDraftInfo === null) return;

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
  unitlDateDefault('edit', repeatDraftInfo.until);

  hydrateCustomDates(repeatDraftInfo.customDates);
  repeatEventsDraft.type = repeatDraftInfo.type;
  repeatEventsDraft.interval = repeatDraftInfo.interval;
  repeatEventsDraft.weekdays = [...repeatDraftInfo.weekdays];
  // repeatEventsDraft.customDates = [...repeatDraftInfo.customDates]
  repeatEventsDraft.until = repeatDraftInfo.until;
  repeatEventsDraft.exceptions = [...repeatDraftInfo.exceptions];
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

  clearRepeatDraft();

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
  } else {
    repeatEventsDraft.seriesId = crypto.randomUUID();

    globalEventState.repeat = { ...repeatEventsDraft };

    //fare una copia e passargli quella, funziona rispetto a passargli direttamente il valore el repeatEventDraft, perchè poi lo stato alla chiusura vine pulito, canceellando gli stessi valori. mantre la copia usando un altro ogetto di memoria non viene pulito alla chiususra.
    eventDraft.update({
      repeat: repeatEventsDraft,
    });

    closeRepeatEvent();
  }
}

export function initRepeatEvents() {
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
      const date = unitlDateDefault('normal');
      initRepeatDraft(repeatUiState, date);
      intervalInput.value = repeatEventsDraft.interval;
      modeBtn.innerText = li.innerText;
      repeatModalUiState(repeatUiState);
      updateIntervaltext(repeatUiState, repeatEventsDraft.interval);
    },
    'show-mode-list',
  );

  intervalInput.addEventListener('change', () => {
    const newValue = Number(intervalInput.value);
    if (!intervalInputValidator(repeatUiState, newValue)) {
      intervalInput.value = repeatEventsDraft.interval;
      return;
    }

    updateRepeatDraft('interval', newValue);
    updateIntervaltext(repeatUiState, repeatEventsDraft.interval);
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
    updateRepeatDraft('weekdays', selectedDays);
  });
  untilMiniCalendarBtn.addEventListener('click', () => {
    if (editMode) {
      const untilDateRestored = unitlDateDefault(
        'edit',
        eventDraft.repeat.until,
      );
      openMiniCalendar('event', untilDateRestored, 'repeat-until');
    } else {
      const date = unitlDateDefault('normal');
      openMiniCalendar('event', date, 'repeat-until');
    }
  });

  customMiniCalendarBtn.addEventListener('click', () => {
    const date = header.firstElementChild.dataset.day;
    openMiniCalendar('event', date, 'custom-dates');
  });

  initCustomDateRemoval();

  closeBtn.addEventListener('click', () => {
    closeRepeatEvent();
  });

  saveBtn.addEventListener('click', () => {
    saveRepeatEvent();
  });
}
