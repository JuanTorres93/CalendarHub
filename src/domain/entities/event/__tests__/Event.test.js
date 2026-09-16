import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { Event } from '../Event';
import { EVENT_TEST_PROPS } from './eventTestProps';
import { ValidationDomainError } from '../../../common/domainErrors.js';
import { NOTIFICATION_PERIODS } from '../../../value-objets/NotificationPeriod/NotificationPeriod.js';

describe('Event', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Validation', () => {
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

    it('should default from to the current hour if it is not provided', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2024, 5, 1, 9, 45));

      const eventProps = { ...EVENT_TEST_PROPS };
      delete eventProps.from;

      const event = Event.create(eventProps);

      expect(event.from).toBe('09:00');
    });

    it('should default to to one hour after from if it is not provided', () => {
      const eventProps = { ...EVENT_TEST_PROPS };
      delete eventProps.to;

      const event = Event.create(eventProps);

      expect(event.to).toBe('11:00');
    });

    it('should default to to one hour after from preserving minutes', () => {
      const eventProps = { ...EVENT_TEST_PROPS, from: '10:30' };
      delete eventProps.to;

      const event = Event.create(eventProps);

      expect(event.to).toBe('11:30');
    });
  });

  describe('from and to relationship', () => {
    it('should throw validation error if to is earlier than from', () => {
      const eventProps = { ...EVENT_TEST_PROPS, from: '11:00', to: '10:00' };

      expect(() => Event.create(eventProps)).toThrow(ValidationDomainError);
    });

    it('should throw validation error if to equals from', () => {
      const eventProps = { ...EVENT_TEST_PROPS, from: '10:00', to: '10:00' };

      expect(() => Event.create(eventProps)).toThrow(ValidationDomainError);
    });

    it('should throw validation error if from and to cross midnight', () => {
      const eventProps = { ...EVENT_TEST_PROPS, from: '23:30', to: '00:30' };

      expect(() => Event.create(eventProps)).toThrow(ValidationDomainError);
    });
  });

  describe('update', () => {
    let eventToUpdate;

    beforeEach(() => {
      eventToUpdate = Event.create(EVENT_TEST_PROPS);
    });

    it('should update the title of the event', () => {
      const newTitle = 'Updated Title';
      eventToUpdate.update({ title: newTitle });
      expect(eventToUpdate.title).toBe(newTitle);
    });

    it('should update the description of the event', async () => {
      const newDescription = 'Updated Description';
      eventToUpdate.update({ description: newDescription });
      expect(eventToUpdate.description).toBe(newDescription);
    });

    it('should update date of the event', async () => {
      const newDate = '2024-07-01';
      eventToUpdate.update({ date: newDate });

      expect(eventToUpdate.date).toBe(newDate);
    });

    it('should update the from time of the event', async () => {
      const newFrom = '09:00';
      eventToUpdate.update({ from: newFrom });
      expect(eventToUpdate.from).toBe(newFrom);
    });

    it('should update the to time of the event', async () => {
      const newTo = '12:00';
      eventToUpdate.update({ to: newTo });
      expect(eventToUpdate.to).toBe(newTo);
    });

    it('should update the notification of the event', async () => {
      const newNotification = '15min';
      eventToUpdate.update({ notification: newNotification });

      expect(eventToUpdate.notification).toBe(newNotification);
    });

    it('should update urgent of the event', async () => {
      const newUrgent = true;
      eventToUpdate.update({ urgent: newUrgent });

      expect(eventToUpdate.urgent).toBe(newUrgent);
    });

    it('should update allDay of the event', async () => {
      const newAllDay = true;
      eventToUpdate.update({ allDay: newAllDay });

      expect(eventToUpdate.allDay).toBe(newAllDay);
    });

    it('should update icon of the event', async () => {
      const newIcon = '🎉';
      eventToUpdate.update({ icon: newIcon });

      expect(eventToUpdate.icon).toBe(newIcon);
    });

    it('should update color of the event', async () => {
      const newColor = 'red';
      eventToUpdate.update({ color: newColor });

      expect(eventToUpdate.color).toBe(newColor);
    });

    it('should update repeat of the event', async () => {
      const newRepeat = {
        seriesId: 'series-id',
        type: 'weekly',
        interval: 1,
        until: '2024-07-01',
        weekdays: [1, 3],
        customDates: [],
        exceptions: ['2024-06-20'],
      };
      eventToUpdate.update({ repeat: newRepeat });

      expect(eventToUpdate.repeat).toEqual(newRepeat);
    });

    it('should clear the description of the event', async () => {
      eventToUpdate.update({ description: '' });

      expect(eventToUpdate.description).toBe('');
    });

    it('should update urgent from true to false', async () => {
      eventToUpdate.update({ urgent: true });
      eventToUpdate.update({ urgent: false });

      expect(eventToUpdate.urgent).toBe(false);
    });

    it('should update allDay from true to false', async () => {
      eventToUpdate.update({ allDay: true });
      eventToUpdate.update({ allDay: false });

      expect(eventToUpdate.allDay).toBe(false);
    });

    it('should clear the repeat of the event', async () => {
      eventToUpdate.update({
        repeat: {
          seriesId: 'series-id',
          type: 'weekly',
          interval: 1,
          until: '2024-07-01',
          weekdays: [1, 3],
          customDates: [],
          exceptions: [],
        },
      });
      eventToUpdate.update({ repeat: null });

      expect(eventToUpdate.repeat).toBeNull();
    });
  });

  describe('reset', () => {
    let eventToReset;

    beforeEach(() => {
      eventToReset = Event.create({
        ...EVENT_TEST_PROPS,
        description: 'some description',
        urgent: !EVENT_TEST_PROPS.urgent,
        allDay: !EVENT_TEST_PROPS.allDay,
        icon: '🎉',
        color: 'red',
        notification: '15min',
        repeat: {
          seriesId: 'series-id',
          type: 'weekly',
          interval: 1,
          until: '2024-07-01',
          weekdays: [1, 3],
          customDates: [],
          exceptions: [],
        },
      });
    });

    it('should reset all fields to their default values', () => {
      vi.useFakeTimers();
      vi.setSystemTime(new Date(2024, 5, 1, 9, 45));

      eventToReset.reset();

      expect(eventToReset.id).toBe(EVENT_TEST_PROPS.id);
      expect(eventToReset.title).toBe(EVENT_TEST_PROPS.title);
      expect(eventToReset.description).toBe('');
      expect(eventToReset.date).toBe('2024-06-01');
      expect(eventToReset.from).toBe('09:00');
      expect(eventToReset.to).toBe('10:00');
      expect(eventToReset.icon).toBe('✏️');
      expect(eventToReset.color).toBe('blue');
      expect(eventToReset.urgent).toBe(false);
      expect(eventToReset.allDay).toBe(false);
      expect(eventToReset.notification).toBe('5min');
      expect(eventToReset.repeat).toBeNull();
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
