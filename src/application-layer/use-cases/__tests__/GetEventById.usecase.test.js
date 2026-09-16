import { beforeEach, describe, expect, it } from 'vitest';

import { LocalStorageEventsRepo } from '../../../infra/repos/LocalStorageEventsRepo/LocalStorageEventsRepo.js';
import { Event } from '../../../domain/entities/event/Event.js';
import { NotFoundDomainError } from '../../../domain/common/domainErrors.js';

import { GetEventByIdUsecase } from '../GetEventById.usecase.js';
import { createTestEvent } from '../../../domain/entities/event/__tests__/eventTestProps.js';

describe('GetEventByIdUsecase', () => {
  let eventsRepo;
  let getEventByIdUsecase;

  beforeEach(() => {
    localStorage.clear();

    eventsRepo = new LocalStorageEventsRepo();
    getEventByIdUsecase = new GetEventByIdUsecase(eventsRepo);
  });

  describe('execute', () => {
    it('should return the event when found', () => {
      const event = createTestEvent();

      eventsRepo.save(event);

      const result = getEventByIdUsecase.execute({ id: event.id });

      expect(result).toBeInstanceOf(Event);
      expect(result.toJSON()).toEqual(event.toJSON());
    });

    it('should throw NotFoundDomainError when the event is not found', () => {
      expect(() =>
        getEventByIdUsecase.execute({ id: 'non-existent-event-id' }),
      ).toThrow(NotFoundDomainError);
    });
  });
});
