import { EventsRepo } from '../../../application-layer/repos/EventsRepo.port.js';
import { Event } from '../../../domain/entities/event/Event.js';

const STORAGE_KEY = 'calendarEvents';

export class LocalStorageEventsRepo extends EventsRepo {
  getById(id) {
    const storedEvents = readEvents();

    const storedEvent = storedEvents.find((event) => event.id === id);

    if (!storedEvent) {
      return null;
    }

    return Event.create(storedEvent);
  }

  getAll() {
    return readEvents().map((storedEvent) => Event.create(storedEvent));
  }

  save(event) {
    const storedEvents = readEvents();
    const eventData = event.toJSON();

    const existingEventIndex = storedEvents.findIndex(
      (storedEvent) => storedEvent.id === event.id,
    );

    if (existingEventIndex === -1) {
      storedEvents.push(eventData);
    } else {
      storedEvents[existingEventIndex] = eventData;
    }

    writeEvents(storedEvents);
  }

  saveMultiple(events) {
    writeEvents(events.map((event) => event.toJSON()));
  }

  deleteById(id) {
    const storedEvents = readEvents();

    writeEvents(storedEvents.filter((storedEvent) => storedEvent.id !== id));
  }

  clearAllForTesting() {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function readEvents() {
  const storedEvents = localStorage.getItem(STORAGE_KEY);

  if (!storedEvents) {
    return [];
  }

  try {
    const parsedEvents = JSON.parse(storedEvents);

    return Array.isArray(parsedEvents) ? parsedEvents : [];
  } catch {
    return [];
  }
}

function writeEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}
