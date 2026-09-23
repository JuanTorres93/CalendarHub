import { getAllRenderableEvents } from './getAllRenderableEvents.js';
import { renderMonthEvents } from '../../components/features/calendar/monthGrid.js';
import { renderWeekEvents } from '../../components/features/calendar/weekGrid.js';
import { renderDayEvents } from '../../components/features/calendar/dayGrid.js';

export function renderEvents() {
  const allEvents = getAllRenderableEvents();

  renderMonthEvents(allEvents);
  renderWeekEvents(allEvents);
  renderDayEvents(allEvents);
}

export function renderWeeklyEvents(allEvents) {
  renderWeekEvents(allEvents);
}

export function renderDailyEvents(allEvents) {
  renderDayEvents(allEvents);
}