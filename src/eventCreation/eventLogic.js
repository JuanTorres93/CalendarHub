import dayjs from '../day.js';
import {
  toDomainNotification,
  toItalianNotification,
} from '../interface-adapters/other/bidirectionalItalianDomainMapper.js';
import { AppUpdateEventSeriesUsecase } from '../interface-adapters/use-cases/AppUpdateEventSeriesUsecase.js';
import { AppUpdateEventUsecase } from '../interface-adapters/use-cases/AppUpdateEventUsecase.js';
import { AppUpdateSingleEventOccurrenceUsecase } from '../interface-adapters/use-cases/AppUpdateSingleEventOccurrenceUsecase.js';

import { handleKnownErrors } from '../interface-adapters/other/handleKnownErrors.js';
import { AppCreateEventUsecase } from '../interface-adapters/use-cases/AppCreateEventUsecase.js';
import { openMiniCalendar } from '../miniCalendar/miniCalendar.js';
import { eventFormState } from '../utils/events/eventFormState.js';
import { renderEvents } from '../utils/events/eventRendering.js';
import { formatDate } from '../utils/events/eventsUI.js';
import { createMessage } from '../utils/helpers/createElement.js';
import {
  handleListSelection,
  handleOutSideClick,
} from '../utils/helpers/listSelection.js';
import { setTimeUIAndDraft } from '../utils/helpers/timeHelper.js';
import { nowTarget } from '../utils/isNow.js';
import { openEventModal } from '../components/features/event/EventModal/EventModal.js';
import { forceResetRepeatModalState, initRepeatEvents } from './repeatEvent.js';

let eventModalDomElements = null;

export function wireEventFormToEventLogic(refs) {
  eventModalDomElements = refs;

  initEventFormEvents();

  initRepeatEvents(refs);
}

function getOutsideDropdowns() {
  return [
    {
      selector: '.icons-list, #icons-btn',
      dropdown: eventModalDomElements.iconsList,
      className: 'show-icons-list',
    },

    {
      selector: '.description-area, .btn-description',
      dropdown: eventModalDomElements.showDesc,
      className: 'show-desc-area',
    },

    {
      selector: '.color-list, #color-btn',
      dropdown: eventModalDomElements.colorLists,
      className: 'show-color-list',
    },

    {
      selector: '.notification-list, .notification-button',
      dropdown: eventModalDomElements.notificationList,
      className: 'show-container',
    },

    {
      selector: '.interactive-time-list.from, .listed-time.from',
      dropdown: eventModalDomElements.listedTimeFrom,
      className: 'show-menù',
    },

    {
      selector: '.interactive-time-list.to, .listed-time.to',
      dropdown: eventModalDomElements.listedTimeTo,
      className: 'show-menù',
    },
  ];
}

const EVENT_DRAFT_FIELDS = [
  'title',
  'date',
  'from',
  'to',
  'description',
  'icon',
  'color',
  'urgent',
  'allDay',
  'repeat',
  'notification',
];

let editingEventId = null;
let editingMotherEventId = null;
let editingOccurrenceDate = null;
let originalRepeatSnapshot = null;
let originalSeriesDate = null;

export const getData = (e) => {
  let date, time;
  const monthCell = e.target.closest('.box-grid');
  if (monthCell) {
    date = e.target.dataset.day;
    time = dayjs().minute(0).format('HH:mm');
    return {
      date: date,
      time: time,
    };
  } else {
    date = e.target.parentElement.dataset.day;
    time = e.target.dataset.time;
    return {
      date: date,
      time: time,
    };
  }
};

function classRemovalHelper(sections) {
  sections.forEach((item) => {
    if (item.section.classList.contains(item.class)) {
      item.section.classList.remove(item.class);
    }
  });
}

export function resetEventModal() {
  eventFormState.mode = 'create';
  delete eventFormState.date;
  delete eventFormState.notification;
  delete eventFormState.allDay;

  editingEventId = null;
  editingMotherEventId = null;
  editingOccurrenceDate = null;
  originalRepeatSnapshot = null;
  originalSeriesDate = null;

  const sections = [
    { section: eventModalDomElements.colorLists, class: 'show-color-list' },
    { section: eventModalDomElements.urgentCheckBox, class: 'checked' },
    { section: eventModalDomElements.iconsList, class: 'show-icons-list' },
    {
      section: eventModalDomElements.notificationList,
      class: 'show-container',
    },
    { section: eventModalDomElements.showDesc, class: 'show-desc-area' },
    { section: eventModalDomElements.listedTimeFrom, class: 'show-menù' },
    { section: eventModalDomElements.listedTimeTo, class: 'show-menù' },
  ];
  if (eventModalDomElements.allDayCheckBox.classList.contains('checked')) {
    eventModalDomElements.allDayCheckBox.classList.remove('checked');
    eventModalDomElements.timeSelectionContainer.classList.remove(
      'hide-time-section',
    );
  }

  classRemovalHelper(sections);

  eventModalDomElements.iconBtn.innerText = '✏️';
  eventModalDomElements.inputTitle.value = '';
  eventModalDomElements.inputDesc.value = '';
  eventModalDomElements.colorPreview.style.backgroundColor = 'blue';
  eventModalDomElements.fromHourInput.value = '';
  eventModalDomElements.fromMinuteInput.value = '';
  eventModalDomElements.toHourInput.value = '';
  eventModalDomElements.toMinuteInput.value = '';
  eventModalDomElements.notificationList.style.left = '';
  eventModalDomElements.notificationBtn.innerText = '5 minuti prima';

  eventFormState.from = '';
  eventFormState.to = '';

  eventFormState.repeat = null;
}

const renderModeTextInfo = (mode, eventTitle) => {
  const modalTitle = eventModalDomElements.modalInfoMode;
  eventModalDomElements.smallMessage.innerText = '';
  switch (mode) {
    case 'create':
      modalTitle.innerText = 'Crea un nuovo evento!';
      break;
    case 'edit':
      modalTitle.innerText = `Stai modificando : ${eventTitle}`;
      break;
    case 'edit-series':
      modalTitle.innerText = `Stai modificando la serie ${eventTitle}`;
      eventModalDomElements.smallMessage.innerText =
        'Le modifiche verranno applicate a tutta la serie.';
      break;
    case 'edit-single-occurrence':
      modalTitle.innerText = `Stai modificando : ${eventTitle}`;
      eventModalDomElements.smallMessage.innerText =
        'Questa occorrenza verrà separata dalla serie.';
      break;
    default:
      break;
  }
};

export function preCompiler(e) {
  const { date, time } = getData(e);
  const endTime = dayjs(time, 'HH:mm').add(1, 'hour').format('HH:mm');

  eventFormState.date = date;

  eventModalDomElements.header.firstElementChild.textContent = formatDate(date);
  eventModalDomElements.header.firstElementChild.dataset.day = date;
  eventModalDomElements.header.firstElementChild.nextElementSibling.textContent =
    time;

  setTimeUIAndDraft('from', time, eventModalDomElements);
  setTimeUIAndDraft('to', endTime, eventModalDomElements);

  renderModeTextInfo(eventFormState.mode);
}

export function preCompilerEdit(event, mode) {
  eventFormState.mode = mode;

  eventFormState.title = event.title;
  eventFormState.description = event.description;
  eventFormState.date = event.date;
  eventFormState.from = event.from;
  eventFormState.to = event.to;
  eventFormState.icon = event.icon;
  eventFormState.color = event.color;
  eventFormState.urgent = event.urgent;
  eventFormState.allDay = event.allDay;
  eventFormState.notification = event.notification;

  renderModeTextInfo(eventFormState.mode, event.title);

  const updateEventEntityProps = {};

  EVENT_DRAFT_FIELDS.forEach((field) => {
    if (event[field] === undefined) return;

    updateEventEntityProps[field] =
      field === 'repeat' && event['repeat'] !== null
        ? structuredClone(event['repeat'])
        : event[field];
  });

  const combinedEventProps = {
    ...eventFormState,
    ...updateEventEntityProps,
  };
  Object.entries(combinedEventProps).forEach(([key, value]) => {
    eventFormState[key] = value;
  });

  editingEventId = event.id;

  if (mode === 'edit-single-occurrence') {
    editingEventId = null;
    editingMotherEventId = event.originalEventId
      ? event.originalEventId
      : event.id;
    editingOccurrenceDate = event.date;

    eventFormState.repeat = null;
  }

  if (mode === 'edit-series') {
    // structuredClone(event.repeat) crea un clone dell'elemento
    originalRepeatSnapshot = structuredClone(event.repeat);
    originalSeriesDate = event.date;
  }

  eventModalDomElements.header.firstElementChild.textContent = formatDate(
    event.date,
  );
  eventModalDomElements.header.firstElementChild.dataset.day = event.date; //risolve il miniCalendario data iniziale
  eventModalDomElements.header.firstElementChild.nextElementSibling.textContent =
    event.from;

  eventModalDomElements.iconBtn.innerText = event.icon;
  eventModalDomElements.inputTitle.value = event.title;
  eventModalDomElements.inputDesc.value = event.description;

  eventModalDomElements.colorPreview.style.backgroundColor = `${event.color}`;

  if (event.urgent) {
    eventModalDomElements.urgentCheckBox.classList.add('checked');
  }
  if (event.allDay) {
    eventModalDomElements.allDayCheckBox.classList.add('checked');
    eventModalDomElements.timeSelectionContainer.classList.add(
      'hide-time-section',
    );
  }
  setTimeUIAndDraft('from', event.from, eventModalDomElements);
  setTimeUIAndDraft('to', event.to, eventModalDomElements);

  eventModalDomElements.notificationBtn.innerText = toItalianNotification(
    event.notification,
  );
}

function updateTimeInput(part, value) {
  const num = parseInt(value);

  if (isNaN(num)) return;

  switch (part) {
    case 'hour':
      if (num < 0 || num > 23) return;
      return String(num).padStart(2, '0');
      break;
    case 'minute':
      if (num < 0 || num >= 60) return;
      return String(num).padStart(2, '0');
      break;
  }
}
function inputTimeHelper(caseType, input, classType) {
  const time = updateTimeInput(caseType, input.value);
  if (time === undefined) {
    input.value = '';
    return;
  }

  input.value = time;

  const isFrom = classType === 'from';
  const hour =
    caseType === 'hour'
      ? time
      : isFrom
        ? eventModalDomElements.fromHourInput.value
        : eventModalDomElements.toHourInput.value;
  const minute =
    caseType === 'minute'
      ? time
      : isFrom
        ? eventModalDomElements.fromMinuteInput.value
        : eventModalDomElements.toMinuteInput.value;

  if (hour !== '' && minute !== '') {
    eventFormState[classType] = `${hour}:${minute}`;
  }
}

function inputTimeReader() {
  eventModalDomElements.fromHourInput.addEventListener('change', () => {
    inputTimeHelper('hour', eventModalDomElements.fromHourInput, 'from');
  });
  eventModalDomElements.fromMinuteInput.addEventListener('change', () => {
    inputTimeHelper('minute', eventModalDomElements.fromMinuteInput, 'from');
  });
  eventModalDomElements.toHourInput.addEventListener('change', () => {
    inputTimeHelper('hour', eventModalDomElements.toHourInput, 'to');
  });
  eventModalDomElements.toMinuteInput.addEventListener('change', () => {
    inputTimeHelper('minute', eventModalDomElements.toMinuteInput, 'to');
  });
}

function applySelectedTime(type, time) {
  setTimeUIAndDraft(type, time, eventModalDomElements);
}

function closeModal() {
  eventModalDomElements.modalOverlay.classList.remove('show-overlay');
  eventModalDomElements.modalEvents.classList.remove('show-container');

  eventModalDomElements.modalEvents.style.top = '';
  eventModalDomElements.modalEvents.style.left = '';

  forceResetRepeatModalState();
  resetEventModal();
}

export function initEventFormEvents() {
  let title, desc;

  getOutsideDropdowns().forEach((item) => {
    handleOutSideClick(item.selector, item.dropdown, item.className);
  });

  eventModalDomElements.iconBtn.addEventListener('click', () => {
    eventModalDomElements.iconsList.classList.toggle('show-icons-list');
  });

  handleListSelection(
    eventModalDomElements.iconsList,
    '.icon-list-item',
    (li) => {
      eventFormState.icon = li.textContent;

      eventModalDomElements.iconBtn.innerText = li.textContent;

      eventFormState.icon = li.textContent;
    },
    'show-icons-list',
  );

  eventModalDomElements.btnDesc.addEventListener('click', () => {
    eventModalDomElements.showDesc.classList.toggle('show-desc-area');
  });

  eventModalDomElements.inputTitle.addEventListener('change', () => {
    title = eventModalDomElements.inputTitle.value;

    eventFormState.title = title;
  });
  eventModalDomElements.inputDesc.addEventListener('change', () => {
    desc = eventModalDomElements.inputDesc.value;

    eventFormState.description = desc;
  });
  eventModalDomElements.categoryBtn.addEventListener('click', () => {
    eventModalDomElements.colorLists.classList.toggle('show-color-list');
  });

  handleListSelection(
    eventModalDomElements.colorLists,
    '.color',
    (li) => {
      eventFormState.color = li.dataset.color;

      eventModalDomElements.colorPreview.style.backgroundColor =
        li.dataset.color;

      eventFormState.color = li.dataset.color;
    },
    'show-color-list',
  );

  eventModalDomElements.urgentBtn.addEventListener('click', () => {
    const isChecked =
      eventModalDomElements.urgentCheckBox.classList.toggle('checked');

    eventFormState.urgent = isChecked;
  });

  eventModalDomElements.miniCalendarBtn.addEventListener('click', () => {
    const date = eventModalDomElements.header.firstElementChild.dataset.day;

    openMiniCalendar('event', date, 'event-date');
  });

  eventModalDomElements.allDayBtn.addEventListener('click', () => {
    const isChecked =
      eventModalDomElements.allDayCheckBox.classList.toggle('checked');

    eventFormState.allDay = isChecked;

    if (isChecked) {
      eventModalDomElements.timeSelectionContainer.classList.add(
        'hide-time-section',
      );
    } else {
      eventModalDomElements.timeSelectionContainer.classList.remove(
        'hide-time-section',
      );
    }
  });

  inputTimeReader();

  eventModalDomElements.listedTimeBtnFrom.addEventListener('click', (e) => {
    const isOpen =
      eventModalDomElements.listedTimeFrom.classList.toggle('show-menù');

    if (isOpen) {
      const targetTime = eventFormState.from;
      const target = nowTarget(
        eventModalDomElements.listedTimeFrom.querySelectorAll('.list-item'),
        null,
        'cellTime',
        targetTime,
      );
      target?.scrollIntoView({ block: 'center', behavior: 'auto' });
    }
  });
  eventModalDomElements.listedTimeBtnTo.addEventListener('click', () => {
    const isOpen =
      eventModalDomElements.listedTimeTo.classList.toggle('show-menù');

    if (isOpen) {
      const targetTime = eventFormState.to;
      const target = nowTarget(
        eventModalDomElements.listedTimeTo.querySelectorAll('.list-item'),
        null,
        'cellTime',
        targetTime,
      );
      target?.scrollIntoView({ block: 'center', behavior: 'auto' });
    }
  });

  handleListSelection(
    eventModalDomElements.listedTimeFrom,
    '.list-item',
    (li) => {
      applySelectedTime('from', li.dataset.time);
    },
    'show-menù',
  );
  handleListSelection(
    eventModalDomElements.listedTimeTo,
    '.list-item',
    (li) => {
      applySelectedTime('to', li.dataset.time);
    },
    'show-menù',
  );

  eventModalDomElements.repeatBtn.addEventListener('click', () => {
    eventModalDomElements.repeat.repeatContainer.classList.toggle('show-repeat-modal');
    eventModalDomElements.repeatOverlay.classList.add('show-repeat-overlay');
  });

  eventModalDomElements.notificationBtn.addEventListener('click', () => {
    const position =
      eventModalDomElements.notificationBtn.getClientRects()[0].right;
    eventModalDomElements.notificationList.style.left = position + 'px';
    eventModalDomElements.notificationList.classList.toggle('show-container');
  });

  handleListSelection(
    eventModalDomElements.notificationList,
    '.single-notification',
    (li) => {
      eventFormState.notification = toDomainNotification(li.textContent);

      eventModalDomElements.notificationBtn.innerText = li.textContent;
    },
    'show-container',
  );

  eventModalDomElements.saveBtn.addEventListener('click', (e) => {
    const eventFormProps = getEventRawPropsFromForm(e);

    const createEventProps = {
      ...eventFormProps,
      ...eventFormState,
    };

    let feedbackMessage = '';

    try {
      if (eventFormState.mode === 'create') {
        AppCreateEventUsecase.execute(createEventProps);
      } else if (eventFormState.mode === 'edit') {
        AppUpdateEventUsecase.execute({
          id: editingEventId,
          eventRawProps: createEventProps,
        });

        feedbackMessage = "l'evento è stato modificato!";
      } else if (eventFormState.mode === 'edit-single-occurrence') {
        AppUpdateSingleEventOccurrenceUsecase.execute({
          motherEventId: editingMotherEventId,
          occurrenceDate: editingOccurrenceDate,
          eventRawProps: createEventProps,
        });

        feedbackMessage = "l'occorrenza è stata modificata!";
      } else if (eventFormState.mode === 'edit-series') {
        AppUpdateEventSeriesUsecase.execute({
          id: editingEventId,
          originalRepeat: originalRepeatSnapshot,
          originalDate: originalSeriesDate,
          eventRawProps: createEventProps,
        });

        feedbackMessage = 'la serie è stato modificata!';
      }

      if (feedbackMessage) {
        createMessage(
          feedbackMessage,
          eventModalDomElements.modalEvents,
          document.body,
        );
      }

      closeModal();
      renderEvents();
    } catch (error) {
      handleKnownErrors(error, eventModalDomElements);
    }
  });

  eventModalDomElements.closeBtn.addEventListener('click', () => {
    closeModal();
  });
}

function getEventRawPropsFromForm(e) {
  const formData = new FormData(e.target.closest('form'));

  return {
    title: formData.get('event-title'),
    description: formData.get('event-description'),
    from: combineTime(formData, 'from'),
    to: combineTime(formData, 'to'),
  };
}

function combineTime(formData, type) {
  const hour = formData.get(`event-${type}-hour`);
  const minute = formData.get(`event-${type}-minute`);

  return hour && minute ? `${hour}:${minute}` : '';
}

export function handleOpenCreate(e) {
  preCompiler(e);
  openEventModal(e, eventModalDomElements);
}
