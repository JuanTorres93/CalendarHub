import { ValidationDomainError } from '../../common/domainErrors.js';
import { ValueObject } from '../ValueObject.js';

export class Text extends ValueObject {
  constructor(props) {
    super(props);

    this._value = props.value;
  }

  static create(value, options) {
    if (typeof value !== 'string' || value === null || value === undefined)
      throw new ValidationDomainError('Text must be a string');

    if (options?.maxLength) {
      if (value.length > options.maxLength) {
        throw new ValidationDomainError(
          `Text: value length must not exceed ${options.maxLength} characters`,
        );
      }
    }

    if (options?.canBeEmpty === false && value.trim() === '') {
      throw new ValidationDomainError('Text cannot be empty');
    }

    return new Text({ value: value.trim() });
  }

  get value() {
    return this._value;
  }
}
