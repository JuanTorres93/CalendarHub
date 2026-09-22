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
    this.deps.renderDisplays.forEach((render) => render(calendarLogic.date));
  }
}

export const calendarPresenter = new CalendarPresenter();