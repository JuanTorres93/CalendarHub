import { beforeEach, describe, expect, it } from 'vitest';

import { LocalStorageEventsRepo } from '../../../infra/repos/LocalStorageEventsRepo/LocalStorageEventsRepo.js';
import { CryptoUUIDIdGenerator } from '../../../infra/services/CryptoUUIDIdGenerator/CryptoUUIDIdGenerator.js';
import { Event } from '../../../domain/entities/event/Event.js';
import { EVENT_TEST_PROPS } from '../../../domain/entities/event/__tests__/eventTestProps.js';

import { CreateEventUsecase } from '../CreateEvent.usecase.js';

describe('CreateEventUsecase', () => {
  let eventsRepo;
  let idGenerator;
  let createEventUsecase;
  let event;
  let eventRequest;

  beforeEach(() => {
    localStorage.clear();

    eventsRepo = new LocalStorageEventsRepo();
    idGenerator = new CryptoUUIDIdGenerator();
    createEventUsecase = new CreateEventUsecase(eventsRepo, idGenerator);

    const { id, ...rest } = EVENT_TEST_PROPS;
    eventRequest = rest;

    event = createEventUsecase.execute({ ...eventRequest });
  });

  describe('execute', () => {
    it('should create the event', () => {
      expect(event).toBeInstanceOf(Event);
      expect(event.id).toBeDefined();
      expect(event.title).toBe(eventRequest.title);
      expect(event.description).toBe(eventRequest.description);
      expect(event.date).toBe(eventRequest.date);
      expect(event.from).toBe(eventRequest.from);
      expect(event.to).toBe(eventRequest.to);
      expect(event.icon).toBe(eventRequest.icon);
      expect(event.color).toBe(eventRequest.color);
      expect(event.urgent).toBe(eventRequest.urgent);
      expect(event.allDay).toBe(eventRequest.allDay);
      expect(event.notification).toBe(eventRequest.notification);
      expect(event.repeat).toBeNull();
    });

    it('should persist the event in the repo', () => {
      const savedEvent = eventsRepo.getById(event.id);

      expect(savedEvent).not.toBeNull();
      expect(savedEvent.toJSON()).toEqual(event.toJSON());
    });
  });
});