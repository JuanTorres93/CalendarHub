import {
  updateRepeatDraft,
  initRepeatDraft,
  clearRepeatDraft,
  validatorRepeatDraft,
  voRepeatDraft,
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
import { Repeat } from '../domain/value-objets/Repeat/Repeat.js';

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

import { header } from '../utils/helpers/dom/eventModalDom.js';

let editMode = false;
let repeatUiState = 'default';
let selectedDays = [];

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
      updateRepeatDraft('weekdays', [...selectedDays]);

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
      updateRepeatDraft('customDates', getStoredCustomDates());

      removeClassHelper(sections);
      customContainer.classList.add('show-repeat-section');
      break;
  }
}

export function rehydrateRepeatModal() {
  editMode = true;

  // Legacy code
  const repeatDraftInfo = eventDraft.repeat;
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

  unitlDateDefault('edit', repeatDraftInfo.until);

  hydrateCustomDates(repeatDraftInfo.customDates);

  updateRepeatDraft('type', repeatDraftInfo.type);
  updateRepeatDraft('interval', repeatDraftInfo.interval);
  updateRepeatDraft('weekdays', [...repeatDraftInfo.weekdays]);
  updateRepeatDraft('until', repeatDraftInfo.until);
  updateRepeatDraft('exceptions', [...repeatDraftInfo.exceptions]);

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

function saveRepeatEvent(e) {
  const isValid = validatorRepeatDraft();
  if (!isValid) {
    return;
  } else {
    const seriesId = crypto.randomUUID();

    const current = voRepeatDraft.repeat.toJSON();
    const currentFromDraft = eventDraft.repeat;

    if (current) {
      voRepeatDraft.repeat = Repeat.create({
        ...current,
        seriesId,
      });
    }

    if (currentFromDraft) {
      eventDraft.update({ repeat: { ...currentFromDraft, seriesId } });
    }

    globalEventState.repeatForm = {
      ...getRepeatRawPropsFromForm(e),
      ...globalEventState.repeatForm,
      seriesId,
    };

    globalEventState.repeat = { ...eventDraft.repeat };

    closeRepeatEvent();
  }
}

function getRepeatRawPropsFromForm(e) {
  const formData = new FormData(e.target.closest('form'));

  return {
    interval: formData.get('event-repeat-interval'),
  };
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

      globalEventState.repeatForm = {
        ...globalEventState.repeatForm,
        type: li.dataset.repeatType,
      };

      const date = unitlDateDefault('normal');

      initRepeatDraft(repeatUiState, date);

      intervalInput.value = eventDraft.repeat.interval;
      modeBtn.innerText = li.innerText;

      repeatModalUiState(repeatUiState);
      updateIntervaltext(repeatUiState, eventDraft.repeat.interval);
    },
    'show-mode-list',
  );

  intervalInput.addEventListener('change', () => {
    const newValue = Number(intervalInput.value);
    if (!intervalInputValidator(repeatUiState, newValue)) {
      intervalInput.value = eventDraft.repeat.interval;
      return;
    }

    updateRepeatDraft('interval', newValue);
    updateIntervaltext(repeatUiState, eventDraft.repeat.interval);
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

    globalEventState.repeatForm = {
      ...globalEventState.repeatForm,
      weekdays: [...selectedDays],
    };
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

  saveBtn.addEventListener('click', (e) => {
    saveRepeatEvent(e);
  });
}
