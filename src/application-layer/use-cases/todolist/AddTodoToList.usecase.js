import { NotFoundDomainError } from '../../../domain/common/domainErrors.js';
import { DomainErrorCodes } from '../../../domain/common/domainErrorCodes.js';
import { Todo } from '../../../domain/entities/todo/Todo.js';

export class AddTodoToListUsecase {
  constructor(todoListsRepo, idGenerator) {
    this.todoListsRepo = todoListsRepo;
    this.idGenerator = idGenerator;
  }

  execute({ todoListId, title }) {
    const todoList = this.todoListsRepo.getById(todoListId);

    if (!todoList) {
      throw new NotFoundDomainError(
        `Todo list with id ${todoListId} not found`,
        { code: DomainErrorCodes.TODO.NOT_FOUND, params: { id: todoListId } },
      );
    }

    const todo = Todo.create({
      id: this.idGenerator.generateId(),
      title,
      completed: false,
    });

    todoList.addTodo(todo);

    this.todoListsRepo.save(todoList);

    return todoList;
  }
}