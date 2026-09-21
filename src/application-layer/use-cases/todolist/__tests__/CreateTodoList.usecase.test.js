import { beforeEach, describe, expect, it } from 'vitest';

import { LocalStorageTodoListsRepo } from '../../../../infra/repos/LocalStorageTodoListsRepo/LocalStorageTodoListsRepo.js';
import { CryptoUUIDIdGenerator } from '../../../../infra/services/CryptoUUIDIdGenerator/CryptoUUIDIdGenerator.js';
import { TodoList } from '../../../../domain/entities/todolist/TodoList.js';
import { ValidationDomainError } from '../../../../domain/common/domainErrors.js';

import { CreateTodoListUsecase } from '../CreateTodoList.usecase.js';

describe('CreateTodoListUsecase', () => {
  let todoListsRepo;
  let idGenerator;
  let createTodoListUsecase;
  let todoList;
  let todoListRequest;

  beforeEach(() => {
    localStorage.clear();

    todoListsRepo = new LocalStorageTodoListsRepo();
    idGenerator = new CryptoUUIDIdGenerator();
    createTodoListUsecase = new CreateTodoListUsecase(
      todoListsRepo,
      idGenerator,
    );

    todoListRequest = { date: '2024-06-01', title: 'test todolist title' };

    todoList = createTodoListUsecase.execute({ ...todoListRequest });
  });

  describe('execute', () => {
    it('should create the todo list with a generated id and empty items', () => {
      expect(todoList).toBeInstanceOf(TodoList);
      expect(todoList.id).toBeDefined();
      expect(todoList.date).toBe(todoListRequest.date);
      expect(todoList.title).toBe(todoListRequest.title);
      expect(todoList.items).toEqual([]);
    });

    it('should persist the todo list in the repo', () => {
      const savedTodoList = todoListsRepo.getById(todoList.id);

      expect(savedTodoList).not.toBeNull();
      expect(savedTodoList.toCreateProps()).toEqual(todoList.toCreateProps());
    });

    it('should throw a validation error when the title is empty', () => {
      expect(() =>
        createTodoListUsecase.execute({ ...todoListRequest, title: '' }),
      ).toThrow(ValidationDomainError);
    });
  });
});