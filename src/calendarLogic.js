import dayjs from './day.js';

export class CalendarLogic {
  constructor() {
    this.date = dayjs();
    this.currentMonth = this.date.month() + 1;
    this.currentWeek = this.date.isoWeek();
    this.firstOfWeek = this.date.weekday(1);
    this.year = this.date.year();
    this.showedMonth = this.currentMonth - 1;
    this.dayOfYear = this.date.dayOfYear();

    this.deps = null;
  }

  init(deps) {
    this.deps = deps;
  }

  setDate(newDate) {
    this.date = newDate;
    this.syncAll();
  }

  updateOverlayDisplay() {
    const {
      currentMonthDisplay,
      currentWeekDisplay,
      currentDailyDisplay,
      currentYearDisplay,
    } = this.deps;

    const displayMonth = this.date.month(this.date.month()).format('MMMM');
    const monday = this.date.weekday(0).format('DD MMMM');
    const sunday = this.date.weekday(6).format('DD MMMM');
    const showDailyDate = this.date.format('DD MMMM');
    const year = this.date.year();

    currentMonthDisplay.textContent = displayMonth;
    currentWeekDisplay.textContent = `${monday} - ${sunday}`;
    currentDailyDisplay.textContent = showDailyDate;
    currentYearDisplay.textContent = year;
  }

  syncAll() {
    const {
      createMonthGrid,
      createWeekGrid,
      createDailyGrid,
      theme,
      renderEvents,
      initRenderBadge,
    } = this.deps;

    createMonthGrid(this.date);
    createWeekGrid(this.date);
    createDailyGrid(this.date);
    this.updateOverlayDisplay();
    this.highLightDayinMonth();
    this.highLightDay();
    theme(this.date);
    renderEvents();
    initRenderBadge();
  }

  nextMonth() {
    this.showedMonth++;
    this.date = this.date.add(1, 'month');
    if (this.showedMonth > 12) {
      this.showedMonth = 1;
      this.year++;
    }
  }

  prevMonth() {
    this.showedMonth--;
    this.date = this.date.subtract(1, 'month');
    if (this.showedMonth < 1) {
      this.showedMonth = 12;
      this.year--;
    }
  }

  prevWeek() {
    this.date = this.date.subtract(1, 'week');
    this.currentWeek--;
    if (this.currentWeek < 1) {
      this.year--;
    }
  }

  nextWeek() {
    this.date = this.date.add(1, 'week');
    this.currentWeek++;
    if (this.currentWeek > 52) {
      this.year++;
    }
  }

  prevDay() {
    this.date = this.date.subtract(1, 'day');
    this.dayOfYear--;
    if (this.dayOfYear < 1) {
      this.dayOfYear = 365;
      this.year--;
    }
  }

  nextDay() {
    this.date = this.date.add(1, 'day');
    this.dayOfYear++;
    if (this.dayOfYear > 365) {
      this.dayOfYear = 1;
      this.year++;
    }
  }

  highLightDayinMonth() {
    const highLight = document.querySelectorAll('.box-grid');
    highLight.forEach((box) => {
      if (box.dataset.day === this.date.format('YYYY-MM-DD')) {
        box.classList.add('selected');
      }
    });
  }

  highLightDay() {
    const highLight = document.querySelectorAll('.day-name');

    highLight.forEach((day) => {
      day.classList.remove('is-today');
      if (day.dataset.day === this.date.format('YYYY-MM-DD')) {
        day.classList.remove('normal-week');
        day.classList.add('is-today');
      } else {
        day.classList.remove('is-today');
        day.classList.add('normal-week');
      }
    });
  }
}

export const calendarLogic = new CalendarLogic();
