class DomainError extends Error {}

export function isDomainError(err) {
  return err instanceof DomainError;
}

export class ValidationDomainError extends DomainError {}

export class NotFoundDomainError extends DomainError {}
