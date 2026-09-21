import { beforeEach, describe, expect, it } from 'vitest';

import { LocalStorageTodoListsRepo } from '../../../../infra/repos/LocalStorageTodoListsRepo/LocalStorageTodoListsRepo.js';
import { createTestTodo } from '../../../../domain/entities/todo/__tests__/todoTestProps.js';
import { createTestTodoList } from '../../../../domain/entities/todolist/__tests__/todoListTestProps.js';
import { NotFoundDomainError } from '../../../../domain/common/domainErrors.js';

import { DeleteTodoFromListUsecase } from '../DeleteTodoFromList.usecase.js';

describe('DeleteTodoFromListUsecase', () => {
  let todoListsRepo;
  let deleteTodoFromListUsecase;
  let todoList;
  let todo;

  beforeEach(() => {
    localStorage.clear();

    todoListsRepo = new LocalStorageTodoListsRepo();
    deleteTodoFromListUsecase = new DeleteTodoFromListUsecase(todoListsRepo);

    todo = createTestTodo();
    todoList = createTestTodoList({ items: [todo.toCreateProps()] });
    todoListsRepo.save(todoList);
  });

  describe('execute', () => {
    it('should delete the todo from the todo list and persist it', () => {
      const updatedTodoList = deleteTodoFromListUsecase.execute({
        todoListId: todoList.id,
        todoId: todo.id,
      });

      expect(updatedTodoList.items).toHaveLength(0);

      const savedTodoList = todoListsRepo.getById(todoList.id);

      expect(savedTodoList.items).toHaveLength(0);
    });

    it('should throw a not found error when the todo list does not exist', () => {
      expect(() =>
        deleteTodoFromListUsecase.execute({
          todoListId: 'non-existent-todolist-id',
          todoId: todo.id,
        }),
      ).toThrow(NotFoundDomainError);
    });

    it('should throw a not found error when the todo does not exist', () => {
      expect(() =>
        deleteTodoFromListUsecase.execute({
          todoListId: todoList.id,
          todoId: 'non-existent-todo-id',
        }),
      ).toThrow(NotFoundDomainError);
    });
  });
});