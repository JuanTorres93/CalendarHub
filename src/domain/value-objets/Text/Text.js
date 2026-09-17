import { ValidationDomainError } from '../../common/domainErrors.js';
import { DomainErrorCodes } from '../../common/domainErrorCodes.js';
import { ValueObject } from '../ValueObject.js';

export class Text extends ValueObject {
  constructor(props) {
    super(props);

    this._value = props.value;
  }

  static create(value, options) {
    if (typeof value !== 'string' || value === null || value === undefined)
      throw new ValidationDomainError('Text must be a string', {
        code: DomainErrorCodes.VALIDATION.NOT_A_STRING,
      });

    if (options?.maxLength) {
      if (value.length > options.maxLength) {
        throw new ValidationDomainError(
          `Text: value length must not exceed ${options.maxLength} characters`,
          {
            code: DomainErrorCodes.VALIDATION.TOO_LONG,
            params: { maxLength: options.maxLength },
          },
        );
      }
    }

    if (options?.canBeEmpty === false && value.trim() === '') {
      throw new ValidationDomainError('Text cannot be empty', {
        code: DomainErrorCodes.VALIDATION.EMPTY,
      });
    }

    return new Text({ value: value.trim() });
  }

  get value() {
    return this._value;
  }
}
