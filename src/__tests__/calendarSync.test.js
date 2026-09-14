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
  ({ injectJavascriptToMainHtml } = await import('../injectJavascriptToMainHtml.js'));

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
  const monthButton = within(monthDisplay).getByTestId('show-mini-calendar-button');
  const miniCalendarContainer = screen.getByTestId('mini-calendar-container');

  expect(miniCalendarContainer.children.length).toBe(0);

  await user.click(monthButton);

  await vi.waitFor(() => expect(miniCalendarContainer.children.length).toBeGreaterThan(0));
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
})

describe('Day highlighting', () => {
  it('should highlight the current day in the month view', async () => {
    const todayBox = screen.getByTestId(`day-box-2026-09-14`);

    await vi.waitFor(() => expect(todayBox).toHaveClass('selected'));
  });

  it('should highlight another day when clicking number button', async () => {
    const anotherDayButton = screen.getByTestId('day-number-button-2026-09-15');

    expect(screen.getByTestId('day-box-2026-09-15')).not.toHaveClass('selected');

    await user.click(anotherDayButton);

    const anotherDayBox = screen.getByTestId('day-box-2026-09-15');
    expect(anotherDayBox).toHaveClass('selected');
  })
})

describe('Events', () => {
  it('should open event modal when clicking day box', async () => {
    const dayBox = screen.getByTestId('day-box-2026-09-14');
    const eventModal = screen.getByTestId('event-popup-container');

    expect(eventModal).not.toHaveClass('show-container');

    await user.click(dayBox);

    await vi.waitFor(() => expect(eventModal).toHaveClass('show-container'));
  })

  it('should close event modal when clicking close button', async () => {
    const dayBox = screen.getByTestId('day-box-2026-09-14');
    const eventModal = screen.getByTestId('event-popup-container');

    await user.click(dayBox);

    await vi.waitFor(() => expect(eventModal).toHaveClass('show-container'));

    await user.type(screen.getByTestId('event-title-input'), 'Test event');

    await user.click(screen.getByTestId('event-close-button'));

    await vi.waitFor(() => expect(eventModal).not.toHaveClass('show-container'));
  })

  describe('Event creation', () => {
    beforeEach(async () => {
      localStorage.clear();

      const dayBox = screen.getByTestId('day-box-2026-09-14');

      await user.click(dayBox);

      await vi.waitFor(() => expect(screen.getByTestId('event-popup-container')).toHaveClass('show-container'));

      await user.type(screen.getByTestId('event-title-input'), 'Test event');
    });

    function getSavedEvents() {
      const allEvents = localStorage.getAllForTesting()['calendarEvents'];
      return JSON.parse(allEvents ?? '[]');
    }
    
    it('should save event name', async () => {
      await user.click(screen.getByTestId('event-save-button'));

      expect(getSavedEvents()).toContainEqual(expect.objectContaining({ title: 'Test event' }));
    });

    it('should save event description', async () => {
      await user.type(screen.getByTestId('event-description-input'), 'Test description');

      await user.click(screen.getByTestId('event-save-button'));

      expect(getSavedEvents()).toContainEqual(expect.objectContaining({ description: 'Test description' }));
    });

    it('should save event start time', async () => {
      const fromHourInput = screen.getByTestId('event-from-hour-input');

      await user.clear(fromHourInput);
      await user.type(fromHourInput, '08');

      await user.click(screen.getByTestId('event-save-button'));

      expect(getSavedEvents()).toContainEqual(expect.objectContaining({ from: '08:00' }));
    });

    it('should save event end time', async () => {
      const toHourInput = screen.getByTestId('event-to-hour-input');

      await user.clear(toHourInput);
      await user.type(toHourInput, '22');

      await user.click(screen.getByTestId('event-save-button'));

      expect(getSavedEvents()).toContainEqual(expect.objectContaining({ to: '22:00' }));
    });

    it('should save event icon', async () => {
      await user.click(screen.getByTestId('event-icon-button'));
      await user.click(screen.getByTestId('icon-option-work'));

      await user.click(screen.getByTestId('event-save-button'));

      expect(getSavedEvents()).toContainEqual(expect.objectContaining({ icon: '💼' }));
    });

    it('should save event color', async () => {
      await user.click(screen.getByTestId('event-color-button'));
      await user.click(screen.getByTestId('color-option-red'));

      await user.click(screen.getByTestId('event-save-button'));

      expect(getSavedEvents()).toContainEqual(expect.objectContaining({ color: 'red' }));
    });

    it('should save urgent flag', async () => {
      await user.click(screen.getByTestId('event-urgent-button'));

      await user.click(screen.getByTestId('event-save-button'));

      expect(getSavedEvents()).toContainEqual(expect.objectContaining({ urgent: true }));
    });

    it('should save all day flag', async () => {
      await user.click(screen.getByTestId('event-all-day-button'));

      await user.click(screen.getByTestId('event-save-button'));

      expect(getSavedEvents()).toContainEqual(expect.objectContaining({ allDay: true }));
    });

    it('should save notification', async () => {
      await user.click(screen.getByTestId('event-notification-button'));
      await user.click(screen.getByTestId('notification-option-60'));

      await user.click(screen.getByTestId('event-save-button'));

      expect(getSavedEvents()).toContainEqual(expect.objectContaining({ notification: '1 ora prima' }));
    });

    it('should save repeat configuration', async () => {
      await user.click(screen.getByTestId('event-repeat-button'));

      await user.click(screen.getByTestId('event-repeat-mode-button'));
      await user.click(screen.getByTestId('repeat-mode-option-daily'));

      await user.click(screen.getByTestId('event-repeat-save-button'));

      await user.click(screen.getByTestId('event-save-button'));

      expect(getSavedEvents()).toContainEqual(
        expect.objectContaining({ repeat: expect.objectContaining({ type: 'daily', interval: 1 }) })
      );
    });

    it('should save selected date', async () => {
      await user.click(screen.getByTestId('event-date-button'));

      const miniGrid = document.querySelector('.mini-boxes-container');
      await user.click(within(miniGrid).getByTestId('day-box-2026-09-20'));

      await user.click(document.querySelector('.mini-save-btn'));

      await user.click(screen.getByTestId('event-save-button'));

      expect(getSavedEvents()).toContainEqual(expect.objectContaining({ date: '2026-09-20' }));
    });
  })
});