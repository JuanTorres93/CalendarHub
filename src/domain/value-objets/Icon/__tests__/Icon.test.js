import { describe, expect, it } from 'vitest';

import { ValidationDomainError } from '../../../common/domainErrors.js';
import { Icon } from '../Icon.js';

describe('Icon', () => {
  it('should create a valid Icon', () => {
    const iconValue = '🌳';

    const icon = Icon.create(iconValue);

    expect(icon).toBeInstanceOf(Icon);
    expect(icon.value).toBe(iconValue);
  });

  it('should create a valid Icon with an emoji', () => {
    const iconValue = '✏️';

    const icon = Icon.create(iconValue);

    expect(icon).toBeInstanceOf(Icon);
    expect(icon.value).toBe(iconValue);
  });

  describe('Equality checks', () => {
    it('should consider two Icon instances with the same value as equal', () => {
      const icon1 = Icon.create('🌳');
      const icon2 = Icon.create('🌳');

      expect(icon1.equals(icon2)).toBe(true);
    });

    it('should consider two Icon instances with different values as not equal', () => {
      const icon1 = Icon.create('🌳');
      const icon2 = Icon.create('💡');

      expect(icon1.equals(icon2)).toBe(false);
    });
  });

  describe('Errors', () => {
    it('should throw validation error if value is not a single character', () => {
      expect(() => Icon.create('ab')).toThrow(ValidationDomainError);
    });

    it('should throw validation error if value is an empty string', () => {
      expect(() => Icon.create('')).toThrow(ValidationDomainError);
    });

    it('should throw validation error if value is null', () => {
      expect(() => Icon.create(null)).toThrow(ValidationDomainError);
    });

    it('should throw validation error if value is undefined', () => {
      expect(() => Icon.create(undefined)).toThrow(ValidationDomainError);
    });

    it('should throw validation error if value is not a string', () => {
      expect(() => Icon.create(5)).toThrow(ValidationDomainError);
    });
  });
});
