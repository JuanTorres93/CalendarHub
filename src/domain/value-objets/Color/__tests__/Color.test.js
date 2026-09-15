import { describe, expect, it } from 'vitest';

import { ValidationDomainError } from '../../../common/domainErrors.js';
import { Color, EVENT_COLORS } from '../Color.js';

describe('Color', () => {
  it.each(EVENT_COLORS.map((color) => [color, color]))(
    'should create a valid Color for "%s"',
    (color) => {
      const colorObject = Color.create(color);

      expect(colorObject).toBeInstanceOf(Color);
      expect(colorObject.value).toBe(color);
    },
  );

  describe('Equality checks', () => {
    it('should consider two Color instances with the same value as equal', () => {
      const color1 = Color.create('blue');
      const color2 = Color.create('blue');

      expect(color1.equals(color2)).toBe(true);
    });

    it('should consider two Color instances with different values as not equal', () => {
      const color1 = Color.create('blue');
      const color2 = Color.create('green');

      expect(color1.equals(color2)).toBe(false);
    });
  });

  describe('Errors', () => {
    it('should throw validation error if value is not in EVENT_COLORS', () => {
      expect(() => Color.create('black')).toThrow(ValidationDomainError);
    });

    it('should throw validation error if value is null', () => {
      expect(() => Color.create(null)).toThrow(ValidationDomainError);
    });

    it('should throw validation error if value is undefined', () => {
      expect(() => Color.create(undefined)).toThrow(ValidationDomainError);
    });

    it('should throw validation error if value is an empty string', () => {
      expect(() => Color.create('')).toThrow(ValidationDomainError);
    });

    it('should throw validation error if value is not a string', () => {
      expect(() => Color.create(5)).toThrow(ValidationDomainError);
    });
  });
});