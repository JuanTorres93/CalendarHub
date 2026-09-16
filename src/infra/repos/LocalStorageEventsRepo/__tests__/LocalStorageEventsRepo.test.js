import { beforeEach, describe, expect, it } from 'vitest';

import { LocalStorageEventsRepo } from '../LocalStorageEventsRepo.js';
import { Event } from '../../../../domain/entities/event/Event.js';

const createTestEvent = (overrides = {}) =>
  Event.create({
    id: 'test-event-id',
    title: 'Test event',
    description: 'Test event description',
    date: '2026-09-14',
    from: '10:00',
    to: '11:00',
    icon: '✏️',
    color: 'blue',
    urgent: false,
    allDay: false,
    notification: '5min',
    repeat: null,
    ...overrides,
  });

describe('LocalStorageEventsRepo', () => {
  let repo;
  let event;

  beforeEach(async () => {
    localStorage.clear();

    repo = new LocalStorageEventsRepo();

    event = createTestEvent();

    await repo.save(event);
  });

  describe('getById', () => {
    it('should return the event with the given id', async () => {
      const fetchedEvent = await repo.getById(event.id);

      expect(fetchedEvent.toJSON()).toEqual(event.toJSON());
    });

    it('should return null if no event is found with the given id', async () => {
      const fetchedEvent = await repo.getById('non-existent-event-id');

      expect(fetchedEvent).toBeNull();
    });
  });

  describe('save', () => {
    it('should save a new event', async () => {
      const newEvent = createTestEvent({
        id: 'new-event-id',
        title: 'New event',
      });

      await repo.save(newEvent);

      const fetchedEvent = await repo.getById(newEvent.id);

      expect(fetchedEvent.toJSON()).toEqual(newEvent.toJSON());
    });

    it('should update an existing event with the same id', async () => {
      const updatedEvent = createTestEvent({
        id: event.id,
        title: 'Updated event',
      });

      await repo.save(updatedEvent);

      const fetchedEvent = await repo.getById(event.id);

      expect(fetchedEvent.toJSON()).toEqual(updatedEvent.toJSON());
    });

    it('should keep the repeat config when saving an event', async () => {
      const repeatConfig = {
        seriesId: 'series-id',
        type: 'weekly',
        interval: 1,
        until: '2026-10-01',
        weekdays: [1, 3],
        customDates: [],
        exceptions: [],
      };
      const repeatedEvent = createTestEvent({
        id: 'repeated-event-id',
        repeat: repeatConfig,
      });

      await repo.save(repeatedEvent);

      const fetchedEvent = await repo.getById(repeatedEvent.id);

      expect(fetchedEvent.repeat).toEqual(repeatConfig);
    });
  });

  describe('deleteById', () => {
    it('should delete the event with the given id', async () => {
      await repo.deleteById(event.id);

      const fetchedEvent = await repo.getById(event.id);

      expect(fetchedEvent).toBeNull();
    });

    it('should not fail when deleting a non-existing event', async () => {
      await repo.deleteById('non-existent-event-id');

      const fetchedEvent = await repo.getById(event.id);

      expect(fetchedEvent.toJSON()).toEqual(event.toJSON());
    });
  });
});