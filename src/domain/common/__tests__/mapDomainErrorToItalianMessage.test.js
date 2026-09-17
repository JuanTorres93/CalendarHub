import { describe, expect, it } from 'vitest';

import { ValidationDomainError } from '../domainErrors.js';
import { DomainErrorCodes } from '../domainErrorCodes.js';
import { mapDomainErrorToItalianMessage } from '../mapDomainErrorToItalianMessage.js';

describe('mapDomainErrorToItalianMessage', () => {
  it.each([
    [DomainErrorCodes.VALIDATION.EMPTY, 'Il titolo non è valido'],
    [DomainErrorCodes.EVENT.MISSING_DATE, 'Seleziona una data'],
    [DomainErrorCodes.EVENT.MISSING_TIME, 'Inserisci entrambi gli orari'],
    [
      DomainErrorCodes.EVENT.TO_BEFORE_FROM,
      "L'intervallo di tempo non è valido",
    ],
    [DomainErrorCodes.NOT_FOUND.EVENT, "L'evento non è stato trovato"],
  ])('should map code "%s" to its Italian message', (code, message) => {
    const error = new ValidationDomainError('', { code });

    expect(mapDomainErrorToItalianMessage(error)).toBe(message);
  });

  it('should return the unknown error message for non-domain errors', () => {
    expect(mapDomainErrorToItalianMessage(new Error('boom'))).toBe(
      'Errore sconosciuto',
    );
  });

  it('should return the unknown error message for unmapped codes', () => {
    const error = new ValidationDomainError('', {
      code: DomainErrorCodes.TIME.INVALID_FORMAT,
    });

    expect(mapDomainErrorToItalianMessage(error)).toBe('Errore sconosciuto');
  });
});