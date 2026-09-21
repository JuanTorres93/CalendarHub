import { TodoList } from '../../../domain/entities/todolist/TodoList.js';

export class CreateTodoListUsecase {
  constructor(todoListsRepo, idGenerator) {
    this.todoListsRepo = todoListsRepo;
    this.idGenerator = idGenerator;
  }

  execute({ date, title }) {
    const todoList = TodoList.create({
      id: this.idGenerator.generateId(),
      date,
      title,
      items: [],
    });

    this.todoListsRepo.save(todoList);

    return todoList;
  }
}