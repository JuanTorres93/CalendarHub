import { beforeEach, describe, expect, it } from 'vitest';

import { LocalStorageEventsRepo } from '../LocalStorageEventsRepo.js';
import { createTestEvent } from '../../../../domain/entities/event/__tests__/eventTestProps.js';

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

    it('should map legacy events with Italian notification to domain', async () => {
      localStorage.clear();

      localStorage.setItem(
        'calendarEvents',
        JSON.stringify([
          {
            id: 'legacy-event-id',
            title: 'Legacy event',
            date: '2026-09-14',
            from: '10:00',
            to: '11:00',
            description: '',
            icon: '✏️',
            color: 'blue',
            urgent: false,
            allDay: false,
            notification: '5 minuti prima',
            repeat: null,
          },
        ]),
      );

      const fetchedEvent = await repo.getById('legacy-event-id');

      expect(fetchedEvent.notification).toBe('5min');
    });
  });

  describe('getAll', () => {
    it('should return all saved events', async () => {
      const secondEvent = createTestEvent({
        id: 'second-event-id',
        title: 'Second event',
      });

      await repo.save(secondEvent);

      const fetchedEvents = await repo.getAll();

      expect(
        fetchedEvents.map((fetchedEvent) => fetchedEvent.toJSON()),
      ).toEqual([event.toJSON(), secondEvent.toJSON()]);
    });

    it('should return an empty array if no events are saved', async () => {
      localStorage.clear();

      const emptyRepo = new LocalStorageEventsRepo();

      const fetchedEvents = await emptyRepo.getAll();

      expect(fetchedEvents).toEqual([]);
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

  describe('saveMultiple', () => {
    it('should save multiple events', async () => {
      const secondEvent = createTestEvent({
        id: 'second-event-id',
        title: 'Second event',
      });

      await repo.saveMultiple([event, secondEvent]);

      const fetchedEvent = await repo.getById(event.id);
      const fetchedSecondEvent = await repo.getById(secondEvent.id);

      expect(fetchedEvent.toJSON()).toEqual(event.toJSON());
      expect(fetchedSecondEvent.toJSON()).toEqual(secondEvent.toJSON());
    });

    it('should replace the stored events with the given ones', async () => {
      const replacementEvent = createTestEvent({
        id: 'replacement-event-id',
        title: 'Replacement event',
      });

      await repo.saveMultiple([replacementEvent]);

      const fetchedEvent = await repo.getById(event.id);
      const fetchedReplacementEvent = await repo.getById(replacementEvent.id);

      expect(fetchedEvent).toBeNull();
      expect(fetchedReplacementEvent.toJSON()).toEqual(
        replacementEvent.toJSON(),
      );
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
