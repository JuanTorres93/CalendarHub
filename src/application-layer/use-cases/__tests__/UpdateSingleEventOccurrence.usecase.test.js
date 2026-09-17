import { beforeEach, describe, expect, it } from 'vitest';

import { LocalStorageEventsRepo } from '../../../infra/repos/LocalStorageEventsRepo/LocalStorageEventsRepo.js';
import { CryptoUUIDIdGenerator } from '../../../infra/services/CryptoUUIDIdGenerator/CryptoUUIDIdGenerator.js';
import { EVENT_TEST_PROPS } from '../../../domain/entities/event/__tests__/eventTestProps.js';
import { createTestEvent } from '../../../domain/entities/event/__tests__/eventTestProps.js';
import { NotFoundDomainError } from '../../../domain/common/domainErrors.js';

import { UpdateSingleEventOccurrenceUsecase } from '../UpdateSingleEventOccurrence.usecase.js';

describe('UpdateSingleEventOccurrenceUsecase', () => {
  let eventsRepo;
  let idGenerator;
  let updateSingleEventOccurrenceUsecase;

  beforeEach(() => {
    localStorage.clear();

    eventsRepo = new LocalStorageEventsRepo();
    idGenerator = new CryptoUUIDIdGenerator();
    updateSingleEventOccurrenceUsecase = new UpdateSingleEventOccurrenceUsecase(
      eventsRepo,
      idGenerator,
    );
  });

  describe('execute', () => {
    it('should add the occurrence to the mother exceptions and create the independent event', () => {
      const motherEvent = createTestEvent({
        id: 'mother-id',
        repeat: {
          seriesId: 'series-1',
          type: 'daily',
          interval: 1,
          weekdays: [],
          customDates: [],
          exceptions: ['2026-09-16'],
          until: '2026-09-20',
        },
      });
      eventsRepo.save(motherEvent);

      const { date, ...rawProps } = EVENT_TEST_PROPS;

      const newEvent = updateSingleEventOccurrenceUsecase.execute({
        motherEventId: motherEvent.id,
        occurrenceDate: '2026-09-15',
        eventRawProps: { ...rawProps, title: 'Edited occurrence' },
      });

      const savedMother = eventsRepo.getById(motherEvent.id);

      expect(savedMother.repeat.exceptions).toEqual([
        '2026-09-16',
        '2026-09-15',
      ]);

      expect(newEvent.title).toBe('Edited occurrence');
      expect(newEvent.date).toBe('2026-09-15');
      expect(newEvent.repeat).toBeNull();
      expect(eventsRepo.getById(newEvent.id)).not.toBeNull();
    });

    it('should throw NotFoundDomainError when the mother event does not exist', () => {
      expect(() =>
        updateSingleEventOccurrenceUsecase.execute({
          motherEventId: 'non-existent-id',
          occurrenceDate: '2026-09-15',
          eventRawProps: { ...EVENT_TEST_PROPS },
        }),
      ).toThrow(NotFoundDomainError);
    });
  });
});