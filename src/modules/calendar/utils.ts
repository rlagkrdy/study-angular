import { CurrentDate, CalendarMonth, CalendarWeek, CalendarDay, CalendarData } from './types';


const millisecondsOfAnHour = 1000 * 60 * 60;
const millisecondsOfADay = millisecondsOfAnHour * 24;

export function convertDateToDayNumber(date: Date): number {
  if (date) {
    return ((date.getMonth() + 1) * 100) + date.getDate();
  }
  return null;
}

export function convertDayNumberToDate(year: number, dayNumber: number): Date {
  if (dayNumber) {
    return new Date(year, Math.floor(dayNumber / 100) - 1, dayNumber % 100);
  }
  return null;
}

export function calcInsuranceDay(dateOfBirth: Date): number {
  if (!dateOfBirth) {
    return null;
  }

  let month = ((dateOfBirth.getMonth() + 7) % 12) || 12;
  let day = dateOfBirth.getDate();

  switch (month) {
    case 4:
    case 6:
    case 9:
    case 11:
      if (day === 31) {
        month++;
        day = 1;
      }
      break;
    case 2:
      if (day === 29 || day === 30 || day === 31) {
        month++;
        day = 1;
      }
      break;
  }

  return (month * 100) + day;
}

export function getFirstDayIndexOfMonth(year: number, month: number): number {
  return new Date(year, month - 1).getDay();
}

export function getLastDayIndexOfMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDay();
}

export function getWeekIndexOfMonth(year: number, month: number, day: number): number {
  return Math.ceil((day + getFirstDayIndexOfMonth(year, month)) / 7) - 1;
}

export function getLastDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

export function getStartDateOfMonth(year: number, month: number): Date {
  const lastDayOfLastMonth = getLastDayOfMonth(year, month - 1);

  const startDateOfMonth = lastDayOfLastMonth - getFirstDayIndexOfMonth(year, month) + 1;

  return new Date(year, month - 2, startDateOfMonth);
}

export function getEndDateOfMonth(year: number, month: number): Date {
  const endDateOfMonth = 7 - (getLastDayIndexOfMonth(year, month) + 1);

  return new Date(new Date(year, month, endDateOfMonth + 1).getTime() - 1);
}

export function getStartDateOfWeek(year: number, month: number, weekIndex: number): Date {
  const startDateOfMonth = getStartDateOfMonth(year, month);

  return new Date(
    startDateOfMonth.getFullYear(),
    startDateOfMonth.getMonth(),
    startDateOfMonth.getDate() + (weekIndex * 7)
  );
}

export function getEndDateOfWeek(year: number, month: number, weekIndex: number): Date {
  return new Date(getStartDateOfWeek(year, month, weekIndex + 1).getTime() - 1);
}

export function calcWeekCount(year: number, month: number): number {
  const firstDayIndexOfMonth = getFirstDayIndexOfMonth(year, month);
  const lastDayOfMonth = getLastDayOfMonth(year, month);

  return Math.ceil((firstDayIndexOfMonth + lastDayOfMonth) / 7);
}

export function calcBlockSize(start: Date, end: Date): number {
  let revision = 1;

  if ((end.getTime() - (1000 * 60 * 60 * 9)) % millisecondsOfADay === 0) {
    revision = 0;
  }

  return end.getDate() - start.getDate() + revision;
}

export function calcHeight(hours: number, minutes: number): number {
  return (hours * 60) + Math.round(minutes);
}

export function diffDay(start: Date, end: Date): number {
  return Math.floor((end.getTime() + (millisecondsOfAnHour * 9)) / millisecondsOfADay)
    - Math.floor((start.getTime() + (millisecondsOfAnHour * 9)) / millisecondsOfADay);
}

export function makeCalendarMonth<D>(currentDate: CurrentDate): CalendarMonth<D> {
  const year = currentDate.year;
  const month = currentDate.month;

  const weekCount = calcWeekCount(year, month);

  const calendarMonth: CalendarMonth<D> = {
    year,
    month,
    weekCount,
    start: getStartDateOfMonth(year, month),
    end: getEndDateOfMonth(year, month),
    weekList: []
  };

  for (let i = 0; i < weekCount; i++) {
    calendarMonth.weekList.push(makeCalendarWeek(currentDate, i));
  }

  return calendarMonth;
}

export function makeCalendarWeek<D>(currentDate: CurrentDate, weekIndex = currentDate.week): CalendarWeek<D> {
  const year = currentDate.year;
  const month = currentDate.month;

  const weekCount = calcWeekCount(year, month);

  const calendarWeek: CalendarWeek<D> = {
    year,
    month,
    week: weekIndex,
    weekCount,
    start: getStartDateOfWeek(year, month, weekIndex),
    end: getEndDateOfWeek(year, month, weekIndex),
    dayList: []
  };

  for (let j = 0; j < 7; j++) {
    const day = new Date(
      calendarWeek.start.getFullYear(),
      calendarWeek.start.getMonth(),
      calendarWeek.start.getDate() + j
    );

    const calendarDay: CalendarDay<D> = {
      year: day.getFullYear(),
      month: day.getMonth() + 1,
      week: weekIndex,
      day: day.getDate(),
      dataList: []
    };

    calendarWeek.dayList.push(calendarDay);
  }

  return calendarWeek;
}

export function fillUpCurrentDate(partialCurrentDate: Partial<CurrentDate>): CurrentDate {
  if (!partialCurrentDate.year || !partialCurrentDate.month) {
    throw new Error('year와 month는 필수 값입니다.');
  }

  const currentDate: CurrentDate = {
    year: partialCurrentDate.year,
    month: partialCurrentDate.month,
    week: partialCurrentDate.week,
    day: partialCurrentDate.day
  };

  if ((currentDate.week === undefined || currentDate.week === null) && !currentDate.day) {
    currentDate.week = 0;
    currentDate.day = 1;
  } else if (currentDate.week === undefined || currentDate.week === null) {
    currentDate.week = getWeekIndexOfMonth(currentDate.year, currentDate.month, currentDate.day);
  } else if (!currentDate.day) {
    currentDate.day = getStartDateOfWeek(currentDate.year, currentDate.month, currentDate.week).getDate();
  }

  return currentDate;
}

export function initCurrentDate(): CurrentDate {
  const today = new Date();
  const todayCurrentDate: CurrentDate = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    week: 0,
    day: today.getDate()
  };

  return fillUpCurrentDate(todayCurrentDate);
}

export function pushCalendarDataToCalendarMonth(
  calendarMonth: CalendarMonth<CalendarData>,
  calendarData: CalendarData
): CalendarMonth<CalendarData> {
  if (calendarData) {
    const startWeekIndex = getWeekIndexOfMonth(calendarMonth.year, calendarMonth.month, calendarData.start.getDate());
    const endWeekIndex = getWeekIndexOfMonth(calendarMonth.year, calendarMonth.month, calendarData.end.getDate());

    for (let i = startWeekIndex; i < endWeekIndex + 1; i++) {
      calendarMonth.weekList[i] = pushCalendarDataToCalendarWeek(calendarMonth.weekList[i], calendarData);
    }
  }

  return calendarMonth;
}

export function pushCalendarDataToCalendarWeek(
  calendarWeek: CalendarWeek<CalendarData>,
  calendarData: CalendarData
): CalendarWeek<CalendarData> {
  const start = calendarData.start > calendarWeek.start ? calendarData.start : calendarWeek.start;
  const end = calendarData.end < calendarWeek.end ? calendarData.end : calendarWeek.end;
  const startIndex = Math.max(diffDay(calendarWeek.start, calendarData.start), 0);
  const endIndex = Math.min(6 + diffDay(calendarWeek.end, calendarData.end), 6);

  for (let i = startIndex; i < endIndex + 1; i++) {
    const blockSize = i === startIndex ? calcBlockSize(start, end) : 0;
    calendarWeek.dayList[i].dataList.push({ ...calendarData, blockSize });
  }

  return calendarWeek;
}
