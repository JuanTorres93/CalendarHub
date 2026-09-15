import { describe, expect, it } from 'vitest';

import { ValidationDomainError } from '../../../common/domainErrors.js';
import { Id } from '../Id.js';

describe('Id', () => {
  it('should create a valid Id', () => {
    const idValue = 'valid-id-123';

    const id = Id.create(idValue);

    expect(id).toBeInstanceOf(Id);
    expect(id.value).toBe(idValue);
  });

  it('should trim whitespace from id value', () => {
    const idValue = '   valid-id-456   ';

    const id = Id.create(idValue);

    expect(id).toBeInstanceOf(Id);
    expect(id.value).toBe('valid-id-456');
  });

  describe('Errors', () => {
    it('should throw ValidationDomainError if id is empty', () => {
      const idValue = '';

      expect(() => {
        Id.create(idValue);
      }).toThrow(ValidationDomainError);
    });

    it('should throw ValidationDomainError if id is only whitespaces', () => {
      const idValue = '     ';

      expect(() => {
        Id.create(idValue);
      }).toThrow(ValidationDomainError);
    });

    it('should throw ValidationDomainError if id is null', () => {
      const idValue = null;

      expect(() => {
        Id.create(idValue);
      }).toThrow(ValidationDomainError);
    });

    it('should throw ValidationDomainError if id is undefined', () => {
      const idValue = undefined;

      expect(() => {
        Id.create(idValue);
      }).toThrow(ValidationDomainError);
    });

    it('should throw ValidationDomainError for number id', () => {
      const idValue = 123;

      expect(() => {
        Id.create(idValue);
      }).toThrow(ValidationDomainError);
    });

    it('should throw ValidationDomainError for object id', () => {
      const idValue = { key: 'value' };

      expect(() => {
        Id.create(idValue);
      }).toThrow(ValidationDomainError);
    });

    it('should throw ValidationDomainError for array id', () => {
      const idValue = ['array'];

      expect(() => {
        Id.create(idValue);
      }).toThrow(ValidationDomainError);
    });

    it('should throw ValidationDomainError for boolean id', () => {
      const idValue = true;

      expect(() => {
        Id.create(idValue);
      }).toThrow(ValidationDomainError);
    });
  });
});
