import { TodoListsRepo } from '../../../application-layer/repos/TodoListsRepo.port.js';
import { TodoList } from '../../../domain/entities/todolist/TodoList.js';

const STORAGE_KEY = 'calendarTodoLists';

export class LocalStorageTodoListsRepo extends TodoListsRepo {
  getById(id) {
    const storedTodoList = readRawTodoLists().find(
      (todoList) => todoList.id === id,
    );

    return storedTodoList ? TodoList.create(storedTodoList) : null;
  }

  save(todoList) {
    const storedTodoLists = readRawTodoLists();
    const todoListData = todoList.toCreateProps();

    const existingTodoListIndex = storedTodoLists.findIndex(
      (storedTodoList) => storedTodoList.id === todoList.id,
    );

    if (existingTodoListIndex === -1) {
      storedTodoLists.push(todoListData);
    } else {
      storedTodoLists[existingTodoListIndex] = todoListData;
    }

    writeTodoLists(storedTodoLists);
  }

  deleteById(id) {
    const storedTodoLists = readRawTodoLists();

    writeTodoLists(
      storedTodoLists.filter((storedTodoList) => storedTodoList.id !== id),
    );
  }

  getListByTodoId(todoId) {
    const storedTodoList = readRawTodoLists().find((todoList) =>
      todoList.items.some((item) => item.id === todoId),
    );

    return storedTodoList ? TodoList.create(storedTodoList) : null;
  }

  clearAllForTesting() {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function readRawTodoLists() {
  const storedTodoLists = localStorage.getItem(STORAGE_KEY);

  if (!storedTodoLists) {
    return [];
  }

  try {
    const parsedTodoLists = JSON.parse(storedTodoLists);

    if (!Array.isArray(parsedTodoLists)) return [];

    return parsedTodoLists;
  } catch {
    return [];
  }
}

function writeTodoLists(todoLists) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todoLists));
}