import { Event } from '../../domain/entities/event/Event.js';
import { createMessage } from '../helpers/createElement.js';
import { modalEvents } from '../helpers/dom/eventModalDom.js';

export function getEvents() {
  try {
    const storedEvents = localStorage.getItem('calendarEvents');

    if (!storedEvents) return [];

    const parsedEvents = JSON.parse(storedEvents);

    if (!Array.isArray(parsedEvents)) return [];

    return parsedEvents.filter((event, index) => {
      const isValid = isValidEvent(event);

      if (!isValid) {
        console.warn(`Invalid event at index ${index} in localStorage`);
      }

      return isValid;
    });
  } catch (error) {
    console.error('Unable to read calendar events from localStorage:', error);
    return [];
  }
}

export function saveEventsInLocalStorage(events) {
  if (!Array.isArray(events)) {
    createMessage(
      'Salvataggio non riuscito: formato dei dati non valido.',
      modalEvents,
      document.body,
    );
    return false;
  }

  const hasValidEvents = events.every(isValidEvent);

  if (!hasValidEvents) {
    createMessage(
      'Salvataggio non riuscito: i dati degli eventi non sono validi.',
      modalEvents,
      document.body,
    );
    return false;
  }

  try {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
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
