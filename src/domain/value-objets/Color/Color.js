import { ValidationDomainError } from '../../common/domainErrors.js';
import { DomainErrorCodes } from '../../common/domainErrorCodes.js';
import { ValueObject } from '../ValueObject.js';

export const EVENT_COLORS = [
  'blue',
  'green',
  'purple',
  'red',
  'yellow',
  'orange',
  'pink',
];

export class Color extends ValueObject {
  constructor(props) {
    super(props);

    this._value = props.value;
  }

  static create(value) {
    if (!EVENT_COLORS.includes(value)) {
      throw new ValidationDomainError(
        `Color: value must be one of: ${EVENT_COLORS.join(', ')}`,
        { code: DomainErrorCodes.VALIDATION.UNKNOWN },
      );
    }

    return new Color({ value });
  }

  get value() {
    return this._value;
  }
}