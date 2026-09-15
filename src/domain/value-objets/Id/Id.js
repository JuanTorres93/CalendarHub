import { ValidationDomainError } from '../../common/domainErrors.js';
import { ValueObject } from '../ValueObject.js';

export class Id extends ValueObject {
  constructor(props) {
    super(props);

    this._value = props.value;
  }

  static create(value) {
    if (!value) throw new ValidationDomainError('Id cannot be empty');

    if (typeof value !== 'string')
      throw new ValidationDomainError('Id must be a string');

    if (value.trim() === '')
      throw new ValidationDomainError('Id cannot be empty');

    return new Id({ value: value.trim() });
  }

  get value() {
    return this._value;
  }
}
