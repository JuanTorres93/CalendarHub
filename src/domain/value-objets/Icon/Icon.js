import { ValidationDomainError } from '../../common/domainErrors.js';
import { ValueObject } from '../ValueObject.js';

export class Icon extends ValueObject {
  constructor(props) {
    super(props);

    this._value = props.value;
  }

  static create(value) {
    if (typeof value !== 'string' || value === null || value === undefined)
      throw new ValidationDomainError('Icon must be a string');

    if (Array.from(value.replace(/[\uFE00-\uFE0F]/g, '')).length !== 1) {
      throw new ValidationDomainError('Icon must be a single character');
    }

    return new Icon({ value });
  }

  get value() {
    return this._value;
  }
}