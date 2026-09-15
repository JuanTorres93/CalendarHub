import { NotificationPeriod } from '../../value-objets/NotificationPeriod/NotificationPeriod.js';
import { Text } from '../../value-objets/Text/Text.js';
import { Id } from '../../value-objets/Id/Id.js';

export class Event {
  constructor(props) {
    this.props = props;
  }

  static create(props) {
    const validatedProps = {
      ...props,

      id: Id.create(props.id),

      title: Text.create(props.title, TITLE_TEXT_OPTIONS),
      description: Text.create(
        props?.description || '',
        DESCRIPTION_TEXT_OPTIONS,
      ),

      notification: props.notification
        ? NotificationPeriod.create(props.notification)
        : NotificationPeriod.create('none'),
    };

    return new Event(validatedProps);
  }

  get id() {
    return this.props.id.value;
  }

  get title() {
    return this.props.title.value;
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
    return this.props.notification.value;
  }
}

const TITLE_TEXT_OPTIONS = { canBeEmpty: false };
const DESCRIPTION_TEXT_OPTIONS = { maxLength: 200, canBeEmpty: true };
