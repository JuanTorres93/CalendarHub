import { ValidationDomainError } from '../../common/domainErrors.js';
import { DomainErrorCodes } from '../../common/domainErrorCodes.js';
import { ValueObject } from '../ValueObject.js';
import { Day } from '../Day/Day.js';

export const REPEAT_TYPES = ['daily', 'weekly', 'monthly', 'custom'];

export class Repeat extends ValueObject {
  constructor(props) {
    super(props);

    this._value = props.value;
  }

  static create(value) {
    if (value === null) {
      return new Repeat({ value: null });
    }

    return new Repeat({ value: toRepeatValue(value) });
  }

  get value() {
    return this._value;
  }
}

function toRepeatValue(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new ValidationDomainError(
      'Repeat: value must be null or a repeat config object',
      { code: DomainErrorCodes.VALIDATION.INVALID_VALUE },
    );
  }

  const { seriesId, type, interval } = value;

  if (typeof seriesId !== 'string' || seriesId.trim() === '') {
    throw new ValidationDomainError(
      'Repeat: seriesId must be a non-empty string',
      { code: DomainErrorCodes.VALIDATION.EMPTY },
    );
  }

  if (!REPEAT_TYPES.includes(type)) {
    throw new ValidationDomainError(
      `Repeat: type must be one of: ${REPEAT_TYPES.join(', ')}`,
      { code: DomainErrorCodes.VALIDATION.UNKNOWN },
    );
  }

  if (!Number.isInteger(interval) || interval <= 0) {
    throw new ValidationDomainError(
      'Repeat: interval must be a positive integer',
      { code: DomainErrorCodes.REPEAT.INVALID_INTERVAL },
    );
  }

  if (!Array.isArray(value.weekdays) || !value.weekdays.every(isValidWeekday)) {
    throw new ValidationDomainError(
      'Repeat: weekdays must be an array of integers between 0 and 6',
      { code: DomainErrorCodes.REPEAT.INVALID_WEEKDAYS },
    );
  }

  const customDates = toValidDates(value.customDates, 'customDates');
  const exceptions = toValidDates(value.exceptions, 'exceptions');

  return {
    seriesId,
    type,
    interval,
    until: toValidDate(value.until, 'until'),
    weekdays: [...value.weekdays],
    customDates,
    exceptions,
  };
}

function isValidWeekday(weekday) {
  return Number.isInteger(weekday) && weekday >= 0 && weekday <= 6;
}

function toValidDate(date, field) {
  try {
    return Day.create(date).value;
  } catch {
    throw new ValidationDomainError(
      `Repeat: ${field} must be a valid date in YYYY-MM-DD format`,
      { code: DomainErrorCodes.DATE.INVALID_DATE, params: { field } },
    );
  }
}

function toValidDates(dates, field) {
  if (!Array.isArray(dates)) {
    throw new ValidationDomainError(
      `Repeat: ${field} must be an array of dates`,
      { code: DomainErrorCodes.REPEAT.INVALID_DATES_ARRAY, params: { field } },
    );
  }

  return dates.map((date) => toValidDate(date, field));
}
