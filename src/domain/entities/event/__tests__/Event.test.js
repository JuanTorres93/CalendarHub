import { describe, it, expect } from 'vitest';
import { Event } from '../Event';
import { EVENT_TEST_PROPS } from './eventTestProps';

describe('Event', () => {
  it('should create an event', () => {
    const event = Event.create(EVENT_TEST_PROPS);

    expect(event).toBeInstanceOf(Event);
  });

  describe('properties', () => {
    it.each([
      ['id', EVENT_TEST_PROPS.id],
      ['title', EVENT_TEST_PROPS.title],
      ['description', EVENT_TEST_PROPS.description],
      ['date', EVENT_TEST_PROPS.date],
      ['from', EVENT_TEST_PROPS.from],
      ['to', EVENT_TEST_PROPS.to],
      ['icon', EVENT_TEST_PROPS.icon],
      ['color', EVENT_TEST_PROPS.color],
      ['urgent', EVENT_TEST_PROPS.urgent],
      ['allDay', EVENT_TEST_PROPS.allDay],
      ['notification', EVENT_TEST_PROPS.notification],
    ])('should have property %s', (key, value) => {
      const event = Event.create(EVENT_TEST_PROPS);

      expect(event).toHaveProperty(key, value);
    });
  });
});
