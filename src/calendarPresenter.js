import { calendarLogic } from './calendarLogic.js';

export class CalendarPresenter {
  constructor() {
    this.deps = null;
  }

  init(deps) {
    this.deps = deps;
  }

  render() {
    const {
      createMonthGrid,
      createWeekGrid,
      createDailyGrid,
      theme,
      renderEvents,
      initRenderBadge,
    } = this.deps;

    createMonthGrid(calendarLogic.date);
    createWeekGrid(calendarLogic.date);
    createDailyGrid(calendarLogic.date);
    this.updateOverlayDisplay();
    theme(calendarLogic.date);
    renderEvents();
    initRenderBadge();
  }

  updateOverlayDisplay() {
    const {
      currentMonthDisplay,
      currentWeekDisplay,
      currentDailyDisplay,
      currentYearDisplay,
    } = this.deps;

    const date = calendarLogic.date;

    const displayMonth = date.month(date.month()).format('MMMM');
    const monday = date.weekday(0).format('DD MMMM');
    const sunday = date.weekday(6).format('DD MMMM');
    const showDailyDate = date.format('DD MMMM');
    const year = date.year();

    currentMonthDisplay.textContent = displayMonth;
    currentWeekDisplay.textContent = `${monday} - ${sunday}`;
    currentDailyDisplay.textContent = showDailyDate;
    currentYearDisplay.textContent = year;
  }
}

export const calendarPresenter = new CalendarPresenter();