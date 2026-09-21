import { beforeEach, describe, expect, it } from 'vitest';

import { LocalStorageTodoListsRepo } from '../../../../infra/repos/LocalStorageTodoListsRepo/LocalStorageTodoListsRepo.js';
import { createTestTodo } from '../../../../domain/entities/todo/__tests__/todoTestProps.js';
import { createTestTodoList } from '../../../../domain/entities/todolist/__tests__/todoListTestProps.js';
import { NotFoundDomainError } from '../../../../domain/common/domainErrors.js';

import { ToggleTodoCompletionUsecase } from '../ToggleTodoCompletion.usecase.js';

describe('ToggleTodoCompletionUsecase', () => {
  let todoListsRepo;
  let toggleTodoCompletionUsecase;
  let todoList;
  let todo;

  beforeEach(() => {
    localStorage.clear();

    todoListsRepo = new LocalStorageTodoListsRepo();
    toggleTodoCompletionUsecase = new ToggleTodoCompletionUsecase(
      todoListsRepo,
    );

    todo = createTestTodo();
    todoList = createTestTodoList({ items: [todo.toCreateProps()] });
    todoListsRepo.save(todoList);
  });

  describe('execute', () => {
    it('should toggle the todo completion and persist it', () => {
      const updatedTodoList = toggleTodoCompletionUsecase.execute({
        todoId: todo.id,
      });

      expect(updatedTodoList.items[0].completed).toBe(!todo.completed);

      const savedTodoList = todoListsRepo.getById(todoList.id);

      expect(savedTodoList.items[0].completed).toBe(!todo.completed);
    });

    it('should throw a not found error when the todo is not in any todo list', () => {
      expect(() =>
        toggleTodoCompletionUsecase.execute({ todoId: 'non-existent-todo-id' }),
      ).toThrow(NotFoundDomainError);
    });
  });
});