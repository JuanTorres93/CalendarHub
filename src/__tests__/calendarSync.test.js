import { beforeEach, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

import html from '../../index.html?raw';

let injectJavascriptToMainHtml;

beforeEach(async () => {
  document.body.innerHTML = html;

  vi.resetModules();
  ({ injectJavascriptToMainHtml } = await import('../injectJavascriptToMainHtml.js'));

  injectJavascriptToMainHtml();
});


it('should display next month name when clicking next month button', async () => {
  vi.setSystemTime(new Date('2025-09-15T10:00:00Z'));

  const nextMonthButton = screen.getByTestId('next-month-button');

  const monthDisplay = screen.getByTestId('month-display');

  await vi.waitFor(() => expect(monthDisplay).toHaveTextContent(/settembre/i));

  await user.click(nextMonthButton);

  await vi.waitFor(() => expect(monthDisplay).toHaveTextContent(/ottobre/i));
});

it('should display previous month name when clicking previous month button', async () => {
  vi.setSystemTime(new Date('2025-09-15T10:00:00Z'));

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
