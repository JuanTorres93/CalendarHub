import { isDomainError } from '../../domain/common/domainErrors.js';

import { mapDomainErrorToItalianMessage } from '../../domain/common/mapDomainErrorToItalianMessage.js';
import { createMessage } from '../../utils/helpers/createElement.js';

export function handleKnownErrors(error, eventModalDomElements) {
  if (isDomainError(error)) {
    console.error('Domain error:', error);

    const message = mapDomainErrorToItalianMessage(error);
    createMessage(message, eventModalDomElements.timeRow, eventModalDomElements.modalEvents);
  } else {
    console.error('Unknown error:', error);
  }
}