import { combineLatest, BehaviorSubject, of, Subscription } from 'rxjs';
import { switchMap, map, filter } from 'rxjs/operators';
import { AuthService } from '../../core/auth/auth.service';
import { ColdObservable } from '../../core/types';
import { SymptomLogService } from '../../entities/symptom-log/symptom-log.service';
import { SymptomLog } from '../../entities/symptom-log/types';
import { User } from '../../entities/user/types';
import { UserService } from '../../entities/user/user.service';
import {
  CalendarData,
  CalendarDataType,
  CalendarDay,
  CurrentDate,
  CalendarMonth,
  CalendarWeek,
  CalendarEvent,
  CalendarType
} from './types';
import {
  calcWeekCount,
  getStartDateOfWeek,
  makeCalendarMonth, fillUpCurrentDate, initCurrentDate, pushCalendarDataToCalendarMonth
} from './utils';

export class CalendarService {
  private currentDateSubject = new BehaviorSubject<CurrentDate>(initCurrentDate());
  private currentTypeSubject = new BehaviorSubject<CalendarType>(CalendarType.Month);
  private calendarMonthSubject = new BehaviorSubject<CalendarMonth<CalendarData>>(null);
  private calendarMonthSubscription: Subscription;

  constructor(
    protected userService: UserService,
    protected authService: AuthService,
    protected symptomLogService: SymptomLogService
  ) {}

  setCurrentDate(currentDate: Partial<CurrentDate>): void {
    this.currentDateSubject.next(fillUpCurrentDate(currentDate));
  }

  currentDateChange(): ColdObservable<CurrentDate> {
    return this.currentDateSubject.asObservable();
  }

  setType(type: CalendarType): void {
    this.currentTypeSubject.next(type);
  }

  typeChange(): ColdObservable<CalendarType> {
    return this.currentTypeSubject.asObservable();
  }

  getCalendarDataOfCurrentMonth(): ColdObservable<CalendarMonth<CalendarData>> {
    if (!this.calendarMonthSubscription) {
      this.calendarMonthSubscription = this.currentDateChange().pipe(
        switchMap(currentDate =>
          combineLatest([
            of(currentDate),
            this.getEvents(currentDate)
          ])
        ),
        map(([currentDate, calendarEvent]) => {
          let calendarMonth = makeCalendarMonth<CalendarData>(currentDate);

          for (const symptomLog of calendarEvent.symptomLogs) {
            calendarMonth = pushCalendarDataToCalendarMonth(
              calendarMonth,
              this.makeCalendarDataOfSymptomLog(symptomLog)
            );
          }

          return this.setIndexCalendarMonth(calendarMonth);
        })
      ).subscribe(calendarMonth => {
        this.calendarMonthSubject.next(calendarMonth);
      });
    }

    return this.calendarMonthSubject.asObservable().pipe(
      filter<CalendarMonth<CalendarData>>(Boolean)
    );
  }

  prevMonth(): void {
    const currentDate = this.currentDateSubject.getValue();

    let year = currentDate.year;
    let month = currentDate.month;
    const week = 0;
    const day = 1;

    if (month <= 1) {
      year--;
      month = 12;
    } else {
      month--;
    }

    this.currentDateSubject.next(fillUpCurrentDate({ year, month, week, day }));
  }

  nextMonth(): void {
    const currentDate = this.currentDateSubject.getValue();

    let year = currentDate.year;
    let month = currentDate.month;
    const week = 0;
    const day = 1;

    if (month >= 12) {
      year++;
      month = 1;
    } else {
      month++;
    }

    this.currentDateSubject.next(fillUpCurrentDate({ year, month, week, day }));
  }

  getCalendarDataOfCurrentWeek(): ColdObservable<CalendarWeek<CalendarData>> {
    return combineLatest([
      this.currentDateChange(),
      this.getCalendarDataOfCurrentMonth()
    ]).pipe(
      map(([currentDate, calendarMonth]) =>
        calendarMonth.weekList[currentDate.week]
      )
    );
  }

  prevWeek(): void {
    const currentDate = this.currentDateSubject.getValue();

    let year = currentDate.year;
    let month = currentDate.month;
    let week = currentDate.week;

    if (week <= 0) {
      if (month <= 1) {
        year--;
        month = 12;
      } else {
        month--;
      }

      week = calcWeekCount(year, month) - 1;

    } else {
      week--;
    }

    const day = getStartDateOfWeek(year, month, week).getDate();

    this.currentDateSubject.next(fillUpCurrentDate({ year, month, week, day }));
  }

  nextWeek(): void {
    const currentDate = this.currentDateSubject.getValue();

    let year = currentDate.year;
    let month = currentDate.month;
    let week = currentDate.week;

    if (week >= calcWeekCount(year, month) - 1) {
      if (month >= 12) {
        year++;
        month = 1;
      } else {
        month++;
      }

      week = 0;

    } else {
      week++;
    }

    const day = getStartDateOfWeek(year, month, week).getDate();

    this.currentDateSubject.next(fillUpCurrentDate({ year, month, week, day }));
  }

  listEventsOnSelectedDay(): ColdObservable<CalendarDay<CalendarData>> {
    return combineLatest([
      this.currentDateChange(),
      this.getCalendarDataOfCurrentMonth()
    ]).pipe(
      map(([currentDate, calendarMonth]) =>
        calendarMonth.weekList[currentDate.week].dayList.find(day => day.day === currentDate.day)
      )
    );
  }

  private getEvents(currentDate: CurrentDate): ColdObservable<CalendarEvent> {
    return this.authService.user$.pipe(
      filter<User>(Boolean),
      switchMap(user =>
        combineLatest([
          this.symptomLogService.listCurrentMonth(user.id, currentDate.year, currentDate.month)
        ])
      ),
      map(eventsArray =>
        ({
          symptomLogs: eventsArray[0] as SymptomLog[]
        })
      )
    );
  }

  private makeCalendarDataOfSymptomLog(symptomLog: SymptomLog): CalendarData {
    const start = new Date(symptomLog.year, symptomLog.month - 1, symptomLog.day);
    const end = new Date(new Date(start.getFullYear(), start.getMonth(), start.getDate() + 1).getTime() - 1);

    return {
      type: CalendarDataType.SymptomLog,
      start,
      end,
      title: '',
      index: 0,
      blockSize: 1,
      top: 0,
      height: 0,
      backgroundColor: '#f1624b',
      color: '#000000',
      eventId: symptomLog.id
    };
  }

  private setIndexCalendarMonth(calendarMonth: CalendarMonth<CalendarData>): CalendarMonth<CalendarData> {
    for (let i = 0; i < calendarMonth.weekList.length; i++) {
      calendarMonth.weekList[i] = this.setIndexCalendarWeek(calendarMonth.weekList[i]);
    }

    return calendarMonth;
  }

  private setIndexCalendarWeek(calendarWeek: CalendarWeek<CalendarData>): CalendarWeek<CalendarData> {
    for (let i = 0; i < calendarWeek.dayList.length; i++) {
      const calendarDay = calendarWeek.dayList[i];

      const dataListLength = calendarDay.dataList.length;
      const indexedDataList = new Array(dataListLength);

      for (const calendarData of calendarDay.dataList) {
        if (calendarData.blockSize === 0) {
          const foundIndex = calendarWeek.dayList[i - 1].dataList.filter(Boolean).findIndex(data =>
            data.type === calendarData.type && data.eventId === calendarData.eventId
          );

          calendarData.index = foundIndex;
          indexedDataList[foundIndex] = calendarData;
        }
      }

      let emptyIndex = 0;

      for (const calendarData of calendarDay.dataList) {
        if (calendarData.blockSize !== 0) {
          for (let j = emptyIndex; j < dataListLength; j++) {
            if (!indexedDataList[j]) {
              calendarData.index = j;
              indexedDataList[j] = calendarData;
              emptyIndex = j + 1;
              break;
            }
          }
        }
      }

      calendarWeek.dayList[i].dataList = indexedDataList;
    }

    return calendarWeek;
  }
}
