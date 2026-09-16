import {
  getEvents,
  deleteEventFromLocalStorage,
} from '../utils/events/eventStorage.js';
import { AppEventsRepo } from '../interface-adapters/repos/AppEventsRepo.js';
import createElement from '../utils/helpers/createElement.js';
import getFloatingPosition from '../utils/helpers/floatingPositioner.js';
import {
  renderEvents,
  getAllRenderableEvents,
} from '../utils/events/eventRendering.js';
import { createMessage } from '../utils/helpers/createElement.js';
import { preCompilerEdit } from './eventLogic.js';
import { rehydrateRepeatModal } from './repeatEvent.js';
import openModal from './eventModal.js';

import { miniCalendarLayer as modalLayer } from '../utils/helpers/dom/miniCalendarDom.js';

let selectedCurrentID = null;
let colorClass = null;

function handleOptionsClick(e) {
  const button = e.target.closest('button[data-action]');
  if (!button) return;

  const action = button.dataset.action;

  switch (action) {
    case 'edit-normal':
      handleClickEditButton(e);
      break;
    case 'edit-single':
      handleClickEditSingleEventBtn(e);
      break;
    case 'edit-series':
      handleClickEditSeriesBtn(e);
      break;
    case 'delete-normal':
      deleteEvent();
      break;
    case 'delete-single':
      deleteSingleOccurrence();
      break;
    case 'delete-series':
      deleteEventsOccurrencies();
      break;
  }
}

export function initOptionsBanner(currentEvent) {
  const optionsBanner = createElement(
    document.body,
    'option-banner-container',
    null,
    'div',
    { attributes: { 'data-testid': 'event-banner' } },
  );
  const close = createElement(optionsBanner, 'close-banner', 'x', 'button');
  const infoWrapper = createElement(optionsBanner, 'info-wrapper', null, 'div');

  const infoSection = createElement(
    infoWrapper,
    'info-section',
    null,
    'section',
    { html: true },
  );
  const optionsSection = createElement(
    infoWrapper,
    'options-section',
    null,
    'section',
    { html: true },
  );
  optionsSection.addEventListener('click', handleOptionsClick);
  optionsBanner
    .querySelector('.close-banner')
    .addEventListener('click', closeInfoBanner);
}

function getOptionButtons(isRepeatedEvent) {
  const banner = document.querySelector('.option-banner-container');
  const optionSection = banner.querySelector('.options-section');

  if (isRepeatedEvent) {
    optionSection.innerHTML = `
      <button 
        class="edit-event-btn" 
        type='button' 
        data-action="edit-single"
        data-testid="event-banner-edit-single-button"
      >
        modifica evento
      </button>
      <button 
        class="edit-event-btn" 
        type='button' 
        data-action="edit-series"
        data-testid="event-banner-edit-series-button"
      >
        modifica serie
      </button>
      <button 
        class="delete-event-btn" 
        type='button' 
        data-action="delete-single"
        data-testid="event-banner-delete-single-button"
      >
        elimina evento
      </button>
      <button 
        class="delete-event-btn" 
        type='button' 
        data-action="delete-series"
        data-testid="event-banner-delete-series-button"
      >
        elimina serie
      </button>
      `;
  } else {
    optionSection.innerHTML = `
      <button 
      class="edit-event-btn"
       type='button'
       data-action="edit-normal"
       data-testid="event-banner-edit-button"
       >
       modifica
       </button>
      <button 
      class="delete-event-btn" 
      type='button'
      data-action="delete-normal"
      data-testid="event-banner-delete-button"
      >
      elimina evento
      </button>`;
  }
}

export function renderExtraInfo(currentEvent, e) {
  const banner = document.querySelector('.option-banner-container');
  const infoSection = banner.querySelector('.info-section');
  const events = getAllRenderableEvents();
  const selectedEvent = events.find(
    (event) => event.id === currentEvent.dataset.id,
  );
  if (!selectedEvent) return;
  const isRepeatedEvent =
    selectedEvent.repeat !== null || selectedEvent.isOccurrence === true;
  const isDailyview = e.target.closest('.daily-event, .daily-allDay-event');
  const target = {
    top: e.clientY,
    bottom: e.clientY,
    left: e.clientX,
    right: e.clientX,
  };

  banner.classList.add(`event-${selectedEvent.color}`);
  modalLayer.classList.add('show-mini-calendar-layer');
  banner.classList.add('show-option-banner');
  // aggiunto per compensare il calcolo iniziale dell'altezza dell'info banner che al primo click non è ancora stato calcolato
  requestAnimationFrame(() => {
    getFloatingPosition(banner, target, isDailyview);
  });

  getOptionButtons(isRepeatedEvent);

  colorClass = selectedEvent.color;
  selectedCurrentID = currentEvent.dataset.id;

  infoSection.replaceChildren();

  const infoTitle = createElement(infoSection, 'info-title', '', 'div');

  createElement(infoTitle, null, selectedEvent.icon, 'span', {
    attributes: {
      'text-background': '',
    },
  });

  createElement(infoTitle, null, selectedEvent.title, 'h2');

  const timeText = selectedEvent.allDay
    ? 'Tutto il giorno'
    : `${selectedEvent.from} - ${selectedEvent.to}`;

  createElement(infoSection, 'time-row', timeText, 'p');

  if (selectedEvent.description) {
    createElement(infoSection, null, selectedEvent.description, 'p');
  }

  if (selectedEvent.urgent) {
    createElement(infoSection, null, 'Urgente!', 'p');
  }

  if (isRepeatedEvent) {
    createElement(infoSection, null, '🔗 Evento ripetuto', 'p');
  }
}

function finalizeBannerAction(message, banner) {
  createMessage(message, banner, document.body);
  closeInfoBanner();
  renderEvents();
}

function getEventContext() {
  const ID = selectedCurrentID;
  const events = getAllRenderableEvents();
  const currentEvent = events.find((event) => event.id === ID);
  const motherId = currentEvent.originalEventId ?? currentEvent.id;

  return {
    events,
    currentEvent,
    motherId,
  };
}

function deleteEvent() {
  const banner = document.querySelector('.option-banner-container');

  deleteEventFromLocalStorage(selectedCurrentID);
  finalizeBannerAction("l'evento è stato rimosso", banner);
}

function deleteEventsOccurrencies() {
  const banner = document.querySelector('.option-banner-container');
  const events = getAllRenderableEvents();

  const { motherId } = getEventContext();

  deleteEventFromLocalStorage(motherId);
  finalizeBannerAction('la serie è stato rimossa', banner);
}

function deleteSingleOccurrence() {
  const banner = document.querySelector('.option-banner-container');

  const { events, currentEvent, motherId } = getEventContext();
  if (!currentEvent) return;

  const occurrenceDate = currentEvent.date;

  if (currentEvent.isOccurrence === true && currentEvent.repeat !== null) {
    const motherEvent = AppEventsRepo.getById(motherId);

    motherEvent.update({
      repeat: {
        ...motherEvent.repeat,
        exceptions: [...motherEvent.repeat.exceptions, occurrenceDate],
      },
    });

    AppEventsRepo.save(motherEvent);
    finalizeBannerAction("l'evento è stato rimosso", banner);
  } else {
    //con find so che mi ritorna il primo elemento corrispondente, essendo che sono in ordine
    const nextOccurrence = events.find(
      (event) => event.originalEventId === currentEvent.id,
    );

    const motherEvent = AppEventsRepo.getById(motherId);

    motherEvent.update({
      date: nextOccurrence.date,
      repeat: {
        ...motherEvent.repeat,
        exceptions: [...motherEvent.repeat.exceptions, motherEvent.date],
      },
    });

    AppEventsRepo.save(motherEvent);
    finalizeBannerAction("l'evento è stato rimosso", banner);
  }
}

function getEventFromID() {
  const { events, currentEvent, motherId } = getEventContext();
  const motherEvent = events.find((event) => event.id === motherId);

  return {
    currentEvent: currentEvent,
    motherEvent: motherEvent,
  };
}

export function closeInfoBanner() {
  const banner = document.querySelector('.option-banner-container');
  banner.classList.remove(`event-${colorClass}`);
  selectedCurrentID = null;
  colorClass = null;
  modalLayer.classList.remove('show-mini-calendar-layer');
  banner.classList.remove('show-option-banner');
}

function handleEditFlow(event, mode, shouldRehydrate, e) {
  preCompilerEdit(event, mode);
  if (shouldRehydrate) {
    rehydrateRepeatModal();
  }
  openModal(e);
  closeInfoBanner();
}

function handleClickEditButton(e) {
  const currentEvent = getEventFromID().currentEvent;
  handleEditFlow(currentEvent, 'edit', false, e);
}
function handleClickEditSingleEventBtn(e) {
  const currentEvent = getEventFromID().currentEvent;
  handleEditFlow(currentEvent, 'edit-single-occurrence', false, e);
}
function handleClickEditSeriesBtn(e) {
  const currentEvent = getEventFromID().motherEvent;
  handleEditFlow(currentEvent, 'edit-series', true, e);
}

export function initExtraInfos() {
  initOptionsBanner();
}
