export class GetAllTodoListsUsecase {
  constructor(todoListsRepo) {
    this.todoListsRepo = todoListsRepo;
  }

  execute() {
    return this.todoListsRepo.getAll();
  }
}