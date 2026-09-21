import { describe, it, expect } from 'vitest';
import { Todo } from '../Todo';
import { TODO_TEST_PROPS, createTestTodo } from './todoTestProps';
import { ValidationDomainError } from '../../../common/domainErrors.js';

describe('Todo', () => {
  describe('Validation', () => {
    it('should create a todo', () => {
      const todo = Todo.create(TODO_TEST_PROPS);

      expect(todo).toBeInstanceOf(Todo);
    });

    it('title should not be empty', () => {
      const todoProps = { ...TODO_TEST_PROPS, title: '' };

      expect(() => Todo.create(todoProps)).toThrow(ValidationDomainError);
    });
  });

  describe('properties', () => {
    it.each([
      ['id', TODO_TEST_PROPS.id],
      ['title', TODO_TEST_PROPS.title],
      ['completed', TODO_TEST_PROPS.completed],
    ])('should have property %s', (key, value) => {
      const todo = Todo.create(TODO_TEST_PROPS);

      expect(todo).toHaveProperty(key, value);
    });
  });

  describe('Default values', () => {
    it('completed should default to false if it is not provided', () => {
      const todoProps = { ...TODO_TEST_PROPS };
      delete todoProps.completed;

      const todo = Todo.create(todoProps);

      expect(todo.completed).toBe(false);
    });
  });

  describe('rename', () => {
    it('should rename the todo', () => {
      const todo = createTestTodo();

      todo.rename('renamed todo');

      expect(todo.title).toBe('renamed todo');
    });

    it('should throw when the new name is empty', () => {
      const todo = createTestTodo();

      expect(() => todo.rename('')).toThrow(ValidationDomainError);
    });
  });

  describe('toggleCompleted', () => {
    it('should toggle completed from false to true', () => {
      const todo = createTestTodo({ completed: false });

      todo.toggleCompleted();

      expect(todo.completed).toBe(true);
    });

    it('should toggle completed from true to false', () => {
      const todo = createTestTodo({ completed: true });

      todo.toggleCompleted();

      expect(todo.completed).toBe(false);
    });
  });

  describe('toCreateProps', () => {
    it('should return the todo as a plain object', () => {
      const todo = createTestTodo();

      expect(todo.toCreateProps()).toEqual(TODO_TEST_PROPS);
    });
  });

  describe('toJSON', () => {
    it('should return the todo as a plain object', () => {
      const todo = createTestTodo();

      expect(todo.toJSON()).toEqual(TODO_TEST_PROPS);
    });

    it('should serialize as a plain object with JSON.stringify', () => {
      const todo = createTestTodo();

      expect(JSON.parse(JSON.stringify(todo))).toEqual(TODO_TEST_PROPS);
    });
  });

  describe('clone', () => {
    it('should produce an independent instance', () => {
      const todo = createTestTodo();
      const clonedTodo = todo.clone();

      clonedTodo.rename('cloned name');

      expect(clonedTodo.title).toBe('cloned name');
      expect(todo.title).toBe(TODO_TEST_PROPS.title);
    });
  });
});