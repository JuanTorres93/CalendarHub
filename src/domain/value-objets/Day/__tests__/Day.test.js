import { describe, expect, it } from 'vitest';

import { ValidationDomainError } from '../../../common/domainErrors.js';
import { Day, MAX_YEAR, MIN_YEAR } from '../Day.js';

describe('Day', () => {
  it('should create a valid Day', () => {
    const day = Day.create({ year: 2024, month: 6, day: 1 });

    expect(day).toBeInstanceOf(Day);
    expect(day.value).toBe('2024-06-01');
  });

  describe('range', () => {
    it('should create a valid Day at the minimum date', () => {
      const day = Day.create({ year: MIN_YEAR, month: 1, day: 1 });

      expect(day).toBeInstanceOf(Day);
      expect(day.value).toBe(`${MIN_YEAR}-01-01`);
    });

    it('should create a valid Day at the maximum date', () => {
      const day = Day.create({ year: MAX_YEAR, month: 12, day: 31 });

      expect(day).toBeInstanceOf(Day);
      expect(day.value).toBe(`${MAX_YEAR}-12-31`);
    });

    it('should throw validation error for year before the minimum', () => {
      expect(() => Day.create({ year: MIN_YEAR - 1, month: 1, day: 1 })).toThrow(
        ValidationDomainError,
      );
    });

    it('should throw validation error for year after the maximum', () => {
      expect(() => Day.create({ year: MAX_YEAR + 1, month: 12, day: 31 })).toThrow(
        ValidationDomainError,
      );
    });

    it('should throw validation error for month 0', () => {
      expect(() => Day.create({ year: 2024, month: 0, day: 1 })).toThrow(
        ValidationDomainError,
      );
    });

    it('should throw validation error for month 13', () => {
      expect(() => Day.create({ year: 2024, month: 13, day: 1 })).toThrow(
        ValidationDomainError,
      );
    });

    it('should throw validation error for day 0', () => {
      expect(() => Day.create({ year: 2024, month: 1, day: 0 })).toThrow(
        ValidationDomainError,
      );
    });

    it('should throw validation error for day 32', () => {
      expect(() => Day.create({ year: 2024, month: 1, day: 32 })).toThrow(
        ValidationDomainError,
      );
    });

    it('should throw validation error for day 31 in a 30-day month', () => {
      expect(() => Day.create({ year: 2024, month: 4, day: 31 })).toThrow(
        ValidationDomainError,
      );
    });
  });

  describe('leap years', () => {
    it('should create a valid Day for February 29 in a leap year', () => {
      const day = Day.create({ year: 2024, month: 2, day: 29 });

      expect(day).toBeInstanceOf(Day);
      expect(day.value).toBe('2024-02-29');
    });

    it('should throw validation error for February 29 in a non-leap year', () => {
      expect(() => Day.create({ year: 2023, month: 2, day: 29 })).toThrow(
        ValidationDomainError,
      );
    });

    it('should create a valid Day for February 28 in a non-leap year', () => {
      const day = Day.create({ year: 2023, month: 2, day: 28 });

      expect(day).toBeInstanceOf(Day);
      expect(day.value).toBe('2023-02-28');
    });
  });

  describe('YYYY-MM-DD string input', () => {
    it('should create a Day from a YYYY-MM-DD string', () => {
      const day = Day.create('2024-06-01');

      expect(day).toBeInstanceOf(Day);
      expect(day.value).toBe('2024-06-01');
    });

    it('should consider a Day created from string equal to one created from props', () => {
      const day1 = Day.create('2024-06-01');
      const day2 = Day.create({ year: 2024, month: 6, day: 1 });

      expect(day1.equals(day2)).toBe(true);
    });

    it.each([
      '2024-6-01',
      '2024-06-1',
      '24-06-01',
      '2024/06/01',
      '2024-13-01',
      '2024-00-01',
      '2024-01-00',
      '2023-02-29',
      '',
    ])('should throw validation error for string "%s"', (value) => {
      expect(() => Day.create(value)).toThrow(ValidationDomainError);
    });
  });

  describe('Equality checks', () => {
    it('should consider two Day instances with the same value as equal', () => {
      const day1 = Day.create('2024-06-01');
      const day2 = Day.create('2024-06-01');

      expect(day1.equals(day2)).toBe(true);
    });

    it('should consider two Day instances with different values as not equal', () => {
      const day1 = Day.create('2024-06-01');
      const day2 = Day.create('2024-06-02');

      expect(day1.equals(day2)).toBe(false);
    });
  });

  describe('Errors', () => {
    it.each([-1, 999, 10000, 2024.5, '2024', null, undefined])(
      'should throw validation error for year "%s"',
      (year) => {
        expect(() => Day.create({ year, month: 6, day: 1 })).toThrow(
          ValidationDomainError,
        );
      },
    );

    it.each([0, 13, 6.5, '06', null, undefined])(
      'should throw validation error for month "%s"',
      (month) => {
        expect(() => Day.create({ year: 2024, month, day: 1 })).toThrow(
          ValidationDomainError,
        );
      },
    );

    it.each([0, 32, 1.5, '01', null, undefined])(
      'should throw validation error for day "%s"',
      (day) => {
        expect(() => Day.create({ year: 2024, month: 6, day })).toThrow(
          ValidationDomainError,
        );
      },
    );

    it('should throw validation error if value is not an object or string', () => {
      expect(() => Day.create(5)).toThrow(ValidationDomainError);
    });
  });
});