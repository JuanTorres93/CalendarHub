import {
  AlreadyExistsDomainError,
  NotFoundDomainError,
  ValidationDomainError,
} from '../../common/domainErrors.js';
import { DomainErrorCodes } from '../../common/domainErrorCodes.js';
import { Day } from '../../value-objets/Day/Day.js';
import { Id } from '../../value-objets/Id/Id.js';
import { Text } from '../../value-objets/Text/Text.js';
import { Todo } from '../todo/Todo.js';

export class TodoList {
  constructor(props) {
    this.props = props;
  }

  static create(props) {
    const validatedProps = {
      id: Id.create(props.id),

      date: Day.create(props.date),

      title: Text.create(props.title, TITLE_TEXT_OPTIONS),

      items: (props?.items || []).map((item) =>
        item instanceof Todo ? item : Todo.create(item),
      ),
    };

    return new TodoList(validatedProps);
  }

  rename(newName) {
    this.props.title = Text.create(newName, TITLE_TEXT_OPTIONS);
  }

  addTodo(newTodo) {
    if (!(newTodo instanceof Todo)) {
      throw new ValidationDomainError(
        'TodoList: newTodo must be a Todo entity',
        { code: DomainErrorCodes.VALIDATION.INVALID_VALUE },
      );
    }

    if (this.props.items.some((item) => item.id === newTodo.id)) {
      throw new AlreadyExistsDomainError(
        `TodoList: todo with id ${newTodo.id} already exists`,
        { code: DomainErrorCodes.TODO.ALREADY_EXISTS },
      );
    }

    this.props.items.push(newTodo);
  }

  removeTodo(todoId) {
    const itemIndex = this.props.items.findIndex(
      (item) => item.id === todoId,
    );

    if (itemIndex === -1) {
      throw new NotFoundDomainError(
        `TodoList: todo with id ${todoId} not found`,
        { code: DomainErrorCodes.TODO.NOT_FOUND },
      );
    }

    this.props.items.splice(itemIndex, 1);
  }

  clone() {
    return TodoList.create(this.toCreateProps());
  }

  toJSON() {
    return {
      id: this.id,
      date: this.date,
      title: this.title,
      items: this.props.items.map((item) => item.toJSON()),
    };
  }

  toCreateProps() {
    return {
      id: this.id,
      date: this.date,
      title: this.title,
      items: this.props.items.map((item) => item.toCreateProps()),
    };
  }

  get id() {
    return this.props.id.value;
  }

  get date() {
    return this.props.date.value;
  }

  get title() {
    return this.props.title.value;
  }

  get items() {
    return [...this.props.items];
  }
}

const TITLE_TEXT_OPTIONS = { canBeEmpty: false };