import { createMessage } from '../utils/helpers/createElement.js';
import { createList } from '../utils/helpers/dom/toDoDom.js';
import { Todo } from '../domain/entities/todo/Todo.js';
import { TodoList } from '../domain/entities/todolist/TodoList.js';
import { AppGetAllTodoListsUsecase } from '../interface-adapters/use-cases/AppGetAllTodoListsUsecase.js';
import { AppDeleteTodoFromListUsecase } from '../interface-adapters/use-cases/AppDeleteTodoFromListUsecase.js';

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

export function getTodoListsFromLocalStorage() {
  try {
    const allTodo = AppGetAllTodoListsUsecase.execute();

    return allTodo.map((todo) => todo.toJSON());
  } catch (error) {
    console.error('invalid Todo in localSotrage', error);
    return [];
  }
}

export function deleteTodoFromList(todoId, listId) {
  AppDeleteTodoFromListUsecase.execute({ todoId, todoListId: listId });
}

export function deleteTodoListFromLocalStorage(currentId) {
  const allTodo = getTodoListsFromLocalStorage();
  const updatedTodos = allTodo.filter((todo) => todo.id !== currentId);

  const hasBeenSaved = saveTodo(updatedTodos);

  if (!hasBeenSaved) return allTodo;

  return updatedTodos;
}

function isValidTodoList(todo) {
  TodoList.create(todo);

  todo.items.every((item) => Todo.create(item));

  return true;
}
