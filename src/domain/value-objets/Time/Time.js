import { ValidationDomainError } from '../../common/domainErrors.js';
import { ValueObject } from '../ValueObject.js';

export const MIN_TIME = { hours: 0, minutes: 0 };
export const MAX_TIME = { hours: 23, minutes: 59 };

const TIME_PATTERN = /^(\d{2}):(\d{2})$/;

export class Time extends ValueObject {
  constructor(props) {
    super(props);

    this._value = props.value;
  }

  static create(time) {
    const { hours, minutes } = toTimeProps(time);

    if (
      !Number.isInteger(hours) ||
      hours < MIN_TIME.hours ||
      hours > MAX_TIME.hours
    ) {
      throw new ValidationDomainError(
        `Time: hours must be an integer between ${MIN_TIME.hours} and ${MAX_TIME.hours}`,
      );
    }

    if (
      !Number.isInteger(minutes) ||
      minutes < MIN_TIME.minutes ||
      minutes > MAX_TIME.minutes
    ) {
      throw new ValidationDomainError(
        `Time: minutes must be an integer between ${MIN_TIME.minutes} and ${MAX_TIME.minutes}`,
      );
    }

    return new Time({ hours, minutes });
  }

  get value() {
    const hours = String(this.props.hours).padStart(2, '0');
    const minutes = String(this.props.minutes).padStart(2, '0');

    return `${hours}:${minutes}`;
  }
}

function toTimeProps(time) {
  if (typeof time === 'string') {
    const match = time.match(TIME_PATTERN);

    if (!match) {
      throw new ValidationDomainError('Time: string must be in HH:MM format');
    }

    return { hours: Number(match[1]), minutes: Number(match[2]) };
  }

  if (time === null || time === undefined || typeof time !== 'object') {
    throw new ValidationDomainError(
      'Time: value must be an object with hours and minutes or a string in HH:MM format',
    );
  }

  return time;
}