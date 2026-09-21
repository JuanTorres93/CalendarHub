import { NotFoundDomainError } from '../../../domain/common/domainErrors.js';
import { DomainErrorCodes } from '../../../domain/common/domainErrorCodes.js';

export class ToggleTodoCompletionUsecase {
  constructor(todoListsRepo) {
    this.todoListsRepo = todoListsRepo;
  }

  execute({ todoId }) {
    const todoList = this.todoListsRepo.getListByTodoId(todoId);

    if (!todoList) {
      throw new NotFoundDomainError(`Todo with id ${todoId} not found`, {
        code: DomainErrorCodes.TODO.NOT_FOUND,
        params: { todoId },
      });
    }

    const todo = todoList.items.find((item) => item.id === todoId);

    todo.toggleCompleted();

    this.todoListsRepo.save(todoList);

    return todoList;
  }
}