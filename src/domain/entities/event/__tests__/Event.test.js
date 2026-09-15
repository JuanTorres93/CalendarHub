import { describe, it, expect } from 'vitest';
import { Event } from '../Event';
import { EVENT_TEST_PROPS } from './eventTestProps';
import { ValidationDomainError } from '../../../common/domainErrors.js';
import { NOTIFICATION_PERIODS } from '../../../value-objets/NotificationPeriod/NotificationPeriod.js';

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

  it('title should not be empty', async () => {
    const emptyTitle = '';
    const eventProps = { ...EVENT_TEST_PROPS, title: emptyTitle };

    expect(() => Event.create(eventProps)).toThrow(ValidationDomainError);
  });

  it('description should not exceed 200 characters', async () => {
    const longDescription = 'a'.repeat(201);
    const eventProps = { ...EVENT_TEST_PROPS, description: longDescription };

    expect(() => Event.create(eventProps)).toThrow(ValidationDomainError);
  });

  it.each(NOTIFICATION_PERIODS.map((period) => [period, period]))(
    'should create event for %s notification period',
    (notification, period) => {
      const eventProps = { ...EVENT_TEST_PROPS, notification: period };

      const event = Event.create(eventProps);

      expect(event).toBeInstanceOf(Event);
    },
  );
});
