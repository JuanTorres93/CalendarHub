import { Id } from '../../value-objets/Id/Id.js';
import { Text } from '../../value-objets/Text/Text.js';
import { Boolean } from '../../value-objets/Boolean/Boolean.js';

export class Todo {
  constructor(props) {
    this.props = props;
  }

  static create(props) {
    const defaults = Todo.defaultProps();

    const validatedProps = {
      id: Id.create(props.id),

      title: Text.create(props.title, TITLE_TEXT_OPTIONS),

      completed: props?.completed
        ? Boolean.create(props.completed)
        : Boolean.create(defaults.completed),
    };

    return new Todo(validatedProps);
  }

  rename(newName) {
    this.props.title = Text.create(newName, TITLE_TEXT_OPTIONS);
  }

  toggleCompleted() {
    this.props.completed = Boolean.create(!this.completed);
  }

  clone() {
    return Todo.create(this.toCreateProps());
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      completed: this.completed,
    };
  }

  toCreateProps() {
    return {
      id: this.id,
      title: this.title,
      completed: this.completed,
    };
  }

  get id() {
    return this.props.id.value;
  }

  get title() {
    return this.props.title.value;
  }

  get completed() {
    return this.props.completed.value;
  }

  static defaultProps() {
    return {
      completed: false,
    };
  }
}

const TITLE_TEXT_OPTIONS = { canBeEmpty: false };
