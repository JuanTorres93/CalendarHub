import { DomainErrorCodes } from './domainErrorCodes.js';

export function mapDomainErrorToItalianMessage(error) {
  switch (error.code) {
    case DomainErrorCodes.VALIDATION.EMPTY:
      return 'Il titolo non è valido';
    case DomainErrorCodes.EVENT.MISSING_DATE:
      return 'Seleziona una data';
    case DomainErrorCodes.EVENT.MISSING_TIME:
      return 'Inserisci entrambi gli orari';
    case DomainErrorCodes.EVENT.TO_BEFORE_FROM:
      return "L'intervallo di tempo non è valido";
    case DomainErrorCodes.NOT_FOUND.EVENT:
      return "L'evento non è stato trovato";
    default:
      return 'Errore sconosciuto';
  }
}
