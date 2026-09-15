import { describe, expect, it } from 'vitest';

import { ValidationDomainError } from '../../../common/domainErrors.js';
import {
  NOTIFICATION_PERIODS,
  NotificationPeriod,
} from '../NotificationPeriod.js';

describe('NotificationPeriod', () => {
  it.each(NOTIFICATION_PERIODS)(
    'should create a valid NotificationPeriod for "%s"',
    (period) => {
      const notificationPeriod = NotificationPeriod.create(period);

      expect(notificationPeriod).toBeInstanceOf(NotificationPeriod);
      expect(notificationPeriod.value).toBe(period);
    },
  );

  describe('Equality checks', () => {
    it('should consider two NotificationPeriod instances with the same value as equal', () => {
      const period1 = NotificationPeriod.create('1h');
      const period2 = NotificationPeriod.create('1h');

      expect(period1.equals(period2)).toBe(true);
    });

    it('should consider two NotificationPeriod instances with different values as not equal', () => {
      const period1 = NotificationPeriod.create('1h');
      const period2 = NotificationPeriod.create('2h');

      expect(period1.equals(period2)).toBe(false);
    });
  });

  describe('Errors', () => {
    it('should throw validation error if value is not in NOTIFICATION_PERIODS', () => {
      expect(() => NotificationPeriod.create('2d')).toThrow(
        ValidationDomainError,
      );
    });

    it('should throw validation error if value is null', () => {
      expect(() => NotificationPeriod.create(null)).toThrow(
        ValidationDomainError,
      );
    });

    it('should throw validation error if value is undefined', () => {
      expect(() => NotificationPeriod.create(undefined)).toThrow(
        ValidationDomainError,
      );
    });

    it('should throw validation error if value is an empty string', () => {
      expect(() => NotificationPeriod.create('')).toThrow(
        ValidationDomainError,
      );
    });

    it('should throw validation error if value is not a string', () => {
      expect(() => NotificationPeriod.create(5)).toThrow(ValidationDomainError);
    });
  });
});