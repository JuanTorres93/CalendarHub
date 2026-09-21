import { NotFoundDomainError } from '../../../domain/common/domainErrors.js';
import { DomainErrorCodes } from '../../../domain/common/domainErrorCodes.js';

export class RenameTodoListUsecase {
  constructor(todoListsRepo) {
    this.todoListsRepo = todoListsRepo;
  }

  execute({ id, newTitle }) {
    const todoList = this.todoListsRepo.getById(id);

    if (!todoList) {
      throw new NotFoundDomainError(`Todo list with id ${id} not found`, {
        code: DomainErrorCodes.TODO.NOT_FOUND,
        params: { id },
      });
    }

    todoList.rename(newTitle);

    this.todoListsRepo.save(todoList);

    return todoList;
  }
}