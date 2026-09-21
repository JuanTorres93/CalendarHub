import { beforeEach, describe, expect, it } from 'vitest';

import { LocalStorageTodoListsRepo } from '../../../../infra/repos/LocalStorageTodoListsRepo/LocalStorageTodoListsRepo.js';
import { CryptoUUIDIdGenerator } from '../../../../infra/services/CryptoUUIDIdGenerator/CryptoUUIDIdGenerator.js';
import { createTestTodoList } from '../../../../domain/entities/todolist/__tests__/todoListTestProps.js';
import { Todo } from '../../../../domain/entities/todo/Todo.js';
import { NotFoundDomainError } from '../../../../domain/common/domainErrors.js';

import { AddTodoToListUsecase } from '../AddTodoToList.usecase.js';

describe('AddTodoToListUsecase', () => {
  let todoListsRepo;
  let idGenerator;
  let addTodoToListUsecase;
  let todoList;

  beforeEach(() => {
    localStorage.clear();

    todoListsRepo = new LocalStorageTodoListsRepo();
    idGenerator = new CryptoUUIDIdGenerator();
    addTodoToListUsecase = new AddTodoToListUsecase(todoListsRepo, idGenerator);

    todoList = createTestTodoList();
    todoListsRepo.save(todoList);
  });

  describe('execute', () => {
    it('should add a todo with a generated id to the todo list', () => {
      const updatedTodoList = addTodoToListUsecase.execute({
        todoListId: todoList.id,
        title: 'new todo title',
      });

      expect(updatedTodoList.items).toHaveLength(1);
      expect(updatedTodoList.items[0]).toBeInstanceOf(Todo);
      expect(updatedTodoList.items[0].id).toBeDefined();
      expect(updatedTodoList.items[0].title).toBe('new todo title');
      expect(updatedTodoList.items[0].completed).toBe(false);
    });

    it('should persist the added todo in the repo', () => {
      addTodoToListUsecase.execute({
        todoListId: todoList.id,
        title: 'new todo title',
      });

      const savedTodoList = todoListsRepo.getById(todoList.id);

      expect(savedTodoList.items).toHaveLength(1);
      expect(savedTodoList.items[0].title).toBe('new todo title');
    });

    it('should throw a not found error when the todo list does not exist', () => {
      expect(() =>
        addTodoToListUsecase.execute({
          todoListId: 'non-existent-todolist-id',
          title: 'new todo title',
        }),
      ).toThrow(NotFoundDomainError);
    });
  });
});