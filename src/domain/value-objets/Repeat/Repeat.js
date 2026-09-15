import { ValidationDomainError } from '../../common/domainErrors.js';
import { ValueObject } from '../ValueObject.js';
import { Day } from '../Day/Day.js';

export const REPEAT_FREQUENCIES = ['none', 'daily', 'weekly', 'monthly'];

export class Repeat extends ValueObject {
  constructor(props) {
    super(props);

    this._value = props.value;
  }

  static create(value) {
    if (REPEAT_FREQUENCIES.includes(value)) {
      return new Repeat({ value });
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        throw new ValidationDomainError('Repeat: custom dates cannot be empty');
      }

      return new Repeat({ value: value.map((day) => Day.create(day)) });
    }

    throw new ValidationDomainError(
      `Repeat: value must be one of: ${REPEAT_FREQUENCIES.join(', ')} or an array of dates`,
    );
  }

  get frequency() {
    return Array.isArray(this._value) ? null : this._value;
  }

  get customDates() {
    return Array.isArray(this._value) ? this._value : null;
  }
}