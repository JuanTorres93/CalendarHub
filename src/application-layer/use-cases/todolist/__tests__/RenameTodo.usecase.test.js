import { beforeEach, describe, expect, it } from 'vitest';

import { LocalStorageTodoListsRepo } from '../../../../infra/repos/LocalStorageTodoListsRepo/LocalStorageTodoListsRepo.js';
import { createTestTodo } from '../../../../domain/entities/todo/__tests__/todoTestProps.js';
import { createTestTodoList } from '../../../../domain/entities/todolist/__tests__/todoListTestProps.js';
import { NotFoundDomainError } from '../../../../domain/common/domainErrors.js';

import { RenameTodoUsecase } from '../RenameTodo.usecase.js';

describe('RenameTodoUsecase', () => {
  let todoListsRepo;
  let renameTodoUsecase;
  let todoList;
  let todo;

  beforeEach(() => {
    localStorage.clear();

    todoListsRepo = new LocalStorageTodoListsRepo();
    renameTodoUsecase = new RenameTodoUsecase(todoListsRepo);

    todo = createTestTodo();
    todoList = createTestTodoList({ items: [todo.toCreateProps()] });
    todoListsRepo.save(todoList);
  });

  describe('execute', () => {
    it('should rename the todo and persist it', () => {
      const updatedTodoList = renameTodoUsecase.execute({
        todoId: todo.id,
        newTitle: 'renamed todo title',
      });

      expect(updatedTodoList.items[0].title).toBe('renamed todo title');

      const savedTodoList = todoListsRepo.getById(todoList.id);

      expect(savedTodoList.items[0].title).toBe('renamed todo title');
    });

    it('should throw a not found error when the todo is not in any todo list', () => {
      expect(() =>
        renameTodoUsecase.execute({
          todoId: 'non-existent-todo-id',
          newTitle: 'renamed todo title',
        }),
      ).toThrow(NotFoundDomainError);
    });
  });
});