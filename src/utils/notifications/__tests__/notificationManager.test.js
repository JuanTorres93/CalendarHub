import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createNotificationMock } from '../../../../tests/mocks/notification.mock.js';
import html from '../../../../index.html?raw';
import { createTestEvent } from '../../../domain/entities/event/__tests__/eventTestProps.js';

let requestNotificationPermission;
let showNotification;
let startNotificationScheduler;
let stopNotificationScheduler;

beforeEach(async () => {
  document.body.innerHTML = html;

  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 8, 14, 9, 54, 0));
  vi.stubGlobal('Notification', createNotificationMock());
  vi.stubGlobal('isSecureContext', true);

  vi.resetModules();
  ({
    requestNotificationPermission,
    showNotification,
    startNotificationScheduler,
    stopNotificationScheduler,
  } = await import('../notificationManager.js'));
});

afterEach(() => {
  stopNotificationScheduler();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.stubGlobal('isSecureContext', true);
});

describe('requestNotificationPermission', () => {
  it("returns 'unsupported' when Notification is not available", async () => {
    delete window.Notification;

    await expect(requestNotificationPermission()).resolves.toBe('unsupported');
  });

  it("returns 'insecure' when the context is not secure", async () => {
    vi.stubGlobal('isSecureContext', false);

    await expect(requestNotificationPermission()).resolves.toBe('insecure');
  });

  it("returns 'granted' when permission is already granted", async () => {
    window.Notification.permission = 'granted';
    const requestSpy = vi.spyOn(window.Notification, 'requestPermission');

    await expect(requestNotificationPermission()).resolves.toBe('granted');
    expect(requestSpy).not.toHaveBeenCalled();
  });

  it("returns 'denied' when permission is denied", async () => {
    window.Notification.permission = 'denied';
    const requestSpy = vi.spyOn(window.Notification, 'requestPermission');

    await expect(requestNotificationPermission()).resolves.toBe('denied');
    expect(requestSpy).not.toHaveBeenCalled();
  });

  it('returns the result of requestPermission when permission is default', async () => {
    const requestSpy = vi.spyOn(window.Notification, 'requestPermission');

    await expect(requestNotificationPermission()).resolves.toBe('granted');
    expect(requestSpy).toHaveBeenCalledTimes(1);
  });

  it("returns 'error' when requestPermission throws", async () => {
    vi.spyOn(window.Notification, 'requestPermission').mockRejectedValue(
      new Error('boom'),
    );
    vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(requestNotificationPermission()).resolves.toBe('error');
  });
});

describe('showNotification', () => {
  it('returns false when Notification is not available', () => {
    delete window.Notification;

    expect(showNotification('Test')).toBe(false);
  });

  it('returns false when permission is not granted', () => {
    expect(showNotification('Test')).toBe(false);
    expect(window.Notification.getInstances()).toHaveLength(0);
  });

  it('creates a notification with title and options when granted', () => {
    window.Notification.permission = 'granted';

    const result = showNotification('Test', { body: 'Corpo' });

    expect(result).toBe(true);
    expect(window.Notification.getInstances()).toHaveLength(1);

    const [notification] = window.Notification.getInstances();
    expect(notification.title).toBe('Test');
    expect(notification.options.body).toBe('Corpo');
  });

  it('focuses the window and closes the notification on click', () => {
    window.Notification.permission = 'granted';
    const focusSpy = vi.spyOn(window, 'focus');

    showNotification('Test');

    const [notification] = window.Notification.getInstances();
    notification.clickHandler();

    expect(notification.closed).toBe(true);
    expect(focusSpy).toHaveBeenCalled();
  });

  it('returns false when the Notification constructor throws', () => {
    vi.stubGlobal(
      'Notification',
      class ThrowingNotification {
        static permission = 'granted';

        constructor() {
          throw new Error('boom');
        }
      },
    );
    vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(showNotification('Test')).toBe(false);
  });
});

describe('notification scheduler', () => {
  beforeEach(() => {
    window.Notification.permission = 'granted';
  });

  it('does not start a second interval if already started', () => {
    const setIntervalSpy = vi.spyOn(window, 'setInterval');

    startNotificationScheduler();
    startNotificationScheduler();

    expect(setIntervalSpy).toHaveBeenCalledTimes(1);
  });

  it('does not show notifications when there are no events', () => {
    startNotificationScheduler();

    vi.advanceTimersByTime(120_000);

    expect(window.Notification.getInstances()).toHaveLength(0);
  });

  it('shows a notification when the event notification time is reached', () => {
    seedEvents([createEventWithNotification()]);

    startNotificationScheduler();

    vi.advanceTimersByTime(60_000);

    const instances = window.Notification.getInstances();
    expect(instances).toHaveLength(1);
    expect(instances[0].title).toBe('Riunione');
    expect(instances[0].options.body).toBe("L'evento inizia alle 10:00.");
    expect(instances[0].options.tag).toBe('calendarhub-evt-1-2026-09-14-10:00');
  });

  it('does not show a notification when the notification time has not arrived', () => {
    seedEvents([createEventWithNotification()]);

    startNotificationScheduler();

    vi.advanceTimersByTime(30_000);

    expect(window.Notification.getInstances()).toHaveLength(0);
  });

  it('shows a notification only once', () => {
    seedEvents([createEventWithNotification()]);

    startNotificationScheduler();

    vi.advanceTimersByTime(120_000);

    expect(window.Notification.getInstances()).toHaveLength(1);
  });

  it('skips events without a notification', () => {
    seedEvents([createEventWithNotification({ notification: 'none' })]);

    startNotificationScheduler();

    vi.advanceTimersByTime(60_000);

    expect(window.Notification.getInstances()).toHaveLength(0);
  });

  it('shows a notification for every due event', () => {
    seedEvents([
      createEventWithNotification(),
      createEventWithNotification({
        id: 'evt-2',
        title: 'Pausa',
        from: '10:30',
        notification: '15min',
      }),
    ]);

    startNotificationScheduler();

    vi.advanceTimersByTime(1_320_000);

    expect(window.Notification.getInstances()).toHaveLength(2);
  });

  it('stops showing notifications after stopNotificationScheduler', () => {
    seedEvents([createEventWithNotification()]);

    startNotificationScheduler();
    stopNotificationScheduler();

    vi.advanceTimersByTime(60_000);

    expect(window.Notification.getInstances()).toHaveLength(0);
  });
});

function createEventWithNotification(overrides = {}) {
  return createTestEvent({
    id: 'evt-1',
    title: 'Riunione',
    date: '2026-09-14',
    from: '10:00',
    notification: '5min',
    ...overrides,
  });
}

function seedEvents(events) {
  localStorage.setItem('calendarEvents', JSON.stringify(events));
}
