export const DomainErrorCodes = {
  VALIDATION: {
    NOT_A_STRING: 'validation.not_a_string',
    EMPTY: 'validation.empty',
    TOO_LONG: 'validation.too_long',
    NOT_A_BOOLEAN: 'validation.not_a_boolean',
    INVALID_VALUE: 'validation.invalid_value',
    UNKNOWN: 'validation.unknown',
  },

  TIME: {
    INVALID_FORMAT: 'time.invalid_format',
    HOURS_OUT_OF_RANGE: 'time.hours_out_of_range',
    MINUTES_OUT_OF_RANGE: 'time.minutes_out_of_range',
  },

  DATE: {
    INVALID_FORMAT: 'date.invalid_format',
    INVALID_DATE: 'date.invalid_date',
    YEAR_OUT_OF_RANGE: 'date.year_out_of_range',
    MONTH_OUT_OF_RANGE: 'date.month_out_of_range',
  },

  EVENT: {
    TO_BEFORE_FROM: 'event.to_before_from',
  },

  ICON: {
    NOT_A_SINGLE_CHARACTER: 'icon.not_a_single_character',
  },

  REPEAT: {
    INVALID_INTERVAL: 'repeat.invalid_interval',
    INVALID_WEEKDAYS: 'repeat.invalid_weekdays',
    EMPTY_CUSTOM_DATES: 'repeat.empty_custom_dates',
    INVALID_DATES_ARRAY: 'repeat.invalid_dates_array',
  },

  NOT_FOUND: {
    EVENT: 'event.not_found',
  },
};