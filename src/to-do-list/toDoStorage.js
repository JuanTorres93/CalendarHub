import { createMessage } from '../utils/helpers/createElement.js';
import { createList } from '../utils/helpers/dom/toDoDom.js';
import { Todo } from '../domain/entities/todo/Todo.js';
import { TodoList } from '../domain/entities/todolist/TodoList.js';

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

export function getTodoFromLocalStorage() {
  try {
    const storedTodo = localStorage.getItem('todoEvents');
    if (!storedTodo) return [];
    const parsedTodo = JSON.parse(storedTodo);

    if (!Array.isArray(parsedTodo)) return [];

    return parsedTodo.filter((todo, index) => {
      const isValid = isValidTodoList(todo);

      if (!isValid) {
        console.warn(`Invalid todoEvent at index ${index} in localStorage`);
      }

      return isValid;
    });
  } catch (error) {
    console.error('invalid Todo in localSotrage', error);
    return [];
  }
}

export function deleteItemsFromLocalStorage(currentId, activeId) {
  const allTodo = getTodoFromLocalStorage();
  const modTodo = allTodo.map((todo) => {
    return todo.id === activeId
      ? {
          ...todo,
          items: todo.items.filter((x) => x.id !== currentId),
        }
      : todo;
  });

  const hasBeenSaved = saveTodo(modTodo);

  if (!hasBeenSaved) return allTodo;

  //faccio il return di modTodo, cosi che posso usare questo array per accedere al numero variante di attività completate
  return modTodo;
}

export function deleteTodoListFromLocalStorage(currentId) {
  const allTodo = getTodoFromLocalStorage();
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
