import { NotificationPeriod } from '../../value-objets/NotificationPeriod/NotificationPeriod.js';
import { Text } from '../../value-objets/Text/Text.js';
import { Id } from '../../value-objets/Id/Id.js';
import { Boolean } from '../../value-objets/Boolean/Boolean.js';
import { Icon } from '../../value-objets/Icon/Icon.js';
import { Color } from '../../value-objets/Color/Color.js';

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

      urgent: props?.urgent
        ? Boolean.create(props.urgent)
        : Boolean.create(false),
      allDay: props?.allDay
        ? Boolean.create(props.allDay)
        : Boolean.create(false),

      icon: props?.icon ? Icon.create(props.icon) : Icon.create('✏️'),

      color: props?.color ? Color.create(props.color) : Color.create('blue'),
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
    return this.props.icon.value;
  }

  get color() {
    return this.props.color.value;
  }

  get urgent() {
    return this.props.urgent.value;
  }

  get allDay() {
    return this.props.allDay.value;
  }

  get notification() {
    return this.props.notification.value;
  }
}

const TITLE_TEXT_OPTIONS = { canBeEmpty: false };
const DESCRIPTION_TEXT_OPTIONS = { maxLength: 200, canBeEmpty: true };
