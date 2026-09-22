import { createEventRepeatModal } from '../eventRepeatModal.js';
import { createCurrentEventMode } from './subcomponents/currentEventMode.js';
import { createShowDate } from './subcomponents/showDate.js';
import { createEventDescription } from './subcomponents/eventDescription.js';
import { createCategorySelector } from './subcomponents/categorySelector.js';
import { createDateRow } from './subcomponents/dateRow.js';
import { createTimeRow } from './subcomponents/timeRow.js';
import { createNotificationRow } from './subcomponents/notificationRow.js';
import getFloatingPosition from '../../../../utils/helpers/floatingPositioner.js';

export function createEventModal() {
  const fragment = document.createDocumentFragment();

  const overlay = document.createElement('div');
  overlay.classList.add('modal-overlay');
  overlay.setAttribute('aria-hidden', 'true');

  const eventContainer = document.createElement('section');
  eventContainer.className = 'event-container';
  eventContainer.setAttribute('role', 'dialog');
  eventContainer.setAttribute('aria-modal', 'true');
  eventContainer.setAttribute('aria-labelledby', 'event-modal-title');
  eventContainer.setAttribute('aria-describedby', 'event-modal-description');
  eventContainer.setAttribute('data-testid', 'event-popup-container');

  const currentEventMode = createCurrentEventMode();
  eventContainer.appendChild(currentEventMode.mainComponent);

  const eventForm = document.createElement('form');
  eventForm.className = 'event-form';
  eventForm.setAttribute('data-testid', 'event-form');

  const showDate = createShowDate();
  eventForm.appendChild(showDate.mainComponent);

  const eventDescription = createEventDescription();
  eventForm.appendChild(eventDescription.mainComponent);

  const categorySelector = createCategorySelector();
  eventForm.appendChild(categorySelector.mainComponent);

  const dateRow = createDateRow();
  eventForm.appendChild(dateRow.mainComponent);

  const timeRow = createTimeRow();
  eventForm.appendChild(timeRow.mainComponent);

  const notificationRow = createNotificationRow();
  eventForm.appendChild(notificationRow.mainComponent);

  eventForm.appendChild(createEventRepeatModal());

  const repeatOverlay = document.createElement('div');
  repeatOverlay.className = 'repeat-overlay';
  repeatOverlay.setAttribute('aria-hidden', 'true');

  eventForm.appendChild(repeatOverlay);
  eventContainer.appendChild(eventForm);

  fragment.appendChild(overlay);
  fragment.appendChild(eventContainer);

  const internalDomElements = {
    modalOverlay: overlay,
    modalEvents: eventContainer,
    eventForm,
    ...currentEventMode.internalDomElements,
    ...showDate.internalDomElements,
    ...eventDescription.internalDomElements,
    ...categorySelector.internalDomElements,
    ...dateRow.internalDomElements,
    ...timeRow.internalDomElements,
    ...notificationRow.internalDomElements,
    repeatOverlay,
  };

  return { fragment, internalDomElements };
}

export function openEventModal(e, eventModalDomElements) {
  const rect = e.target.getBoundingClientRect();
  eventModalDomElements.modalOverlay.classList.add('show-overlay');
  eventModalDomElements.modalEvents.classList.add('show-container');
  const isDailyview = e.target.closest('.day-box, .day-half-box');
  getFloatingPosition(eventModalDomElements.modalEvents, rect, isDailyview);
}

export default createEventModal;