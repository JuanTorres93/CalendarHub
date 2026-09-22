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
  }

  setDate(newDate) {
    this.date = newDate;
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
}

export const calendarLogic = new CalendarLogic();