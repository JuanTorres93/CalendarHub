import { ValidationDomainError } from '../../common/domainErrors.js';
import { DomainErrorCodes } from '../../common/domainErrorCodes.js';
import { ValueObject } from '../ValueObject.js';

export class Id extends ValueObject {
  constructor(props) {
    super(props);

    this._value = props.value;
  }

  static create(value) {
    if (!value) throw new ValidationDomainError('Id cannot be empty', { code: DomainErrorCodes.VALIDATION.EMPTY });

    if (typeof value !== 'string')
      throw new ValidationDomainError('Id must be a string', {
        code: DomainErrorCodes.VALIDATION.NOT_A_STRING,
      });

    if (value.trim() === '')
      throw new ValidationDomainError('Id cannot be empty', {
        code: DomainErrorCodes.VALIDATION.EMPTY,
      });

    return new Id({ value: value.trim() });
  }

  get value() {
    return this._value;
  }
}
