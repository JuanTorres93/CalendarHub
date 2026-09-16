import { beforeEach, describe, expect, it } from 'vitest';

import { LocalStorageEventsRepo } from '../../../infra/repos/LocalStorageEventsRepo/LocalStorageEventsRepo.js';
import { Event } from '../../../domain/entities/event/Event.js';
import { createTestEvent } from '../../../domain/entities/event/__tests__/eventTestProps.js';

import { GetAllEventsUsecase } from '../GetAllEvents.usecase.js';

describe('GetAllEventsUsecase', () => {
  let eventsRepo;
  let getAllEventsUsecase;

  beforeEach(() => {
    localStorage.clear();

    eventsRepo = new LocalStorageEventsRepo();
    getAllEventsUsecase = new GetAllEventsUsecase(eventsRepo);
  });

  describe('execute', () => {
    it('should return all events', () => {
      const event = createTestEvent();
      const secondEvent = createTestEvent({
        id: 'second-event-id',
        title: 'Second event',
      });

      eventsRepo.save(event);
      eventsRepo.save(secondEvent);

      const result = getAllEventsUsecase.execute();

      expect(result.map((fetchedEvent) => fetchedEvent.toJSON())).toEqual([
        event.toJSON(),
        secondEvent.toJSON(),
      ]);
    });

    it('should return an empty array when no events are saved', () => {
      const result = getAllEventsUsecase.execute();

      expect(result).toEqual([]);
    });

    it('should return event entities', () => {
      const event = createTestEvent();

      eventsRepo.save(event);

      const result = getAllEventsUsecase.execute();

      result.forEach((fetchedEvent) => {
        expect(fetchedEvent).toBeInstanceOf(Event);
      });
    });
  });
});
