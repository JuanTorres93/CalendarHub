import { Text } from '../../value-objets/Text/Text.js';

export class Event {
  constructor(props) {
    this.props = props;
  }

  static create(props) {
    const validatedProps = {
      ...props,

      description: Text.create(props.description, DESCRIPTION_TEXT_OPTIONS),
    };

    return new Event(validatedProps);
  }

  get id() {
    return this.props.id;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description.value;
  }

  get date() {
    return this.props.date;
  }

  get from() {
    return this.props.from;
  }

  get to() {
    return this.props.to;
  }

  get icon() {
    return this.props.icon;
  }

  get color() {
    return this.props.color;
  }

  get urgent() {
    return this.props.urgent;
  }

  get allDay() {
    return this.props.allDay;
  }

  get notification() {
    return this.props.notification;
  }
}

const DESCRIPTION_TEXT_OPTIONS = { maxLength: 200 };

const NOTIFICATION_PERIODS = ['none', '5min', '15min', '1h', '2h', '4h', '1d'];
