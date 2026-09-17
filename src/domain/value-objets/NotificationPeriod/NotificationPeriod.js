import { ValidationDomainError } from '../../common/domainErrors.js';
import { DomainErrorCodes } from '../../common/domainErrorCodes.js';
import { ValueObject } from '../ValueObject.js';

export const NOTIFICATION_PERIODS = ['none', '5min', '15min', '1h', '2h', '4h', '1d'];

export class NotificationPeriod extends ValueObject {
  constructor(props) {
    super(props);

    this._value = props.value;
  }

  static create(value) {
    if (!NOTIFICATION_PERIODS.includes(value)) {
      throw new ValidationDomainError(
        `NotificationPeriod: value must be one of: ${NOTIFICATION_PERIODS.join(', ')}`,
        { code: DomainErrorCodes.VALIDATION.UNKNOWN },
      );
    }

    return new NotificationPeriod({ value });
  }

  get value() {
    return this._value;
  }
}