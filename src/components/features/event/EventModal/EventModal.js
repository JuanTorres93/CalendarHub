import { createEventRepeatModal } from '../eventRepeatModal.js';
import { createCurrentEventMode } from './subcomponents/currentEventMode.js';
import { createShowDate } from './subcomponents/showDate.js';
import { createEventDescription } from './subcomponents/eventDescription.js';
import { createCategorySelector } from './subcomponents/categorySelector.js';
import { createDateRow } from './subcomponents/dateRow.js';
import { createTimeRow } from './subcomponents/timeRow.js';
import { createNotificationRow } from './subcomponents/notificationRow.js';
import getFloatingPosition from '../../../../utils/helpers/floatingPositioner.js';

const EVENT_MODAL_ID = 'event-modal';
const EVENT_CONTAINER_ID = 'event-container';

export function createEventModal() {
  const fragment = document.createDocumentFragment();

  const overlay = document.createElement('div');
  overlay.id = EVENT_MODAL_ID;
  overlay.classList.add('modal-overlay');
  overlay.setAttribute('aria-hidden', 'true');

  const eventContainer = document.createElement('section');
  eventContainer.id = EVENT_CONTAINER_ID;
  eventContainer.className = 'event-container';
  eventContainer.setAttribute('role', 'dialog');
  eventContainer.setAttribute('aria-modal', 'true');
  eventContainer.setAttribute('aria-labelledby', 'event-modal-title');
  eventContainer.setAttribute('aria-describedby', 'event-modal-description');
  eventContainer.setAttribute('data-testid', 'event-popup-container');

  eventContainer.appendChild(createCurrentEventMode());

  const eventForm = document.createElement('form');
  eventForm.className = 'event-form';
  eventForm.setAttribute('data-testid', 'event-form');

  eventForm.appendChild(createShowDate());
  eventForm.appendChild(createEventDescription());
  eventForm.appendChild(createCategorySelector());
  eventForm.appendChild(createDateRow());
  eventForm.appendChild(createTimeRow());
  eventForm.appendChild(createNotificationRow());
  eventForm.appendChild(createEventRepeatModal());

  const repeatOverlay = document.createElement('div');
  repeatOverlay.className = 'repeat-overlay';
  repeatOverlay.setAttribute('aria-hidden', 'true');

  eventForm.appendChild(repeatOverlay);
  eventContainer.appendChild(eventForm);

  fragment.appendChild(overlay);
  fragment.appendChild(eventContainer);

  return fragment;
}

let modalOverlay = null;
let modalEvents = null;

export function openEventModal(e) {
  if (!modalOverlay) {
    modalOverlay = document.getElementById(EVENT_MODAL_ID);
  }
  if (!modalEvents) {
    modalEvents = document.getElementById(EVENT_CONTAINER_ID);
  }

  const rect = e.target.getBoundingClientRect();

  modalOverlay.classList.add('show-overlay');
  modalEvents.classList.add('show-container');

  const isDailyview = e.target.closest('.day-box, .day-half-box');
  getFloatingPosition(modalEvents, rect, isDailyview);
}

export default createEventModal;
