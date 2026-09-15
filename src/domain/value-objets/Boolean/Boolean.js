import { ValidationDomainError } from '../../common/domainErrors.js';
import { ValueObject } from '../ValueObject.js';

export class Boolean extends ValueObject {
  constructor(props) {
    super(props);

    this._value = props.value;
  }

  static create(value) {
    if (typeof value !== 'boolean') {
      throw new ValidationDomainError('Boolean must be a boolean');
    }

    return new Boolean({ value });
  }

  get value() {
    return this._value;
  }
}