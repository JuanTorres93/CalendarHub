import { TodoListsRepo } from '../../../application-layer/repos/TodoListsRepo.port.js';

export class MemoryTodoListsRepo extends TodoListsRepo {
  constructor() {
    super();

    this.todoLists = new Map();
  }

  getById(id) {
    const todoList = this.todoLists.get(id);

    return todoList ? todoList.clone() : null;
  }

  save(todoList) {
    this.todoLists.set(todoList.id, todoList.clone());
  }

  deleteById(id) {
    this.todoLists.delete(id);
  }

  getListByTodoId(todoId) {
    const todoList = [...this.todoLists.values()].find((storedTodoList) =>
      storedTodoList.items.some((item) => item.id === todoId),
    );

    return todoList ? todoList.clone() : null;
  }

  clearAllForTesting() {
    this.todoLists.clear();
  }
}