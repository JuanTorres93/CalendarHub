import { Todo } from '../Todo';

export const TODO_TEST_PROPS = {
  id: 'test-todo-id',
  title: 'test todo title',
  completed: false,
};

export function createTestTodo(overrides = {}) {
  return Todo.create({
    ...TODO_TEST_PROPS,
    ...overrides,
  });
}