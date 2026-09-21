class DomainError extends Error {
  constructor(message, { code, params } = {}) {
    super(message);

    this.name = this.constructor.name;
    this.code = code;
    this.params = params;
  }
}

export function isDomainError(err) {
  return err instanceof DomainError;
}

export class ValidationDomainError extends DomainError {}

export class NotFoundDomainError extends DomainError {}

export class AlreadyExistsDomainError extends DomainError {}