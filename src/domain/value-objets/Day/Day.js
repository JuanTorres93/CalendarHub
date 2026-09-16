import { ValidationDomainError } from '../../common/domainErrors.js';
import { ValueObject } from '../ValueObject.js';

export const MIN_YEAR = 1000;
export const MAX_YEAR = 9999;

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

export class Day extends ValueObject {
  constructor(props) {
    super(props);

    this._value = props.value;
  }

  static create(day) {
    const { year, month, day: dayOfMonth } = toDayProps(day);

    if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) {
      throw new ValidationDomainError(
        `Day: year must be an integer between ${MIN_YEAR} and ${MAX_YEAR}`,
      );
    }

    if (!Number.isInteger(month) || month < 1 || month > 12) {
      throw new ValidationDomainError(
        'Day: month must be an integer between 1 and 12',
      );
    }

    if (!Number.isInteger(dayOfMonth) || !isValidDate(year, month, dayOfMonth)) {
      throw new ValidationDomainError('Day: invalid date');
    }

    return new Day({ year, month, day: dayOfMonth });
  }

  get value() {
    const year = String(this.props.year).padStart(4, '0');
    const month = String(this.props.month).padStart(2, '0');
    const day = String(this.props.day).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}

function toDayProps(day) {
  if (day instanceof Day) {
    return {
      year: day.props.year,
      month: day.props.month,
      day: day.props.day,
    };
  }

  if (day instanceof Date) {
    return {
      year: day.getFullYear(),
      month: day.getMonth() + 1,
      day: day.getDate(),
    };
  }

  if (typeof day === 'string') {
    const match = day.match(DATE_PATTERN);

    if (!match) {
      throw new ValidationDomainError(
        'Day: string must be in YYYY-MM-DD format',
      );
    }

    return {
      year: Number(match[1]),
      month: Number(match[2]),
      day: Number(match[3]),
    };
  }

  if (day === null || day === undefined || typeof day !== 'object') {
    throw new ValidationDomainError(
      'Day: value must be an object with year, month and day, a Date or a string in YYYY-MM-DD format',
    );
  }

  return day;
}

function isValidDate(year, month, day) {
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}