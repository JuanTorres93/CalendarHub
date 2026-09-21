import { createMessage } from '../utils/helpers/createElement.js';
import { createList } from '../utils/helpers/dom/toDoDom.js';
import { Todo } from '../domain/entities/todo/Todo.js';
import { TodoList } from '../domain/entities/todolist/TodoList.js';
import { AppGetAllTodoListsUsecase } from '../interface-adapters/use-cases/AppGetAllTodoListsUsecase.js';
import { AppDeleteTodoFromListUsecase } from '../interface-adapters/use-cases/AppDeleteTodoFromListUsecase.js';
import { AppDeleteTodoListUsecase } from '../interface-adapters/use-cases/AppDeleteTodoListUsecase.js';
import { AppCreateTodoListUsecase } from '../interface-adapters/use-cases/AppCreateTodoListUsecase.js';
import { AppAddTodoToListUsecase } from '../interface-adapters/use-cases/AppAddTodoToListUsecase.js';
import { AppRenameTodoListUsecase } from '../interface-adapters/use-cases/AppRenameTodoListUsecase.js';
import { AppToggleTodoCompletionUsecase } from '../interface-adapters/use-cases/AppToggleTodoCompletionUsecase.js';

export function getTodoListsFromLocalStorage() {
  try {
    return AppGetAllTodoListsUsecase.execute();
  } catch (error) {
    console.error('invalid Todo in localStorage', error);

    return [];
  }
}

export function deleteTodoFromList(todoId, listId) {
  AppDeleteTodoFromListUsecase.execute({ todoId, todoListId: listId });
}

export function deleteTodoListFromLocalStorage(currentId) {
  AppDeleteTodoListUsecase.execute({ id: currentId });
}

export function createTodoList(date, title) {
  return AppCreateTodoListUsecase.execute({ date, title });
}

export function addTodoToList(todoListId, title) {
  AppAddTodoToListUsecase.execute({ todoListId, title });
}

export function renameTodoList(todoListId, newTitle) {
  AppRenameTodoListUsecase.execute({ id: todoListId, newTitle });
}

export function toggleTodoCompletion(todoId) {
  AppToggleTodoCompletionUsecase.execute({ todoId });
}

function isValidTodoList(todo) {
  TodoList.create(todo);

  todo.items.every((item) => Todo.create(item));

  return true;
}

// Now unused, TODO: map italian error messages
export function saveTodo(todos) {
  if (!Array.isArray(todos)) {
    createMessage(
      'Salvataggio non riuscito: formato dei dati non valido.',
      createList,
      document.body,
    );
    return false;
  }
  const hasValidTodos = todos.every(isValidTodoList);

  if (!hasValidTodos) {
    createMessage(
      'Salvataggio non riuscito: i dati della todo list non sono validi.',
      createList,
      document.body,
    );
    return false;
  }

  try {
    localStorage.setItem('todoEvents', JSON.stringify(todos));
    return true;
  } catch (error) {
    console.error('Failed to save Todo lists in localStorage:', error);
    createMessage(
      'Salvataggio non riuscito. Il browser non ha potuto memorizzare la Todo.',
      createList,
      document.body,
    );

    return false;
  }
}
