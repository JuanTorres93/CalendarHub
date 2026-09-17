import { isDomainError } from '../../domain/common/domainErrors.js';

import { mapDomainErrorToItalianMessage } from '../../domain/common/mapDomainErrorToItalianMessage.js';
import { createMessage } from '../../utils/helpers/createElement.js';
import { modalEvents, timeRow } from '../../utils/helpers/dom/eventModalDom.js';

export function handleKnownErrors(error) {
  if (isDomainError(error)) {
    console.error('Domain error:', error);

    const message = mapDomainErrorToItalianMessage(error);
    createMessage(message, timeRow, modalEvents);
  } else {
    console.error('Unknown error:', error);
  }
}
