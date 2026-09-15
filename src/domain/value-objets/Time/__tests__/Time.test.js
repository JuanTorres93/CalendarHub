import { describe, expect, it } from 'vitest';

import { ValidationDomainError } from '../../../common/domainErrors.js';
import { MAX_TIME, MIN_TIME, Time } from '../Time.js';

describe('Time', () => {
  it('should create a valid Time', () => {
    const time = Time.create({ hours: 10, minutes: 30 });

    expect(time).toBeInstanceOf(Time);
  });

  describe('range 00:00 - 23:59', () => {
    it('should create a valid Time at the minimum 00:00', () => {
      const time = Time.create(MIN_TIME);

      expect(time).toBeInstanceOf(Time);
      expect(time.value).toBe('00:00');
    });

    it('should create a valid Time at the maximum 23:59', () => {
      const time = Time.create(MAX_TIME);

      expect(time).toBeInstanceOf(Time);
      expect(time.value).toBe('23:59');
    });

    it('should throw validation error for 23:60', () => {
      expect(() => Time.create({ hours: 23, minutes: 60 })).toThrow(
        ValidationDomainError,
      );
    });

    it('should throw validation error for 24:00', () => {
      expect(() => Time.create({ hours: 24, minutes: 0 })).toThrow(
        ValidationDomainError,
      );
    });

    it('should throw validation error for -1:00', () => {
      expect(() => Time.create({ hours: -1, minutes: 0 })).toThrow(
        ValidationDomainError,
      );
    });

    it('should throw validation error for 00:-1', () => {
      expect(() => Time.create({ hours: 0, minutes: -1 })).toThrow(
        ValidationDomainError,
      );
    });
  });

  describe('HH:MM string input', () => {
    it('should create a Time from an HH:MM string', () => {
      const time = Time.create('10:30');

      expect(time).toBeInstanceOf(Time);
      expect(time.value).toBe('10:30');
    });

    it('should create a Time at the minimum 00:00 from string', () => {
      const time = Time.create('00:00');

      expect(time).toBeInstanceOf(Time);
      expect(time.value).toBe('00:00');
    });

    it('should create a Time at the maximum 23:59 from string', () => {
      const time = Time.create('23:59');

      expect(time).toBeInstanceOf(Time);
      expect(time.value).toBe('23:59');
    });

    it('should consider a Time created from string equal to one created from props', () => {
      const time1 = Time.create('10:30');
      const time2 = Time.create({ hours: 10, minutes: 30 });

      expect(time1.equals(time2)).toBe(true);
    });

    it.each(['25:00', '24:00', '10:60', '10:5', '1:00', '10', '10:00:00', ''])(
      'should throw validation error for string "%s"',
      (value) => {
        expect(() => Time.create(value)).toThrow(ValidationDomainError);
      },
    );
  });

  describe('value getter', () => {
    it('should format the value as HH:MM', () => {
      const time = Time.create({ hours: 10, minutes: 30 });

      expect(time.value).toBe('10:30');
    });

    it('should pad hours and minutes with leading zeros', () => {
      const time = Time.create({ hours: 9, minutes: 5 });

      expect(time.value).toBe('09:05');
    });
  });

  describe('Equality checks', () => {
    it('should consider two Time instances with the same value as equal', () => {
      const time1 = Time.create({ hours: 10, minutes: 30 });
      const time2 = Time.create({ hours: 10, minutes: 30 });

      expect(time1.equals(time2)).toBe(true);
    });

    it('should consider two Time instances with different values as not equal', () => {
      const time1 = Time.create({ hours: 10, minutes: 30 });
      const time2 = Time.create({ hours: 11, minutes: 30 });

      expect(time1.equals(time2)).toBe(false);
    });
  });

  describe('Errors', () => {
    it.each([-1, 24, 25, 10.5, '10', null, undefined])(
      'should throw validation error for hours "%s"',
      (hours) => {
        expect(() => Time.create({ hours, minutes: 30 })).toThrow(
          ValidationDomainError,
        );
      },
    );

    it.each([-1, 60, 61, 30.5, '30', null, undefined])(
      'should throw validation error for minutes "%s"',
      (minutes) => {
        expect(() => Time.create({ hours: 10, minutes })).toThrow(
          ValidationDomainError,
        );
      },
    );
  });
});