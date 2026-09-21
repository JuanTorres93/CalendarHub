import { beforeEach, describe, expect, it } from 'vitest';

import { LocalStorageTodoListsRepo } from '../../../../infra/repos/LocalStorageTodoListsRepo/LocalStorageTodoListsRepo.js';
import { TodoList } from '../../../../domain/entities/todolist/TodoList.js';
import { createTestTodoList } from '../../../../domain/entities/todolist/__tests__/todoListTestProps.js';

import { GetAllTodoListsUsecase } from '../GetAllTodoLists.usecase.js';

describe('GetAllTodoListsUsecase', () => {
  let todoListsRepo;
  let getAllTodoListsUsecase;

  beforeEach(() => {
    localStorage.clear();

    todoListsRepo = new LocalStorageTodoListsRepo();
    getAllTodoListsUsecase = new GetAllTodoListsUsecase(todoListsRepo);
  });

  describe('execute', () => {
    it('should return all todo lists', () => {
      const todoList = createTestTodoList();
      const secondTodoList = createTestTodoList({
        id: 'second-todolist-id',
        title: 'Second todolist',
      });

      todoListsRepo.save(todoList);
      todoListsRepo.save(secondTodoList);

      const result = getAllTodoListsUsecase.execute();

      expect(
        result.map((fetchedTodoList) => fetchedTodoList.toCreateProps()),
      ).toEqual([todoList.toCreateProps(), secondTodoList.toCreateProps()]);
    });

    it('should return an empty array when no todo lists are saved', () => {
      const result = getAllTodoListsUsecase.execute();

      expect(result).toEqual([]);
    });

    it('should return todo list entities', () => {
      const todoList = createTestTodoList();

      todoListsRepo.save(todoList);

      const result = getAllTodoListsUsecase.execute();

      result.forEach((fetchedTodoList) => {
        expect(fetchedTodoList).toBeInstanceOf(TodoList);
      });
    });
  });
});