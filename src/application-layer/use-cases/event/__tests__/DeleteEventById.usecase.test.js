import { beforeEach, describe, expect, it } from 'vitest';

import { LocalStorageEventsRepo } from '../../../../infra/repos/LocalStorageEventsRepo/LocalStorageEventsRepo.js';
import { Event } from '../../../../domain/entities/event/Event.js';

import { DeleteEventByIdUsecase } from '../DeleteEventById.usecase.js';
import { createTestEvent } from '../../../../domain/entities/event/__tests__/eventTestProps.js';

describe('DeleteEventByIdUsecase', () => {
  let eventsRepo;
  let deleteEventByIdUsecase;

  beforeEach(() => {
    localStorage.clear();

    eventsRepo = new LocalStorageEventsRepo();
    deleteEventByIdUsecase = new DeleteEventByIdUsecase(eventsRepo);
  });

  describe('execute', () => {
    it('should delete the event with the given id', () => {
      const event = createTestEvent();

      eventsRepo.save(event);

      deleteEventByIdUsecase.execute({ id: event.id });

      expect(eventsRepo.getById(event.id)).toBeNull();
    });

    it('should not fail when the event does not exist', () => {
      expect(() =>
        deleteEventByIdUsecase.execute({ id: 'non-existent-event-id' }),
      ).not.toThrow();
    });
  });
});
