import { NotFoundDomainError } from '../../../domain/common/domainErrors.js';
import { DomainErrorCodes } from '../../../domain/common/domainErrorCodes.js';

export class DeleteTodoFromListUsecase {
  constructor(todoListsRepo) {
    this.todoListsRepo = todoListsRepo;
  }

  execute({ todoListId, todoId }) {
    const todoList = this.todoListsRepo.getById(todoListId);

    if (!todoList) {
      throw new NotFoundDomainError(
        `Todo list with id ${todoListId} not found`,
        { code: DomainErrorCodes.TODO.NOT_FOUND, params: { id: todoListId } },
      );
    }

    todoList.removeTodo(todoId);

    this.todoListsRepo.save(todoList);

    return todoList;
  }
}