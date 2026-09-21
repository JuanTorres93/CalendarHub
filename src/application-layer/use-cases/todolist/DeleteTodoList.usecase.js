import { NotFoundDomainError } from '../../../domain/common/domainErrors.js';
import { DomainErrorCodes } from '../../../domain/common/domainErrorCodes.js';

export class DeleteTodoListUsecase {
  constructor(todoListsRepo) {
    this.todoListsRepo = todoListsRepo;
  }

  execute({ id }) {
    const todoList = this.todoListsRepo.getById(id);

    if (!todoList) {
      throw new NotFoundDomainError(`Todo list with id ${id} not found`, {
        code: DomainErrorCodes.TODO.NOT_FOUND,
        params: { id },
      });
    }

    this.todoListsRepo.deleteById(id);
  }
}