import { describe, it, expect } from 'vitest';
import { TodoList } from '../TodoList';
import { Todo } from '../../todo/Todo.js';
import { createTestTodo } from '../../todo/__tests__/todoTestProps';
import { TODOLIST_TEST_PROPS, createTestTodoList } from './todoListTestProps';
import {
  AlreadyExistsDomainError,
  NotFoundDomainError,
  ValidationDomainError,
} from '../../../common/domainErrors.js';

describe('TodoList', () => {
  describe('Validation', () => {
    it('should create a todolist', () => {
      const todoList = TodoList.create(TODOLIST_TEST_PROPS);

      expect(todoList).toBeInstanceOf(TodoList);
    });

    it('title should not be empty', () => {
      const todoListProps = { ...TODOLIST_TEST_PROPS, title: '' };

      expect(() => TodoList.create(todoListProps)).toThrow(
        ValidationDomainError,
      );
    });
  });

  describe('properties', () => {
    it.each([
      ['id', TODOLIST_TEST_PROPS.id],
      ['date', TODOLIST_TEST_PROPS.date],
      ['title', TODOLIST_TEST_PROPS.title],
      ['items', []],
    ])('should have property %s', (key, value) => {
      const todoList = TodoList.create(TODOLIST_TEST_PROPS);

      expect(todoList).toHaveProperty(key, value);
    });
  });

  describe('Default values', () => {
    it('items should default to an empty array if it is not provided', () => {
      const todoListProps = { ...TODOLIST_TEST_PROPS };
      delete todoListProps.items;

      const todoList = TodoList.create(todoListProps);

      expect(todoList.items).toEqual([]);
    });
  });

  describe('items getter', () => {
    it('should return a defensive copy of the items array', () => {
      const todo = createTestTodo();
      const todoList = createTestTodoList({ items: [todo] });

      const returnedItems = todoList.items;
      returnedItems.pop();

      expect(todoList.items).toHaveLength(1);
    });

    it('should convert plain todo create props into Todo instances', () => {
      const todo = createTestTodo();
      const todoList = createTestTodoList({
        items: [todo.toCreateProps()],
      });

      expect(todoList.items[0]).toBeInstanceOf(Todo);
    });
  });

  describe('rename', () => {
    it('should rename the todolist', () => {
      const todoList = createTestTodoList();

      todoList.rename('renamed todolist');

      expect(todoList.title).toBe('renamed todolist');
    });

    it('should throw when the new name is empty', () => {
      const todoList = createTestTodoList();

      expect(() => todoList.rename('')).toThrow(ValidationDomainError);
    });
  });

  describe('addTodo', () => {
    it('should add a todo to the todolist', () => {
      const todo = createTestTodo();
      const todoList = createTestTodoList();

      todoList.addTodo(todo);

      expect(todoList.items).toEqual([todo]);
    });

    it('should throw when a todo with the same id already exists', () => {
      const todo = createTestTodo();
      const todoList = createTestTodoList({ items: [todo] });

      expect(() => todoList.addTodo(todo)).toThrow(AlreadyExistsDomainError);
    });

    it('should throw when the item is not a Todo entity', () => {
      const todoList = createTestTodoList();

      expect(() => todoList.addTodo({ id: 'not-a-todo' })).toThrow(
        ValidationDomainError,
      );
    });
  });

  describe('removeTodo', () => {
    it('should remove the todo with the given id', () => {
      const todo = createTestTodo();
      const todoList = createTestTodoList({ items: [todo] });

      todoList.removeTodo(todo.id);

      expect(todoList.items).toEqual([]);
    });

    it('should throw when no todo matches the given id', () => {
      const todoList = createTestTodoList();

      expect(() => todoList.removeTodo('unknown-todo-id')).toThrow(
        NotFoundDomainError,
      );
    });
  });

  describe('toCreateProps', () => {
    it('should return the todolist as a plain object', () => {
      const todo = createTestTodo();
      const todoList = createTestTodoList({ items: [todo] });

      expect(todoList.toCreateProps()).toEqual({
        ...TODOLIST_TEST_PROPS,
        items: [todo.toCreateProps()],
      });
    });
  });

  describe('toJSON', () => {
    it('should return the todolist as a plain object', () => {
      const todo = createTestTodo();
      const todoList = createTestTodoList({ items: [todo] });

      expect(todoList.toJSON()).toEqual({
        ...TODOLIST_TEST_PROPS,
        items: [todo.toJSON()],
      });
    });

    it('should serialize nested items as plain objects with JSON.stringify', () => {
      const todo = createTestTodo();
      const todoList = createTestTodoList({ items: [todo] });

      expect(JSON.parse(JSON.stringify(todoList))).toEqual({
        ...TODOLIST_TEST_PROPS,
        items: [todo.toJSON()],
      });
    });
  });

  describe('clone', () => {
    it('should produce an independent aggregate', () => {
      const todo = createTestTodo();
      const todoList = createTestTodoList({ items: [todo] });
      const clonedTodoList = todoList.clone();

      clonedTodoList.removeTodo(todo.id);

      expect(clonedTodoList.items).toEqual([]);
      expect(todoList.items).toHaveLength(1);
    });
  });
});