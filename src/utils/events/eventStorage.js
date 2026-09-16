import { AppEventsRepo } from '../../interface-adapters/repos/AppEventsRepo.js';
import { Event } from '../../domain/entities/event/Event.js';
import { createMessage } from '../helpers/createElement.js';
import { modalEvents } from '../helpers/dom/eventModalDom.js';
import {
  toDomainNotification,
  toDomainNotificationIfItalian,
  toItalianNotification,
} from '../../interface-adapters/other/bidirectionalItalianDomainMapper.js';

export function getEvents() {
  try {
    return AppEventsRepo.getAll().map((eventEntity) => ({
      ...eventEntity.toJSON(),
      notification: toItalianNotification(eventEntity.notification),
    }));
  } catch (error) {
    console.error('Unable to read calendar events from localStorage:', error);
    return [];
  }
}

export function saveEventsInLocalStorage(events) {
  const eventEntities = events.map((event) =>
    Event.create({
      ...event,
      notification: toDomainNotificationIfItalian(event.notification),
    }),
  );

  try {
    AppEventsRepo.saveMultiple(eventEntities);

    return true;
  } catch (error) {
    console.error('Failed to save calendar events in localStorage:', error);
    createMessage(
      'Salvataggio non riuscito. Il browser non ha potuto memorizzare gli eventi.',
      modalEvents,
      document.body,
    );

    return false;
  }
}

export function deleteEventFromLocalStorage(currentId) {
  const events = getEvents();
  const updatedEvents = events.filter((event) => event.id !== currentId);

  saveEventsInLocalStorage(updatedEvents);
}

function isValidEvent(event) {
  try {
    const validatedEvent = Event.create({
      ...event.props,
      id: 'fake-id',
      title: 'TODO REMOVE THIS WHEN REFACTOR FINISHED',
    });
    validatedEvent.updateIdDuringRefactor(event.id);
  } catch (error) {
    return false;
  }

  return true;
}
