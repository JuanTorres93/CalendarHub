import { describe, expect, it } from 'vitest';

import { ValidationDomainError } from '../../../common/domainErrors.js';
import { Day } from '../../Day/Day.js';
import { Repeat, REPEAT_FREQUENCIES } from '../Repeat.js';

describe('Repeat', () => {
  describe('Frequencies', () => {
    it.each(REPEAT_FREQUENCIES.map((frequency) => [frequency, frequency]))(
      'should create a valid Repeat for "%s"',
      (frequency) => {
        const repeat = Repeat.create(frequency);

        expect(repeat).toBeInstanceOf(Repeat);
        expect(repeat.frequency).toBe(frequency);
        expect(repeat.customDates).toBeNull();
      },
    );
  });

  describe('Custom dates', () => {
    it('should create a valid Repeat from an array of dates', () => {
      const repeat = Repeat.create(['2024-06-01', '2024-06-15']);

      expect(repeat).toBeInstanceOf(Repeat);
      expect(repeat.frequency).toBeNull();
      expect(repeat.customDates).toHaveLength(2);
      expect(repeat.customDates[0]).toBeInstanceOf(Day);
      expect(repeat.customDates[0].value).toBe('2024-06-01');
      expect(repeat.customDates[1].value).toBe('2024-06-15');
    });

    it('should create a valid Repeat from an array of Day instances', () => {
      const day1 = Day.create('2024-06-01');
      const day2 = Day.create('2024-06-15');

      const repeat = Repeat.create([day1, day2]);

      expect(repeat).toBeInstanceOf(Repeat);
      expect(repeat.customDates[0].value).toBe(day1.value);
      expect(repeat.customDates[1].value).toBe(day2.value);
    });
  });

  describe('Equality checks', () => {
    it('should consider two Repeat instances with the same frequency as equal', () => {
      const repeat1 = Repeat.create('daily');
      const repeat2 = Repeat.create('daily');

      expect(repeat1.equals(repeat2)).toBe(true);
    });

    it('should consider two Repeat instances with different frequencies as not equal', () => {
      const repeat1 = Repeat.create('daily');
      const repeat2 = Repeat.create('weekly');

      expect(repeat1.equals(repeat2)).toBe(false);
    });

    it('should consider two Repeat instances with the same custom dates as equal', () => {
      const repeat1 = Repeat.create(['2024-06-01', '2024-06-15']);
      const repeat2 = Repeat.create([
        Day.create('2024-06-01'),
        '2024-06-15',
      ]);

      expect(repeat1.equals(repeat2)).toBe(true);
    });

    it('should consider two Repeat instances with different custom dates as not equal', () => {
      const repeat1 = Repeat.create(['2024-06-01']);
      const repeat2 = Repeat.create(['2024-06-02']);

      expect(repeat1.equals(repeat2)).toBe(false);
    });

    it('should consider a frequency Repeat and a custom dates Repeat as not equal', () => {
      const repeat1 = Repeat.create('daily');
      const repeat2 = Repeat.create(['2024-06-01']);

      expect(repeat1.equals(repeat2)).toBe(false);
    });
  });

  describe('Errors', () => {
    it.each(['yearly', 'custom', '', null, undefined, 5, {}])(
      'should throw validation error for "%s"',
      (value) => {
        expect(() => Repeat.create(value)).toThrow(ValidationDomainError);
      },
    );

    it('should throw validation error for an empty array of dates', () => {
      expect(() => Repeat.create([])).toThrow(ValidationDomainError);
    });

    it('should throw validation error if the array contains an invalid date', () => {
      expect(() => Repeat.create(['2024-13-01'])).toThrow(
        ValidationDomainError,
      );
    });
  });
});