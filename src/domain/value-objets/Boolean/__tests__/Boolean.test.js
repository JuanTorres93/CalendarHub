import { describe, expect, it } from 'vitest';

import { ValidationDomainError } from '../../../common/domainErrors.js';
import { Boolean } from '../Boolean.js';

describe('Boolean', () => {
  it('should create a valid Boolean', () => {
    const boolean = Boolean.create(true);

    expect(boolean).toBeInstanceOf(Boolean);
    expect(boolean.value).toBe(true);
  });

  it('should create a valid Boolean with false value', () => {
    const boolean = Boolean.create(false);

    expect(boolean).toBeInstanceOf(Boolean);
    expect(boolean.value).toBe(false);
  });

  describe('Equality checks', () => {
    it('should consider two Boolean instances with the same value as equal', () => {
      const boolean1 = Boolean.create(true);
      const boolean2 = Boolean.create(true);

      expect(boolean1.equals(boolean2)).toBe(true);
    });

    it('should consider two Boolean instances with different values as not equal', () => {
      const boolean1 = Boolean.create(true);
      const boolean2 = Boolean.create(false);

      expect(boolean1.equals(boolean2)).toBe(false);
    });
  });

  describe('Errors', () => {
    it('should throw validation error if value is not a boolean', () => {
      expect(() => Boolean.create('true')).toThrow(ValidationDomainError);
    });

    it('should throw validation error if value is null', () => {
      expect(() => Boolean.create(null)).toThrow(ValidationDomainError);
    });

    it('should throw validation error if value is undefined', () => {
      expect(() => Boolean.create(undefined)).toThrow(ValidationDomainError);
    });

    it('should throw validation error if value is a number', () => {
      expect(() => Boolean.create(1)).toThrow(ValidationDomainError);
    });
  });
});