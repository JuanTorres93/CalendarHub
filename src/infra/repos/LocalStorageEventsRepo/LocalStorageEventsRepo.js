import { EventsRepo } from '../../../application-layer/repos/EventsRepo.port.js';
import { Event } from '../../../domain/entities/event/Event.js';
import { toDomainNotificationIfItalian } from '../../../interface-adapters/other/bidirectionalItalianDomainMapper.js';

const STORAGE_KEY = 'calendarEvents';

export class LocalStorageEventsRepo extends EventsRepo {
  getById(id) {
    const storedEvent = readRawEvents().find((event) => event.id === id);

    return storedEvent ? Event.create(storedEvent) : null;
  }

  getAll() {
    return readRawEvents().map((storedEvent) => Event.create(storedEvent));
  }

  save(event) {
    const storedEvents = readRawEvents();
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
    const storedEvents = readRawEvents();

    writeEvents(storedEvents.filter((storedEvent) => storedEvent.id !== id));
  }

  clearAllForTesting() {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function readRawEvents() {
  const storedEvents = localStorage.getItem(STORAGE_KEY);

  if (!storedEvents) {
    return [];
  }

  try {
    const parsedEvents = JSON.parse(storedEvents);

    if (!Array.isArray(parsedEvents)) return [];

    // MAP TEMPORARILY FROM ITALIAN TO DOMAIN
    return parsedEvents.map((event) => ({
      ...event,
      notification: toDomainNotificationIfItalian(event.notification),
    }));
  } catch {
    return [];
  }
}

function writeEvents(events) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}
