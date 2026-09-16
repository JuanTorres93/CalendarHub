import { isDomainError } from '../../domain/common/domainErrors';

export function handleKnownErrors(error) {
  if (isDomainError(error)) {
    console.error('Domain error:', error);
  } else {
    console.error('Unknown error:', error);
  }
}
