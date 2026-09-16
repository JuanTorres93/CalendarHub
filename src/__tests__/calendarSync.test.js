import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

import html from '../../index.html?raw';

let injectJavascriptToMainHtml;

beforeEach(async () => {
  vi.setSystemTime(new Date('2026-09-14T10:00:00Z'));

  document.body.innerHTML = html;

  vi.resetModules();
  ({ injectJavascriptToMainHtml } =
    await import('../injectJavascriptToMainHtml.js'));

  injectJavascriptToMainHtml();
});

it('should display next month name when clicking next month button', async () => {
  const nextMonthButton = screen.getByTestId('next-month-button');

  const monthDisplay = screen.getByTestId('month-display');

  await vi.waitFor(() => expect(monthDisplay).toHaveTextContent(/settembre/i));

  await user.click(nextMonthButton);

  await vi.waitFor(() => expect(monthDisplay).toHaveTextContent(/ottobre/i));
});

it('should display previous month name when clicking previous month button', async () => {
  const previousMonthButton = screen.getByTestId('previous-month-button');

  const monthDisplay = screen.getByTestId('month-display');

  await vi.waitFor(() => expect(monthDisplay).toHaveTextContent(/settembre/i));

  await user.click(previousMonthButton);

  await vi.waitFor(() => expect(monthDisplay).toHaveTextContent(/agosto/i));
});

it('should show mini calendar when clicking month name', async () => {
  const monthDisplay = screen.getByTestId('month-display');
  const monthButton = within(monthDisplay).getByTestId(
    'show-mini-calendar-button',
  );
  const miniCalendarContainer = screen.getByTestId('mini-calendar-container');

  expect(miniCalendarContainer.children.length).toBe(0);

  await user.click(monthButton);

  await vi.waitFor(() =>
    expect(miniCalendarContainer.children.length).toBeGreaterThan(0),
  );
});

describe('View switching', () => {
  it('should switch to day view when clicking day button', async () => {
    const dayView = screen.getByTestId('day-view');
    const monthView = screen.getByTestId('month-view');
    const weekView = screen.getByTestId('week-view');

    const dayButton = screen.getByTestId('day-button');

    await expectInitialMonthlyView();

    await user.click(dayButton);

    await vi.waitFor(() => expect(dayView).toHaveClass('show-section'));

    await vi.waitFor(() => expect(monthView).not.toHaveClass('show-section'));
    await vi.waitFor(() => expect(weekView).not.toHaveClass('show-section'));
  });

  it('should switch to week view when clicking week button', async () => {
    const dayView = screen.getByTestId('day-view');
    const monthView = screen.getByTestId('month-view');
    const weekView = screen.getByTestId('week-view');

    const weekButton = screen.getByTestId('week-button');

    await expectInitialMonthlyView();

    await user.click(weekButton);

    await vi.waitFor(() => expect(weekView).toHaveClass('show-section'));

    await vi.waitFor(() => expect(monthView).not.toHaveClass('show-section'));
    await vi.waitFor(() => expect(dayView).not.toHaveClass('show-section'));
  });

  it('should switch to month view when clicking month button', async () => {
    const dayView = screen.getByTestId('day-view');
    const monthView = screen.getByTestId('month-view');
    const weekView = screen.getByTestId('week-view');

    const monthButton = screen.getByTestId('month-button');

    await expectInitialMonthlyView();

    // Change to week view first
    await user.click(screen.getByTestId('week-button'));

    await user.click(monthButton);

    await vi.waitFor(() => expect(monthView).toHaveClass('show-section'));

    await vi.waitFor(() => expect(weekView).not.toHaveClass('show-section'));
    await vi.waitFor(() => expect(dayView).not.toHaveClass('show-section'));
  });

  async function expectInitialMonthlyView() {
    const dayView = screen.getByTestId('day-view');
    const monthView = screen.getByTestId('month-view');
    const weekView = screen.getByTestId('week-view');

    await vi.waitFor(() => expect(monthView).toHaveClass('show-section'));
    await vi.waitFor(() => expect(weekView).not.toHaveClass('show-section'));
    await vi.waitFor(() => expect(dayView).not.toHaveClass('show-section'));
  }
});

describe('Day highlighting', () => {
  it('should highlight the current day in the month view', async () => {
    const todayBox = screen.getByTestId(`day-box-2026-09-14`);

    await vi.waitFor(() => expect(todayBox).toHaveClass('selected'));
  });

  it('should highlight another day when clicking number button', async () => {
    const anotherDayButton = screen.getByTestId('day-number-button-2026-09-15');

    expect(screen.getByTestId('day-box-2026-09-15')).not.toHaveClass(
      'selected',
    );

    await user.click(anotherDayButton);

    const anotherDayBox = screen.getByTestId('day-box-2026-09-15');
    expect(anotherDayBox).toHaveClass('selected');
  });
});

describe('Events', () => {
  it('should open event modal when clicking day box', async () => {
    const dayBox = screen.getByTestId('day-box-2026-09-14');
    const eventModal = screen.getByTestId('event-popup-container');

    expect(eventModal).not.toHaveClass('show-container');

    await user.click(dayBox);

    await vi.waitFor(() => expect(eventModal).toHaveClass('show-container'));
  });

  it('should close event modal when clicking close button', async () => {
    const dayBox = screen.getByTestId('day-box-2026-09-14');
    const eventModal = screen.getByTestId('event-popup-container');

    await user.click(dayBox);

    await vi.waitFor(() => expect(eventModal).toHaveClass('show-container'));

    await user.type(screen.getByTestId('event-title-input'), 'Test event');

    await user.click(screen.getByTestId('event-close-button'));

    await vi.waitFor(() =>
      expect(eventModal).not.toHaveClass('show-container'),
    );
  });

  it('should create the event for the clicked day', async () => {
    await user.click(screen.getByTestId('day-box-2026-09-07'));

    await vi.waitFor(() =>
      expect(screen.getByTestId('event-popup-container')).toHaveClass(
        'show-container',
      ),
    );

    await user.type(screen.getByTestId('event-title-input'), 'Test event');

    await user.click(screen.getByTestId('event-save-button'));

    expect(getSavedEvents()).toContainEqual(
      expect.objectContaining({ date: '2026-09-07' }),
    );
  });

  describe('Event creation', () => {
    beforeEach(async () => {
      localStorage.clear();

      await openEventForm();

      await user.type(screen.getByTestId('event-title-input'), 'Test event');
    });

    it('should save event name', async () => {
      await user.click(screen.getByTestId('event-save-button'));

      expect(getSavedEvents()).toContainEqual(
        expect.objectContaining({ title: 'Test event' }),
      );
    });

    it('should save event description', async () => {
      await user.type(
        screen.getByTestId('event-description-input'),
        'Test description',
      );

      await user.click(screen.getByTestId('event-save-button'));

      expect(getSavedEvents()).toContainEqual(
        expect.objectContaining({ description: 'Test description' }),
      );
    });

    it('should save event start time', async () => {
      const fromHourInput = screen.getByTestId('event-from-hour-input');

      await user.clear(fromHourInput);
      await user.type(fromHourInput, '08');

      await user.click(screen.getByTestId('event-save-button'));

      expect(getSavedEvents()).toContainEqual(
        expect.objectContaining({ from: '08:00' }),
      );
    });

    it('should save event end time', async () => {
      const toHourInput = screen.getByTestId('event-to-hour-input');

      await user.clear(toHourInput);
      await user.type(toHourInput, '22');

      await user.click(screen.getByTestId('event-save-button'));

      expect(getSavedEvents()).toContainEqual(
        expect.objectContaining({ to: '22:00' }),
      );
    });

    it('should save event icon', async () => {
      await user.click(screen.getByTestId('event-icon-button'));
      await user.click(screen.getByTestId('icon-option-work'));

      await user.click(screen.getByTestId('event-save-button'));

      expect(getSavedEvents()).toContainEqual(
        expect.objectContaining({ icon: '💼' }),
      );
    });

    it('should save event color', async () => {
      await user.click(screen.getByTestId('event-color-button'));
      await user.click(screen.getByTestId('color-option-red'));

      await user.click(screen.getByTestId('event-save-button'));

      expect(getSavedEvents()).toContainEqual(
        expect.objectContaining({ color: 'red' }),
      );
    });

    it('should save urgent flag', async () => {
      await user.click(screen.getByTestId('event-urgent-button'));

      await user.click(screen.getByTestId('event-save-button'));

      expect(getSavedEvents()).toContainEqual(
        expect.objectContaining({ urgent: true }),
      );
    });

    it('should save all day flag', async () => {
      await user.click(screen.getByTestId('event-all-day-button'));

      await user.click(screen.getByTestId('event-save-button'));

      expect(getSavedEvents()).toContainEqual(
        expect.objectContaining({ allDay: true }),
      );
    });

    it('should save notification', async () => {
      await user.click(screen.getByTestId('event-notification-button'));
      await user.click(screen.getByTestId('notification-option-60'));

      await user.click(screen.getByTestId('event-save-button'));

      expect(getSavedEvents()).toContainEqual(
        expect.objectContaining({ notification: '1h' }),
      );
    });

    it('should save repeat configuration', async () => {
      await user.click(screen.getByTestId('event-repeat-button'));

      await user.click(screen.getByTestId('event-repeat-mode-button'));
      await user.click(screen.getByTestId('repeat-mode-option-daily'));

      await user.click(screen.getByTestId('event-repeat-save-button'));

      await user.click(screen.getByTestId('event-save-button'));

      expect(getSavedEvents()).toContainEqual(
        expect.objectContaining({
          repeat: expect.objectContaining({ type: 'daily', interval: 1 }),
        }),
      );
    });

    it('should save selected date', async () => {
      await user.click(screen.getByTestId('event-date-button'));

      const miniGrid = document.querySelector('.mini-boxes-container');
      await user.click(within(miniGrid).getByTestId('day-box-2026-09-20'));

      await user.click(document.querySelector('.mini-save-btn'));

      await user.click(screen.getByTestId('event-save-button'));

      expect(getSavedEvents()).toContainEqual(
        expect.objectContaining({ date: '2026-09-20' }),
      );
    });
  });
});

describe('Today button', () => {
  it('should return to the current month when clicking today button', async () => {
    const monthDisplay = screen.getByTestId('month-display');

    await vi.waitFor(() =>
      expect(monthDisplay).toHaveTextContent(/settembre/i),
    );

    await user.click(screen.getByTestId('next-month-button'));

    await vi.waitFor(() => expect(monthDisplay).toHaveTextContent(/ottobre/i));

    await user.click(screen.getByTestId('today-button'));

    await vi.waitFor(() =>
      expect(monthDisplay).toHaveTextContent(/settembre/i),
    );
  });

  it('should highlight the current day after clicking today button', async () => {
    const monthDisplay = screen.getByTestId('month-display');

    await vi.waitFor(() =>
      expect(monthDisplay).toHaveTextContent(/settembre/i),
    );

    await user.click(screen.getByTestId('next-month-button'));

    await vi.waitFor(() => expect(monthDisplay).toHaveTextContent(/ottobre/i));

    await user.click(screen.getByTestId('day-number-button-2026-10-05'));

    await vi.waitFor(() =>
      expect(screen.getByTestId('day-box-2026-10-05')).toHaveClass('selected'),
    );

    await user.click(screen.getByTestId('today-button'));

    await vi.waitFor(() =>
      expect(screen.getByTestId('day-box-2026-09-14')).toHaveClass('selected'),
    );
  });
});

describe('Todo list', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  async function openTodoPanel() {
    await user.click(screen.getByTestId('new-todo-button'));

    await vi.waitFor(() =>
      expect(screen.getByTestId('todo-panel')).toHaveClass('show-modal'),
    );

    await user.click(screen.getByTestId('todo-new-list-button'));
  }

  it('should open todo panel when clicking new todo button', async () => {
    await user.click(screen.getByTestId('new-todo-button'));

    await vi.waitFor(() =>
      expect(screen.getByTestId('todo-panel')).toHaveClass('show-modal'),
    );
  });

  it('should create a todo list when entering a title', async () => {
    await openTodoPanel();

    expect(screen.getByTestId('todo-header-date')).toHaveTextContent('14-09');

    await user.type(screen.getByTestId('todo-title-input'), 'Test list');

    await user.tab();

    expect(getSavedTodos()).toContainEqual(
      expect.objectContaining({
        title: 'Test list',
        date: '2026-09-14',
      }),
    );
  });

  it('should add an activity to the todo list', async () => {
    await openTodoPanel();

    await user.type(screen.getByTestId('todo-title-input'), 'Test list');

    await user.tab();

    await user.type(screen.getByTestId('todo-item-input'), 'Test activity');

    await user.tab();

    await user.click(screen.getByTestId('todo-add-item-button'));

    expect(getSavedTodos()[0].items).toContainEqual(
      expect.objectContaining({
        title: 'Test activity',
        completed: false,
      }),
    );

    await vi.waitFor(() =>
      expect(
        within(screen.getByTestId('todo-items-container')).getByText(
          'Test activity',
        ),
      ).toBeInTheDocument(),
    );
  });
});

describe('Week and day navigation', () => {
  it('should display previous week when clicking previous week button', async () => {
    await user.click(screen.getByTestId('week-button'));

    const weekDisplay = screen.getByTestId('week-display');

    await vi.waitFor(() =>
      expect(weekDisplay).toHaveTextContent(/14 settembre - 20 settembre/i),
    );

    await user.click(screen.getByTestId('previous-week-button'));

    await vi.waitFor(() =>
      expect(weekDisplay).toHaveTextContent(/07 settembre - 13 settembre/i),
    );
  });

  it('should display next week when clicking next week button', async () => {
    await user.click(screen.getByTestId('week-button'));

    const weekDisplay = screen.getByTestId('week-display');

    await vi.waitFor(() =>
      expect(weekDisplay).toHaveTextContent(/14 settembre - 20 settembre/i),
    );

    await user.click(screen.getByTestId('next-week-button'));

    await vi.waitFor(() =>
      expect(weekDisplay).toHaveTextContent(/21 settembre - 27 settembre/i),
    );
  });

  it('should display previous day when clicking previous day button', async () => {
    await user.click(screen.getByTestId('day-button'));

    const dayDisplay = screen.getByTestId('day-display');

    await vi.waitFor(() =>
      expect(dayDisplay).toHaveTextContent(/14 settembre/i),
    );

    await user.click(screen.getByTestId('previous-day-button'));

    await vi.waitFor(() =>
      expect(dayDisplay).toHaveTextContent(/13 settembre/i),
    );
  });

  it('should display next day when clicking next day button', async () => {
    await user.click(screen.getByTestId('day-button'));

    const dayDisplay = screen.getByTestId('day-display');

    await vi.waitFor(() =>
      expect(dayDisplay).toHaveTextContent(/14 settembre/i),
    );

    await user.click(screen.getByTestId('next-day-button'));

    await vi.waitFor(() =>
      expect(dayDisplay).toHaveTextContent(/15 settembre/i),
    );
  });
});

describe('Mini calendar from navbar', () => {
  async function openMiniCalendar() {
    await user.click(screen.getByTestId('show-mini-calendar-button'));

    await vi.waitFor(() =>
      expect(screen.getByTestId('mini-calendar-dialog')).toHaveClass(
        'show-mini-calendar',
      ),
    );
  }

  function getMiniGrid() {
    return document.querySelector('.mini-boxes-container');
  }

  it('should open mini calendar when clicking month display', async () => {
    await openMiniCalendar();

    expect(screen.getByTestId('mini-calendar-layer')).toHaveClass(
      'show-mini-calendar-layer',
    );
  });

  it('should open mini calendar when clicking week display', async () => {
    await user.click(screen.getByTestId('show-week-mini-calendar-button'));

    await vi.waitFor(() =>
      expect(screen.getByTestId('mini-calendar-dialog')).toHaveClass(
        'show-mini-calendar',
      ),
    );
  });

  it('should open mini calendar when clicking day display', async () => {
    await user.click(screen.getByTestId('show-day-mini-calendar-button'));

    await vi.waitFor(() =>
      expect(screen.getByTestId('mini-calendar-dialog')).toHaveClass(
        'show-mini-calendar',
      ),
    );
  });

  it('should open mini calendar when clicking year display', async () => {
    await user.click(screen.getByTestId('show-year-mini-calendar-button'));

    await vi.waitFor(() =>
      expect(screen.getByTestId('mini-calendar-dialog')).toHaveClass(
        'show-mini-calendar',
      ),
    );
  });

  it('should change the displayed month when confirming a date in mini calendar', async () => {
    await openMiniCalendar();

    await user.click(within(getMiniGrid()).getByTestId('day-box-2026-10-01'));

    await user.click(document.querySelector('.mini-save-btn'));

    await vi.waitFor(() =>
      expect(screen.getByTestId('month-display')).toHaveTextContent(/ottobre/i),
    );
  });

  it('should change the displayed month when selecting a month in the mini calendar carousel', async () => {
    await openMiniCalendar();

    await user.click(document.querySelector('.mini-month-btn'));

    await user.click(screen.getByTestId('mini-month-item-9'));

    await user.click(document.querySelector('.mini-save-btn'));

    await vi.waitFor(() =>
      expect(screen.getByTestId('month-display')).toHaveTextContent(/ottobre/i),
    );
  });

  it('should change the displayed year when selecting a year in the mini calendar carousel', async () => {
    await openMiniCalendar();

    await user.click(document.querySelector('.mini-year-btn'));

    await user.click(screen.getByTestId('mini-year-item-2027'));

    await user.click(document.querySelector('.mini-save-btn'));

    await vi.waitFor(() =>
      expect(
        screen.getByTestId('show-year-mini-calendar-button'),
      ).toHaveTextContent('2027'),
    );
  });
});

describe('Event banner', () => {
  async function openEventBanner(testId) {
    await user.click(
      within(screen.getByTestId('day-box-2026-09-14')).getByTestId(testId),
    );

    await vi.waitFor(() =>
      expect(screen.getByTestId('event-banner')).toHaveClass(
        'show-option-banner',
      ),
    );
  }

  it('should show edit and delete options when clicking an event', async () => {
    await seedAndRender([createBaseEvent()]);

    await openEventBanner('monthly-event-evt-base');

    expect(screen.getByTestId('event-banner-edit-button')).toBeInTheDocument();
    expect(
      screen.getByTestId('event-banner-delete-button'),
    ).toBeInTheDocument();
  });

  it('should edit an event when confirming the preloaded form', async () => {
    await seedAndRender([createBaseEvent()]);

    await openEventBanner('monthly-event-evt-base');

    await user.click(screen.getByTestId('event-banner-edit-button'));

    const eventModal = screen.getByTestId('event-popup-container');
    await vi.waitFor(() => expect(eventModal).toHaveClass('show-container'));

    const titleInput = screen.getByTestId('event-title-input');
    expect(titleInput).toHaveValue('Base event');

    await user.clear(titleInput);
    await user.type(titleInput, 'Edited event');

    await user.click(screen.getByTestId('event-save-button'));

    await vi.waitFor(() =>
      expect(eventModal).not.toHaveClass('show-container'),
    );

    expect(getSavedEvents()).toEqual([
      expect.objectContaining({ id: 'evt-base', title: 'Edited event' }),
    ]);
  });

  it('should delete an event when confirming deletion', async () => {
    await seedAndRender([createBaseEvent()]);

    await openEventBanner('monthly-event-evt-base');

    await user.click(screen.getByTestId('event-banner-delete-button'));

    await vi.waitFor(() => expect(getSavedEvents()).toEqual([]));
    await vi.waitFor(() =>
      expect(screen.getByTestId('event-banner')).not.toHaveClass(
        'show-option-banner',
      ),
    );
  });

  it('should delete a single occurrence when confirming single deletion', async () => {
    const seriesEvent = createBaseEvent({
      id: 'evt-series',
      title: 'Series event',
      repeat: {
        seriesId: 'series-1',
        type: 'daily',
        interval: 1,
        weekdays: [],
        customDates: [],
        exceptions: [],
        until: '2026-09-20',
      },
    });

    await seedAndRender([seriesEvent]);

    await user.click(
      within(screen.getByTestId('day-box-2026-09-15')).getByTestId(
        'monthly-event-series-1-2026-09-15',
      ),
    );

    await vi.waitFor(() =>
      expect(screen.getByTestId('event-banner')).toHaveClass(
        'show-option-banner',
      ),
    );

    await user.click(screen.getByTestId('event-banner-delete-single-button'));

    await vi.waitFor(() => {
      expect(getSavedEvents()).toHaveLength(1);
      expect(getSavedEvents()[0].repeat.exceptions).toContain('2026-09-15');
    });
  });

  it('should delete the whole series when confirming series deletion', async () => {
    const seriesEvent = createBaseEvent({
      id: 'evt-series',
      title: 'Series event',
      repeat: {
        seriesId: 'series-1',
        type: 'daily',
        interval: 1,
        weekdays: [],
        customDates: [],
        exceptions: [],
        until: '2026-09-20',
      },
    });

    await seedAndRender([seriesEvent]);

    await user.click(
      within(screen.getByTestId('day-box-2026-09-15')).getByTestId(
        'monthly-event-series-1-2026-09-15',
      ),
    );

    await vi.waitFor(() =>
      expect(screen.getByTestId('event-banner')).toHaveClass(
        'show-option-banner',
      ),
    );

    await user.click(screen.getByTestId('event-banner-delete-series-button'));

    await vi.waitFor(() => expect(getSavedEvents()).toEqual([]));
  });
});

describe('Repeated events generation', () => {
  it('should generate daily occurrences respecting interval, until and exceptions', async () => {
    const occurrences = await seedSeries(
      createSeriesEvent({
        seriesId: 'series-d',
        type: 'daily',
        interval: 3,
        weekdays: [],
        customDates: [],
        exceptions: ['2026-09-17'],
        until: '2026-09-20',
      }),
    );

    expect(occurrences.map((occurrence) => occurrence.date)).toEqual([
      '2026-09-20',
    ]);
  });

  it('should generate weekly occurrences on selected weekdays', async () => {
    const occurrences = await seedSeries(
      createSeriesEvent({
        seriesId: 'series-w',
        type: 'weekly',
        interval: 1,
        weekdays: [1, 3],
        customDates: [],
        exceptions: [],
        until: '2026-09-27',
      }),
    );

    expect(occurrences.map((occurrence) => occurrence.date)).toEqual([
      '2026-09-16',
      '2026-09-21',
      '2026-09-23',
    ]);
  });

  it('should generate monthly occurrences adding one month per interval', async () => {
    const occurrences = await seedSeries(
      createSeriesEvent({
        seriesId: 'series-m',
        type: 'monthly',
        interval: 1,
        weekdays: [],
        customDates: [],
        exceptions: [],
        until: '2026-11-30',
      }),
    );

    expect(occurrences.map((occurrence) => occurrence.date)).toEqual([
      '2026-10-14',
      '2026-11-14',
    ]);
  });

  it('should generate custom occurrences from the custom dates, skipping exceptions', async () => {
    const occurrences = await seedSeries(
      createSeriesEvent({
        seriesId: 'series-c',
        type: 'custom',
        interval: 1,
        weekdays: [],
        customDates: ['2026-09-18', '2026-09-20', '2026-09-25'],
        exceptions: ['2026-09-18'],
        until: '2026-12-31',
      }),
    );

    expect(occurrences.map((occurrence) => occurrence.date)).toEqual([
      '2026-09-20',
      '2026-09-25',
    ]);
  });

  it('should render repeated occurrences in the month view', async () => {
    await seedAndRender([createSeriesEvent()]);

    expect(
      within(screen.getByTestId('day-box-2026-09-15')).getByTestId(
        'monthly-event-series-1-2026-09-15',
      ),
    ).toBeInTheDocument();

    expect(
      within(screen.getByTestId('day-box-2026-09-20')).getByTestId(
        'monthly-event-series-1-2026-09-20',
      ),
    ).toBeInTheDocument();
  });

  async function getGeneratedOccurrences() {
    const { getRepeatedEvents } =
      await import('../eventCreation/generateRepeatEvents.js');
    return getRepeatedEvents();
  }

  function createSeriesEvent(repeatOverrides = {}) {
    return createBaseEvent({
      id: 'evt-series',
      title: 'Series event',
      repeat: {
        seriesId: 'series-1',
        type: 'daily',
        interval: 1,
        weekdays: [],
        customDates: [],
        exceptions: [],
        until: '2026-09-20',
        ...repeatOverrides,
      },
    });
  }

  async function seedSeries(seriesEvent) {
    localStorage.setItem('calendarEvents', JSON.stringify([seriesEvent]));
    return getGeneratedOccurrences();
  }
});

describe('Event repeat modes', () => {
  it('should save a weekly repeat with the selected weekdays', async () => {
    await openRepeatModal();
    await selectRepeatMode('repeat-mode-option-weekly');

    await user.click(screen.getByTestId('weekly-repetion-item-1'));
    await user.click(screen.getByTestId('weekly-repetion-item-3'));

    await user.click(screen.getByTestId('event-repeat-save-button'));

    await saveEventWithTitle('Weekly event');

    expect(getSavedEvents()).toContainEqual(
      expect.objectContaining({
        repeat: expect.objectContaining({
          type: 'weekly',
          interval: 1,
          weekdays: [1, 3],
        }),
      }),
    );
  });

  it('should save a monthly repeat with the default interval', async () => {
    await openRepeatModal();
    await selectRepeatMode('repeat-mode-option-monthly');

    await user.click(screen.getByTestId('event-repeat-save-button'));

    await saveEventWithTitle('Monthly event');

    expect(getSavedEvents()).toContainEqual(
      expect.objectContaining({
        repeat: expect.objectContaining({ type: 'monthly', interval: 1 }),
      }),
    );
  });

  it('should save a custom repeat with the selected custom dates', async () => {
    await openRepeatModal();
    await selectRepeatMode('repeat-mode-option-custom');

    await user.click(screen.getByTestId('event-repeat-custom-date-button'));

    const miniGrid = document.querySelector('.mini-boxes-container');
    await user.click(within(miniGrid).getByTestId('day-box-2026-09-20'));

    await user.click(document.querySelector('.mini-save-btn'));

    expect(
      screen.getByTestId('custom-date-item-2026-09-20'),
    ).toBeInTheDocument();

    await user.click(screen.getByTestId('event-repeat-save-button'));

    await saveEventWithTitle('Custom event');

    expect(getSavedEvents()).toContainEqual(
      expect.objectContaining({
        repeat: expect.objectContaining({
          type: 'custom',
          customDates: ['2026-09-20'],
        }),
      }),
    );
  });

  it('should save the repeat until the date chosen in the mini calendar', async () => {
    await openRepeatModal();
    await selectRepeatMode('repeat-mode-option-daily');

    await user.click(screen.getByTestId('event-repeat-until-button'));

    const miniGrid = document.querySelector('.mini-boxes-container');
    await user.click(within(miniGrid).getByTestId('day-box-2026-10-20'));

    await user.click(document.querySelector('.mini-save-btn'));

    await user.click(screen.getByTestId('event-repeat-save-button'));

    await saveEventWithTitle('Until event');

    expect(getSavedEvents()).toContainEqual(
      expect.objectContaining({
        repeat: expect.objectContaining({ until: '2026-10-20' }),
      }),
    );
  });

  async function openRepeatModal() {
    await openEventForm();

    await user.click(screen.getByTestId('event-repeat-button'));

    await vi.waitFor(() =>
      expect(screen.getByTestId('event-repeat-modal')).toHaveClass(
        'show-repeat-modal',
      ),
    );
  }

  async function selectRepeatMode(testId) {
    await user.click(screen.getByTestId('event-repeat-mode-button'));

    await user.click(screen.getByTestId(testId));
  }

  async function saveEventWithTitle(title) {
    await user.type(screen.getByTestId('event-title-input'), title);

    await user.click(screen.getByTestId('event-save-button'));
  }
});

describe('Event form validation', () => {
  it('should not save the event when the title is empty', async () => {
    await openEventForm();

    await user.clear(screen.getByTestId('event-title-input'));

    await user.click(screen.getByTestId('event-save-button'));

    expect(getSavedEvents()).toEqual([]);

    await vi.waitFor(() =>
      expect(screen.getAllByTestId('info-alert').length).toBeGreaterThan(0),
    );
  });

  it('should not save the event when the end time is before the start time', async () => {
    await openEventForm();

    await user.type(screen.getByTestId('event-title-input'), 'Test event');

    const fromHourInput = screen.getByTestId('event-from-hour-input');
    await user.clear(fromHourInput);
    await user.type(fromHourInput, '15');

    await user.click(screen.getByTestId('event-save-button'));

    expect(getSavedEvents()).toEqual([]);

    await vi.waitFor(() =>
      expect(screen.getAllByTestId('info-alert').length).toBeGreaterThan(0),
    );
  });

  it('should save the event with full day times when all day is enabled', async () => {
    await openEventForm();

    await user.type(screen.getByTestId('event-title-input'), 'All day event');

    await user.click(screen.getByTestId('event-all-day-button'));

    await user.click(screen.getByTestId('event-save-button'));

    expect(getSavedEvents()).toContainEqual(
      expect.objectContaining({
        allDay: true,
        from: '00:00',
        to: '23:59',
      }),
    );
  });
});

describe('Todo list interactions', () => {
  it('should show a badge with the list count on days with todo lists', async () => {
    await seedTodos([createTodoList()]);

    const badge = within(screen.getByTestId('day-box-2026-09-14')).getByTestId(
      'todo-badge-2026-09-14',
    );
    expect(badge).toHaveTextContent('1');
    expect(
      within(screen.getByTestId('day-box-2026-09-15')).queryByTestId(
        'todo-badge-2026-09-15',
      ),
    ).not.toBeInTheDocument();
  });

  it('should show the todo lists of the day when clicking the badge', async () => {
    await seedTodos([
      createTodoList({ id: 'todo-1', title: 'List one' }),
      createTodoList({ id: 'todo-2', title: 'List two' }),
    ]);

    await user.click(
      within(screen.getByTestId('day-box-2026-09-14')).getByTestId(
        'todo-badge-2026-09-14',
      ),
    );

    const menu = screen.getByTestId('todo-contextual-menu');
    expect(
      within(menu).getByTestId('todo-menu-item-todo-1'),
    ).toBeInTheDocument();
    expect(
      within(menu).getByTestId('todo-menu-item-todo-2'),
    ).toBeInTheDocument();
  });

  it('should rehydrate a todo list when clicking it in the contextual menu', async () => {
    await seedTodos([
      createTodoList({
        id: 'todo-1',
        title: 'My list',
        items: [{ id: 'item-1', title: 'Buy milk', completed: false }],
      }),
    ]);

    await openTodoFromBadge();

    expect(screen.getByTestId('todo-title-input')).toHaveValue('My list');
    expect(screen.getByTestId('todo-item-item-1')).toBeInTheDocument();
  });

  it('should mark an activity as completed when clicking its check button', async () => {
    await seedTodos([
      createTodoList({
        id: 'todo-1',
        items: [{ id: 'item-1', title: 'Buy milk', completed: false }],
      }),
    ]);

    await openTodoFromBadge();

    await user.click(screen.getByTestId('todo-item-check-item-1'));

    expect(getSavedTodos()[0].items[0].completed).toBe(true);
    expect(screen.getByTestId('todo-item-check-item-1')).toHaveClass('checked');
  });

  it('should delete an activity when clicking its delete button', async () => {
    await seedTodos([
      createTodoList({
        id: 'todo-1',
        items: [
          { id: 'item-1', title: 'Buy milk', completed: false },
          { id: 'item-2', title: 'Buy bread', completed: false },
        ],
      }),
    ]);

    await openTodoFromBadge();

    await user.click(screen.getByTestId('todo-item-delete-item-1'));

    expect(getSavedTodos()[0].items).toHaveLength(1);
    expect(screen.queryByTestId('todo-item-item-1')).not.toBeInTheDocument();
  });

  it('should delete the whole list when clicking the delete list button', async () => {
    await seedTodos([createTodoList({ id: 'todo-1' })]);

    await openTodoFromBadge();

    await user.click(screen.getByTestId('todo-delete-list-button'));

    expect(getSavedTodos()).toEqual([]);
    expect(
      within(screen.getByTestId('day-box-2026-09-14')).queryByTestId(
        'todo-badge-2026-09-14',
      ),
    ).not.toBeInTheDocument();
  });

  it('should close the todo panel when clicking the close button', async () => {
    await user.click(screen.getByTestId('new-todo-button'));

    await vi.waitFor(() =>
      expect(screen.getByTestId('todo-panel')).toHaveClass('show-modal'),
    );

    await user.click(screen.getByTestId('todo-close-button'));

    await vi.waitFor(() =>
      expect(screen.getByTestId('todo-panel')).not.toHaveClass('show-modal'),
    );
  });

  function createTodoList(overrides = {}) {
    return {
      id: 'todo-1',
      date: '2026-09-14',
      title: 'My list',
      items: [],
      ...overrides,
    };
  }

  async function seedTodos(todos) {
    localStorage.setItem('todoEvents', JSON.stringify(todos));

    const { initRenderBadge } =
      await import('../to-do-list/toDoBadgeRendering.js');
    initRenderBadge();
  }

  async function openTodoFromBadge() {
    await user.click(
      within(screen.getByTestId('day-box-2026-09-14')).getByTestId(
        'todo-badge-2026-09-14',
      ),
    );

    await user.click(screen.getByTestId('todo-menu-item-todo-1'));

    await vi.waitFor(() =>
      expect(screen.getByTestId('todo-panel')).toHaveClass('show-modal'),
    );
  }
});

describe('Loader', () => {
  it('should hide the loader when the app is ready', () => {
    expect(screen.getByTestId('loader')).toHaveClass('loader-hide');
  });
});

function getSavedEvents() {
  const allEvents = localStorage.getAllForTesting()['calendarEvents'];
  return JSON.parse(allEvents ?? '[]');
}

function getSavedTodos() {
  const allTodos = localStorage.getAllForTesting()['todoEvents'];
  return JSON.parse(allTodos ?? '[]');
}

function createBaseEvent(overrides = {}) {
  return {
    id: 'evt-base',
    title: 'Base event',
    date: '2026-09-14',
    from: '10:00',
    to: '11:00',
    description: '',
    icon: '✏️',
    color: 'blue',
    urgent: false,
    allDay: false,
    notification: '5 minuti prima',
    repeat: null,
    ...overrides,
  };
}

async function seedAndRender(events) {
  localStorage.setItem('calendarEvents', JSON.stringify(events));

  const { renderEvents } = await import('../utils/events/eventRendering.js');
  renderEvents();
}

async function openEventForm() {
  await user.click(screen.getByTestId('day-box-2026-09-14'));

  await vi.waitFor(() =>
    expect(screen.getByTestId('event-popup-container')).toHaveClass(
      'show-container',
    ),
  );
}
