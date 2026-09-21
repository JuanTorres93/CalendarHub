import { NotFoundDomainError } from '../../../domain/common/domainErrors.js';
import { DomainErrorCodes } from '../../../domain/common/domainErrorCodes.js';

export class RenameTodoUsecase {
  constructor(todoListsRepo) {
    this.todoListsRepo = todoListsRepo;
  }

  execute({ todoId, newTitle }) {
    const todoList = this.todoListsRepo.getListByTodoId(todoId);

    if (!todoList) {
      throw new NotFoundDomainError(`Todo with id ${todoId} not found`, {
        code: DomainErrorCodes.TODO.NOT_FOUND,
        params: { todoId },
      });
    }

    const todo = todoList.items.find((item) => item.id === todoId);

    todo.rename(newTitle);

    this.todoListsRepo.save(todoList);

    return todoList;
  }
}