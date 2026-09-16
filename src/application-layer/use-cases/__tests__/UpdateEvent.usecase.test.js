import { beforeEach, describe, expect, it } from 'vitest';

import { LocalStorageEventsRepo } from '../../../infra/repos/LocalStorageEventsRepo/LocalStorageEventsRepo.js';
import { Event } from '../../../domain/entities/event/Event.js';
import { EVENT_TEST_PROPS } from '../../../domain/entities/event/__tests__/eventTestProps.js';
import { NotFoundDomainError } from '../../../domain/common/domainErrors.js';

import { UpdateEventUsecase } from '../UpdateEvent.usecase.js';

describe('UpdateEventUsecase', () => {
  let eventsRepo;
  let updateEventUsecase;
  let event;

  beforeEach(() => {
    localStorage.clear();

    eventsRepo = new LocalStorageEventsRepo();
    updateEventUsecase = new UpdateEventUsecase(eventsRepo);

    event = Event.create(EVENT_TEST_PROPS);
    eventsRepo.save(event);
  });

  describe('execute', () => {
    it('should update the event fields', () => {
      const updatedEvent = updateEventUsecase.execute({
        id: event.id,
        eventRawProps: { title: 'Updated title' },
      });

      expect(updatedEvent.id).toBe(event.id);
      expect(updatedEvent.title).toBe('Updated title');
      expect(updatedEvent.description).toBe(event.description);
    });

    it('should persist the updated event in the repo', () => {
      const updatedEvent = updateEventUsecase.execute({
        id: event.id,
        eventRawProps: { description: 'Updated description' },
      });

      const savedEvent = eventsRepo.getById(event.id);

      expect(savedEvent).not.toBeNull();
      expect(savedEvent.toJSON()).toEqual(updatedEvent.toJSON());
    });

    it('should throw NotFoundDomainError when the event does not exist', () => {
      expect(() =>
        updateEventUsecase.execute({
          id: 'non-existent-event-id',
          eventRawProps: { title: 'Updated title' },
        }),
      ).toThrow(NotFoundDomainError);
    });
  });
});