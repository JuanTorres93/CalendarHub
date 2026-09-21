import { beforeEach, describe, expect, it } from 'vitest';

import { LocalStorageTodoListsRepo } from '../../../../infra/repos/LocalStorageTodoListsRepo/LocalStorageTodoListsRepo.js';
import { createTestTodoList } from '../../../../domain/entities/todolist/__tests__/todoListTestProps.js';
import { NotFoundDomainError } from '../../../../domain/common/domainErrors.js';

import { RenameTodoListUsecase } from '../RenameTodoList.usecase.js';

describe('RenameTodoListUsecase', () => {
  let todoListsRepo;
  let renameTodoListUsecase;
  let todoList;

  beforeEach(() => {
    localStorage.clear();

    todoListsRepo = new LocalStorageTodoListsRepo();
    renameTodoListUsecase = new RenameTodoListUsecase(todoListsRepo);

    todoList = createTestTodoList();
    todoListsRepo.save(todoList);
  });

  describe('execute', () => {
    it('should rename the todo list and persist it', () => {
      const updatedTodoList = renameTodoListUsecase.execute({
        id: todoList.id,
        newTitle: 'renamed todolist title',
      });

      expect(updatedTodoList.title).toBe('renamed todolist title');

      const savedTodoList = todoListsRepo.getById(todoList.id);

      expect(savedTodoList.title).toBe('renamed todolist title');
    });

    it('should throw a not found error when the todo list does not exist', () => {
      expect(() =>
        renameTodoListUsecase.execute({
          id: 'non-existent-todolist-id',
          newTitle: 'renamed todolist title',
        }),
      ).toThrow(NotFoundDomainError);
    });
  });
});