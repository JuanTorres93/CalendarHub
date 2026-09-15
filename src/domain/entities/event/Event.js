export class Event {
  constructor(props) {
    this.props = props;
  }

  static create(props) {
    return new Event(props);
  }

  get id() {
    return this.props.id;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
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

const NOTIFICATION_PERIODS = ['none', '5min', '15min', '1h', '2h', '4h', '1d'];
