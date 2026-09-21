import { beforeEach, describe, expect, it } from 'vitest';

import { LocalStorageTodoListsRepo } from '../../../../infra/repos/LocalStorageTodoListsRepo/LocalStorageTodoListsRepo.js';
import { createTestTodoList } from '../../../../domain/entities/todolist/__tests__/todoListTestProps.js';
import { NotFoundDomainError } from '../../../../domain/common/domainErrors.js';

import { DeleteTodoListUsecase } from '../DeleteTodoList.usecase.js';

describe('DeleteTodoListUsecase', () => {
  let todoListsRepo;
  let deleteTodoListUsecase;
  let todoList;

  beforeEach(() => {
    localStorage.clear();

    todoListsRepo = new LocalStorageTodoListsRepo();
    deleteTodoListUsecase = new DeleteTodoListUsecase(todoListsRepo);

    todoList = createTestTodoList();
    todoListsRepo.save(todoList);
  });

  describe('execute', () => {
    it('should delete the todo list', () => {
      deleteTodoListUsecase.execute({ id: todoList.id });

      expect(todoListsRepo.getById(todoList.id)).toBeNull();
    });

    it('should throw a not found error when the todo list does not exist', () => {
      expect(() =>
        deleteTodoListUsecase.execute({ id: 'non-existent-todolist-id' }),
      ).toThrow(NotFoundDomainError);
    });
  });
});