import { beforeEach, describe, expect, it } from 'vitest';

import { createTestTodo } from '../../../domain/entities/todo/__tests__/todoTestProps.js';
import { createTestTodoList } from '../../../domain/entities/todolist/__tests__/todoListTestProps.js';
import { LocalStorageTodoListsRepo } from '../LocalStorageTodoListsRepo/LocalStorageTodoListsRepo.js';
import { MemoryTodoListsRepo } from '../MemoryTodoListsRepo/MemoryTodoListsRepo.js';

const repos = [
  { name: 'LocalStorageTodoListsRepo', repoClass: LocalStorageTodoListsRepo },
  { name: 'MemoryTodoListsRepo', repoClass: MemoryTodoListsRepo },
];

repos.forEach(({ name, repoClass }) => {
  describe(name, () => {
    let repo;
    let todoList;

    beforeEach(() => {
      if (name === 'LocalStorageTodoListsRepo') localStorage.clear();

      repo = new repoClass();

      todoList = createTestTodoList({
        items: [createTestTodo().toCreateProps()],
      });

      repo.save(todoList);
    });

    describe('getById', () => {
      it('should return the todo list with the given id', () => {
        const fetchedTodoList = repo.getById(todoList.id);

        expect(fetchedTodoList.toCreateProps()).toEqual(
          todoList.toCreateProps(),
        );
      });

      it('should return null if no todo list is found with the given id', () => {
        const fetchedTodoList = repo.getById('non-existent-todolist-id');

        expect(fetchedTodoList).toBeNull();
      });
    });

    describe('save', () => {
      it('should save a new todo list', () => {
        const newTodoList = createTestTodoList({ id: 'new-todolist-id' });

        repo.save(newTodoList);

        const fetchedTodoList = repo.getById(newTodoList.id);

        expect(fetchedTodoList.toCreateProps()).toEqual(
          newTodoList.toCreateProps(),
        );
      });

      it('should update an existing todo list with the same id', () => {
        const updatedTodoList = createTestTodoList({
          id: todoList.id,
          title: 'Updated todolist title',
        });

        repo.save(updatedTodoList);

        const fetchedTodoList = repo.getById(todoList.id);

        expect(fetchedTodoList.toCreateProps()).toEqual(
          updatedTodoList.toCreateProps(),
        );
      });
    });

    describe('deleteById', () => {
      it('should delete the todo list with the given id', () => {
        repo.deleteById(todoList.id);

        expect(repo.getById(todoList.id)).toBeNull();
      });

      it('should not fail when deleting a non-existing todo list', () => {
        repo.deleteById('non-existent-todolist-id');

        expect(repo.getById(todoList.id)).not.toBeNull();
      });

      it('should remove the todo from the repo when its list is deleted', () => {
        const todoId = todoList.items[0].id;

        expect(repo.getListByTodoId(todoId)).not.toBeNull();

        repo.deleteById(todoList.id);

        expect(repo.getListByTodoId(todoId)).toBeNull();
        expect(repo.getById(todoList.id)).toBeNull();
      });
    });

    describe('getListByTodoId', () => {
      it('should return the todo list containing the todo with the given id', () => {
        const todoId = todoList.items[0].id;

        const fetchedTodoList = repo.getListByTodoId(todoId);

        expect(fetchedTodoList.toCreateProps()).toEqual(
          todoList.toCreateProps(),
        );
      });

      it('should return null if no todo list contains the given todo id', () => {
        const fetchedTodoList = repo.getListByTodoId('non-existent-todo-id');

        expect(fetchedTodoList).toBeNull();
      });

      it('should return the correct list when multiple lists are stored', () => {
        const otherTodo = createTestTodo({ id: 'other-todo-id' });
        const otherTodoList = createTestTodoList({
          id: 'other-todolist-id',
          items: [otherTodo.toCreateProps()],
        });

        repo.save(otherTodoList);

        const fetchedTodoList = repo.getListByTodoId(otherTodo.id);

        expect(fetchedTodoList.toCreateProps()).toEqual(
          otherTodoList.toCreateProps(),
        );
      });
    });

    describe('round trip', () => {
      it('should preserve todo items after rehydration', () => {
        const fetchedTodoList = repo.getById(todoList.id);

        expect(fetchedTodoList.items[0].id).toBe(todoList.items[0].id);
        expect(fetchedTodoList.items[0].title).toBe(todoList.items[0].title);
        expect(fetchedTodoList.items[0].completed).toBe(
          todoList.items[0].completed,
        );
      });
    });

    it.skipIf(name !== 'LocalStorageTodoListsRepo')(
      'should read no todo lists from empty storage',
      () => {
        localStorage.removeItem('calendarTodoLists');

        const emptyRepo = new repoClass();

        expect(emptyRepo.getById(todoList.id)).toBeNull();
        expect(emptyRepo.getListByTodoId('any-todo-id')).toBeNull();
      },
    );

    it.skipIf(name !== 'LocalStorageTodoListsRepo')(
      'should read no todo lists from corrupted storage data',
      () => {
        localStorage.setItem('calendarTodoLists', '{corrupted json');

        const emptyRepo = new repoClass();

        expect(emptyRepo.getById(todoList.id)).toBeNull();
        expect(emptyRepo.getListByTodoId('any-todo-id')).toBeNull();
      },
    );
  });
});