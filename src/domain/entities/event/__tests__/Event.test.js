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

  it.each(
    [
      'description',
      'date',
      'icon',
      'color',
      'urgent',
      'allDay',
      'notification',
      'repeat',
    ].map((property) => [property, property]),
  )('should create event if no %s is passed', (propertyKey, property) => {
    const eventProps = { ...EVENT_TEST_PROPS };
    delete eventProps[propertyKey];

    const event = Event.create(eventProps);

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
      ['repeat', EVENT_TEST_PROPS.repeat],
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

  describe('Default values', () => {
    it('should default to 5 min notification if it is not provided', async () => {
      const eventProps = { ...EVENT_TEST_PROPS };
      delete eventProps.notification;

      const event = Event.create(eventProps);

      expect(event.notification).toBe('5min');
    });

    it('urgent should default to false if it is not provided', async () => {
      const eventProps = { ...EVENT_TEST_PROPS };
      delete eventProps.urgent;

      const event = Event.create(eventProps);

      expect(event.urgent).toBe(false);
    });

    it('allDay should default to false if it is not provided', async () => {
      const eventProps = { ...EVENT_TEST_PROPS };
      delete eventProps.allDay;

      const event = Event.create(eventProps);

      expect(event.allDay).toBe(false);
    });

    it('icon should default to pencil icon if it is not provided', async () => {
      const eventProps = { ...EVENT_TEST_PROPS };
      delete eventProps.icon;

      const event = Event.create(eventProps);

      expect(event.icon).toBe('✏️');
    });

    it('color should default to blue if not provided', async () => {
      const eventProps = { ...EVENT_TEST_PROPS };
      delete eventProps.color;

      const event = Event.create(eventProps);

      expect(event.color).toBe('blue');
    });

    it('should set default repeat to null', async () => {
      const eventProps = { ...EVENT_TEST_PROPS };
      delete eventProps.repeat;

      const event = Event.create(eventProps);

      expect(event.repeat).toBeNull();
    });

    it('should default the date to today if it is not provided', async () => {
      const eventProps = { ...EVENT_TEST_PROPS };
      delete eventProps.date;

      const event = Event.create(eventProps);

      const today = new Date().toISOString().split('T')[0];
      expect(event.date).toBe(today);
    });
  });

  it('should keep the repeat config if it is provided', async () => {
    const repeatConfig = {
      seriesId: 'series-id',
      type: 'weekly',
      interval: 1,
      until: '2024-07-01',
      weekdays: [1, 3],
      customDates: [],
      exceptions: ['2024-06-20'],
    };
    const eventProps = { ...EVENT_TEST_PROPS, repeat: repeatConfig };

    const event = Event.create(eventProps);

    expect(event.repeat).toEqual(repeatConfig);
  });
});
