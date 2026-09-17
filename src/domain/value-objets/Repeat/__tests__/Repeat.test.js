import { describe, expect, it } from 'vitest';
import { captureError } from '../../../../../tests/testHelpers.js';


import { ValidationDomainError } from '../../../common/domainErrors.js';
import { Day } from '../../Day/Day.js';
import { REPEAT_TYPES, Repeat } from '../Repeat.js';

function buildRepeatConfig(overrides = {}) {
  return {
    seriesId: 'series-id',
    type: 'daily',
    interval: 1,
    until: '2024-07-01',
    weekdays: [],
    customDates: [],
    exceptions: [],
    ...overrides,
  };
}

describe('Repeat', () => {
  describe('No repetition', () => {
    it('should create a Repeat without repetition from null', () => {
      const repeat = Repeat.create(null);

      expect(repeat).toBeInstanceOf(Repeat);
      expect(repeat.value).toBeNull();
    });
  });

  describe('Valid configs', () => {
    it.each(REPEAT_TYPES)(
      'should create a valid Repeat for type "%s"',
      (type) => {
        const config = buildRepeatConfig({
          type,
          customDates: type === 'custom' ? ['2024-06-15'] : [],
        });

        const repeat = Repeat.create(config);

        expect(repeat).toBeInstanceOf(Repeat);
        expect(repeat.value).toEqual(config);
      },
    );

    it('should keep the original repeat config shape', () => {
      const config = buildRepeatConfig({
        type: 'weekly',
        interval: 2,
        until: '2024-12-31',
        weekdays: [1, 3],
        customDates: [],
        exceptions: ['2024-07-01'],
      });

      const repeat = Repeat.create(config);

      expect(repeat.value).toEqual({
        seriesId: 'series-id',
        type: 'weekly',
        interval: 2,
        until: '2024-12-31',
        weekdays: [1, 3],
        customDates: [],
        exceptions: ['2024-07-01'],
      });
    });

    it('should create a valid Repeat from Day instances', () => {
      const repeat = Repeat.create(
        buildRepeatConfig({
          type: 'custom',
          until: Day.create('2024-07-01'),
          customDates: [Day.create('2024-06-15')],
          exceptions: [Day.create('2024-06-20')],
        }),
      );

      expect(repeat.value.until).toBe('2024-07-01');
      expect(repeat.value.customDates).toEqual(['2024-06-15']);
      expect(repeat.value.exceptions).toEqual(['2024-06-20']);
    });
  });

  describe('Equality checks', () => {
    it('should consider two Repeat instances with the same config as equal', () => {
      const repeat1 = Repeat.create(buildRepeatConfig());
      const repeat2 = Repeat.create(buildRepeatConfig());

      expect(repeat1.equals(repeat2)).toBe(true);
    });

    it('should consider two Repeat instances with different intervals as not equal', () => {
      const repeat1 = Repeat.create(buildRepeatConfig({ interval: 1 }));
      const repeat2 = Repeat.create(buildRepeatConfig({ interval: 2 }));

      expect(repeat1.equals(repeat2)).toBe(false);
    });

    it('should consider two Repeat instances with different exceptions as not equal', () => {
      const repeat1 = Repeat.create(buildRepeatConfig({ exceptions: [] }));
      const repeat2 = Repeat.create(
        buildRepeatConfig({ exceptions: ['2024-06-20'] }),
      );

      expect(repeat1.equals(repeat2)).toBe(false);
    });

    it('should consider a null Repeat and a config Repeat as not equal', () => {
      const repeat1 = Repeat.create(null);
      const repeat2 = Repeat.create(buildRepeatConfig());

      expect(repeat1.equals(repeat2)).toBe(false);
    });
  });

  describe('Errors', () => {
    it.each([undefined, 'daily', [], 5, true])(
      'should throw validation error if value is %j',
      (value) => {
        expect(() => Repeat.create(value)).toThrow(ValidationDomainError);
      },
    );

    it.each([undefined, '', '   ', 5, null])(
      'should throw validation error if seriesId is %j',
      (seriesId) => {
        expect(() =>
          Repeat.create(buildRepeatConfig({ seriesId })),
        ).toThrow(ValidationDomainError);
      },
    );

    it.each(['none', 'yearly', '', 5, null])(
      'should throw validation error if type is %j',
      (type) => {
        expect(() => Repeat.create(buildRepeatConfig({ type }))).toThrow(
          ValidationDomainError,
        );
      },
    );

    it.each([0, -1, 1.5, '1', null])(
      'should throw validation error if interval is %j',
      (interval) => {
        expect(() => Repeat.create(buildRepeatConfig({ interval }))).toThrow(
          ValidationDomainError,
        );
      },
    );

    it.each(['2024-13-01', '20240601', 'not-a-date', null])(
      'should throw validation error if until is %j',
      (until) => {
        const error = captureError(() =>
          Repeat.create(buildRepeatConfig({ until })),
        );

        expect(error).toBeInstanceOf(ValidationDomainError);
        expect(error.code).toBeDefined();
        expect(error.params.field).toBeDefined();
      },
    );

    it.each([[[7]], [[-1]], [[1.5]], [['1']], ['1'], [null]])(
      'should throw validation error if weekdays is %j',
      (weekdays) => {
        expect(() => Repeat.create(buildRepeatConfig({ weekdays }))).toThrow(
          ValidationDomainError,
        );
      },
    );

    it.each([[['2024-13-01']], ['2024-06-01'], [null]])(
      'should throw validation error if customDates is %j',
      (customDates) => {
        const error = captureError(() =>
          Repeat.create(buildRepeatConfig({ customDates })),
        );

        expect(error).toBeInstanceOf(ValidationDomainError);
        expect(error.code).toBeDefined();
        expect(error.params.field).toBeDefined();
      },
    );

    it('should create a custom repeat with no custom dates yet', () => {
      const repeat = Repeat.create(
        buildRepeatConfig({ type: 'custom', customDates: [] }),
      );

      expect(repeat.value.type).toBe('custom');
      expect(repeat.value.customDates).toEqual([]);
    });

    it.each([[['2024-13-01']], ['2024-06-01'], [null]])(
      'should throw validation error if exceptions is %j',
      (exceptions) => {
        const error = captureError(() =>
          Repeat.create(buildRepeatConfig({ exceptions })),
        );

        expect(error).toBeInstanceOf(ValidationDomainError);
        expect(error.code).toBeDefined();
        expect(error.params.field).toBeDefined();
      },
    );
  });
});
