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
    const defaults = Event.defaultProps();

    const allDay = props?.allDay
      ? Boolean.create(props.allDay)
      : Boolean.create(defaults.allDay);

    const from = allDay.value
      ? Time.create('00:00')
      : Time.create(props.from);

    const to = allDay.value
      ? Time.create('23:59')
      : Time.create(props.to);

    if (toMinutes(to.value) <= toMinutes(from.value)) {
      throw new ValidationDomainError('Event: to must be later than from');
    }

    const validatedProps = {
      ...props,

      id: Id.create(props.id),

      title: Text.create(props.title, TITLE_TEXT_OPTIONS),
      description: Text.create(
        props?.description || defaults.description,
        DESCRIPTION_TEXT_OPTIONS,
      ),

      date: props?.date ? Day.create(props.date) : Day.create(defaults.date),
      from: from,
      to: to,

      notification: props.notification
        ? NotificationPeriod.create(props.notification)
        : NotificationPeriod.create(defaults.notification),

      urgent: props?.urgent
        ? Boolean.create(props.urgent)
        : Boolean.create(defaults.urgent),
      allDay: allDay,

      icon: props?.icon ? Icon.create(props.icon) : Icon.create(defaults.icon),

      color: props?.color
        ? Color.create(props.color)
        : Color.create(defaults.color),

      repeat: props?.repeat
        ? Repeat.create(props.repeat)
        : Repeat.create(defaults.repeat),
    };

    return new Event(validatedProps);
  }

  reset() {
    this.update(Event.defaultProps());
  }

  updateIdDuringRefactor(id) {
    this.props.id = Id.create(id);
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

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      date: this.date,
      from: this.from,
      to: this.to,
      icon: this.icon,
      color: this.color,
      urgent: this.urgent,
      allDay: this.allDay,
      notification: this.notification,
      repeat: this.repeat,
    };
  }

  static defaultProps() {
    const from = currentHour();

    return {
      description: '',

      date: new Date(),
      from,
      to: addOneHour(from),

      notification: '5min',

      urgent: false,
      allDay: false,

      icon: '✏️',
      color: 'blue',

      repeat: null,
    };
  }
}

// TODO change to false when code is sufficiently decoupled
const TITLE_TEXT_OPTIONS = { canBeEmpty: true };
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
