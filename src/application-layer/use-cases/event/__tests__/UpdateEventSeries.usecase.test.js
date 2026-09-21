import { beforeEach, describe, expect, it } from 'vitest';
import { captureError } from '../../../../../tests/testHelpers.js';


import { LocalStorageEventsRepo } from '../../../../infra/repos/LocalStorageEventsRepo/LocalStorageEventsRepo.js';
import { createTestEvent } from '../../../../domain/entities/event/__tests__/eventTestProps.js';
import { NotFoundDomainError } from '../../../../domain/common/domainErrors.js';

import { UpdateEventSeriesUsecase } from '../UpdateEventSeries.usecase.js';

const seriesRepeat = {
  seriesId: 'series-1',
  type: 'daily',
  interval: 1,
  weekdays: [],
  customDates: [],
  exceptions: ['2026-09-17'],
  until: '2026-09-20',
};

const createSeriesEvent = () =>
  createTestEvent({ id: 'series-id', repeat: seriesRepeat });

describe('UpdateEventSeriesUsecase', () => {
  let eventsRepo;
  let updateEventSeriesUsecase;

  beforeEach(() => {
    localStorage.clear();

    eventsRepo = new LocalStorageEventsRepo();
    updateEventSeriesUsecase = new UpdateEventSeriesUsecase(eventsRepo);
  });

  describe('execute', () => {
    it('should update the series keeping the exceptions when the pattern is unchanged', () => {
      const seriesEvent = createSeriesEvent();
      eventsRepo.save(seriesEvent);

      const updatedEvent = updateEventSeriesUsecase.execute({
        id: seriesEvent.id,
        originalRepeat: seriesEvent.repeat,
        originalDate: seriesEvent.date,
        eventRawProps: { title: 'Updated series' },
      });

      expect(updatedEvent.title).toBe('Updated series');
      expect(updatedEvent.repeat.exceptions).toEqual(['2026-09-17']);
    });

    it('should clear the exceptions when the repeat pattern changes', () => {
      const seriesEvent = createSeriesEvent();
      eventsRepo.save(seriesEvent);

      const updatedEvent = updateEventSeriesUsecase.execute({
        id: seriesEvent.id,
        originalRepeat: seriesEvent.repeat,
        originalDate: seriesEvent.date,
        eventRawProps: {
          title: 'Updated series',
          repeat: {
            seriesId: 'series-1',
            type: 'weekly',
            interval: 1,
            weekdays: [1, 3],
            customDates: [],
            until: '2026-09-27',
          },
        },
      });

      expect(updatedEvent.repeat.type).toBe('weekly');
      expect(updatedEvent.repeat.exceptions).toEqual([]);
    });

    it('should clear the exceptions when the date changes', () => {
      const seriesEvent = createSeriesEvent();
      eventsRepo.save(seriesEvent);

      const updatedEvent = updateEventSeriesUsecase.execute({
        id: seriesEvent.id,
        originalRepeat: seriesEvent.repeat,
        originalDate: seriesEvent.date,
        eventRawProps: { date: '2026-09-16' },
      });

      expect(updatedEvent.date).toBe('2026-09-16');
      expect(updatedEvent.repeat.exceptions).toEqual([]);
    });

    it('should throw NotFoundDomainError when the series does not exist', () => {
      const error = captureError(() =>
        updateEventSeriesUsecase.execute({
          id: 'non-existent-id',
          originalRepeat: createSeriesEvent().repeat,
          originalDate: '2026-09-14',
          eventRawProps: { title: 'Updated series' },
        }),
      );

      expect(error).toBeInstanceOf(NotFoundDomainError);
      expect(error.code).toBeDefined();
      expect(error.params.id).toBeDefined();
    });
  });
});