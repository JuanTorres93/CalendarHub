import { Event } from '../Event';

export const EVENT_TEST_PROPS = {
  id: 'test-event-id',
  title: 'test event title',
  description: 'Test event description',

  date: '2024-06-01',
  from: '10:00',
  to: '11:00',

  icon: '🌳',
  color: 'blue',
  urgent: false,
  allDay: false,
  notification: 'none',

  repeat: null,
};

export function createTestEvent(overrides = {}) {
  return Event.create({
    ...EVENT_TEST_PROPS,
    ...overrides,
  });
}
