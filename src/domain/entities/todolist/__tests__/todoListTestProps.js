import { TodoList } from '../TodoList';

export const TODOLIST_TEST_PROPS = {
  id: 'test-todolist-id',
  date: '2024-06-01',
  title: 'test todolist title',
  items: [],
};

export function createTestTodoList(overrides = {}) {
  return TodoList.create({
    ...TODOLIST_TEST_PROPS,
    ...overrides,
  });
}