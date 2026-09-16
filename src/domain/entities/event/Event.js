import { ValidationDomainError } from '../../common/domainErrors.js';
import { NotificationPeriod } from '../../value-objets/NotificationPeriod/NotificationPeriod.js';
import { Text } from '../../value-objets/Text/Text.js';
import { Id } from '../../value-objets/Id/Id.js';
import { Boolean } from '../../value-objets/Boolean/Boolean.js';
import { Icon } from '../../value-objets/Icon/Icon.js';
import { Color } from '../../value-objets/Color/Color.js';
import { Time } from '../../value-objets/Time/Time.js';
import { Day } from '../../value-objets/Day/Day.js';
import { Repeat } from '../../value-objets/Repeat/Repeat.js';

export class Event {
  constructor(props) {
    this.props = props;
  }

  static create(props) {
    const from = props?.from
      ? Time.create(props.from)
      : Time.create(currentHour());
    const to = props?.to
      ? Time.create(props.to)
      : Time.create(addOneHour(from.value));

    if (toMinutes(to.value) <= toMinutes(from.value)) {
      throw new ValidationDomainError('Event: to must be later than from');
    }

    const validatedProps = {
      ...props,

      id: Id.create(props.id),

      title: Text.create(props.title, TITLE_TEXT_OPTIONS),
      description: Text.create(
        props?.description || '',
        DESCRIPTION_TEXT_OPTIONS,
      ),

      date: props?.date ? Day.create(props.date) : Day.create(new Date()),
      from: from,
      to: to,

      notification: props.notification
        ? NotificationPeriod.create(props.notification)
        : NotificationPeriod.create('5min'),

      urgent: props?.urgent
        ? Boolean.create(props.urgent)
        : Boolean.create(false),
      allDay: props?.allDay
        ? Boolean.create(props.allDay)
        : Boolean.create(false),

      icon: props?.icon ? Icon.create(props.icon) : Icon.create('✏️'),

      color: props?.color ? Color.create(props.color) : Color.create('blue'),

      repeat: props?.repeat ? Repeat.create(props.repeat) : Repeat.create(null),
    };

    return new Event(validatedProps);
  }

  update(updateProps) {
    if (updateProps.title !== undefined) {
      this.props.title = Text.create(updateProps.title, TITLE_TEXT_OPTIONS);
    }
    if (updateProps.description !== undefined) {
      this.props.description = Text.create(
        updateProps.description,
        DESCRIPTION_TEXT_OPTIONS,
      );
    }

    if (updateProps.date !== undefined) {
      this.props.date = Day.create(updateProps.date);
    }
    if (updateProps.from !== undefined) {
      this.props.from = Time.create(updateProps.from);
    }
    if (updateProps.to !== undefined) {
      this.props.to = Time.create(updateProps.to);
    }

    if (updateProps.notification !== undefined) {
      this.props.notification = NotificationPeriod.create(
        updateProps.notification,
      );
    }

    if (updateProps.urgent !== undefined) {
      this.props.urgent = Boolean.create(updateProps.urgent);
    }
    if (updateProps.allDay !== undefined) {
      this.props.allDay = Boolean.create(updateProps.allDay);
    }

    if (updateProps.icon !== undefined) {
      this.props.icon = Icon.create(updateProps.icon);
    }
    if (updateProps.color !== undefined) {
      this.props.color = Color.create(updateProps.color);
    }

    if (updateProps.repeat !== undefined) {
      this.props.repeat = Repeat.create(updateProps.repeat);
    }
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
    return this.props.date.value;
  }

  get from() {
    return this.props.from.value;
  }

  get to() {
    return this.props.to.value;
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

  get repeat() {
    return this.props.repeat.value;
  }
}

const TITLE_TEXT_OPTIONS = { canBeEmpty: false };
const DESCRIPTION_TEXT_OPTIONS = { maxLength: 200, canBeEmpty: true };

function currentHour() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, '0')}:00`;
}

function addOneHour(time) {
  const [hours, minutes] = time.split(':').map(Number);
  const nextHour = (hours + 1) % 24;
  return `${String(nextHour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function toMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}
