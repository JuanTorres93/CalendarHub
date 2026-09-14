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