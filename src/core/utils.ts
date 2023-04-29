import {
  Observable,
  BehaviorSubject,
  combineLatest,
  AsyncSubject,
  of,
  fromEvent,
} from 'rxjs';
import { publish, map, tap, switchMap, take } from 'rxjs/operators';
import {
  HotObservable,
  InfinityList,
  HotObservableOnce,
  InfinityListApiFn,
  InfinityListResponseMapper,
  Option,
} from './types';

export function makeHot<T = any>(observable: Observable<T>): HotObservable<T> {
  const o = publish<T>()(observable);
  o.connect();
  return o;
}

function dec2hex(dec: number): string {
  return ('0' + dec.toString(16)).substr(-2);
}

export function generateId(len: number): string {
  const arr = new Uint8Array((len || 40) / 2);
  const crypto = window.crypto || (window as any).msCrypto;
  crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
}

export function makeApiInfinityList<T, R>(
  apiFn: InfinityListApiFn<R>,
  responseMapper: InfinityListResponseMapper<T, R>,
  initPage = 0
): InfinityList<T> {
  let values: any[] = [];

  const hasMoreSubject = new BehaviorSubject<boolean>(false);
  const pageSubject = new BehaviorSubject<number>(initPage);
  const totalCountSubject = new AsyncSubject<number>();

  let moreProcessing = false;

  return {
    valueChange: pageSubject.asObservable().pipe(
      switchMap(apiFn),
      map(responseMapper),
      tap((response) => {
        hasMoreSubject.next(
          (response.page + 1 - initPage) * response.perPage <
            response.totalCount
        );

        if (!totalCountSubject.closed) {
          totalCountSubject.next(response.totalCount);
          totalCountSubject.complete();
        }

        moreProcessing = false;
      }),
      map((response) => {
        values = values.concat(response.items);
        return values;
      })
    ),
    hasMoreChange: hasMoreSubject.asObservable(),
    totalCount: totalCountSubject.asObservable(),
    more(): HotObservableOnce<void> {
      if (moreProcessing || !hasMoreSubject.getValue()) {
        return of(null as any);
      }

      moreProcessing = true;
      pageSubject.next(pageSubject.getValue() + 1);

      return hasMoreSubject.asObservable().pipe(
        take(1),
        map(() => {})
      );
    },
  };
}

export function makeArrayInfinityList<T>(
  observable: Observable<T[]>,
  limit: number
): InfinityList<T> {
  const limitSubject = new BehaviorSubject<number>(limit);
  const hasMoreSubject = new BehaviorSubject<boolean>(false);

  let moreProcessing = false;

  return {
    valueChange: combineLatest([observable, limitSubject.asObservable()]).pipe(
      tap(([entities, l]) => {
        hasMoreSubject.next(entities && entities.length > l);
        moreProcessing = false;
      }),
      map(([entities, l]) => entities && entities.slice(0, l))
    ),
    hasMoreChange: hasMoreSubject.asObservable(),
    more(): HotObservableOnce<void> {
      if (moreProcessing || !hasMoreSubject.getValue()) {
        return of(null as any);
      }

      moreProcessing = true;
      limitSubject.next(limitSubject.getValue() + limit);

      return hasMoreSubject.asObservable().pipe(
        take(1),
        map(() => {})
      );
    },
  };
}

export function formatNumber(num: number): string {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}

export function pad(n: number | string, width = 4, z = '0'): string {
  const str = n.toString();
  return str.length >= width
    ? str
    : new Array(width - str.length + 1).join(z) + str;
}

export function formatDate(date: Date, format: string): string {
  const weekName = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ];

  return format.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, ($1) => {
    switch ($1) {
      case 'yyyy':
        return date.getFullYear().toString();
      case 'yy':
        return pad(date.getFullYear() % 1000, 2);
      case 'MM':
        return pad(date.getMonth() + 1, 2);
      case 'dd':
        return pad(date.getDate(), 2);
      case 'E':
        return weekName[date.getDay()];
      case 'HH':
        return pad(date.getHours(), 2);
      case 'hh':
        const h = date.getHours() % 12;
        return pad(h || 12, 2);
      case 'mm':
        return pad(date.getMinutes(), 2);
      case 'ss':
        return pad(date.getSeconds(), 2);
      case 'a/p':
        return date.getHours() < 12 ? '오전' : '오후';
      default:
        return $1;
    }
  });
}

export function swap<T>(array: T[], indexX: number, indexY: number): T[] {
  const swapped = [...array];

  const temp = swapped[indexX];
  swapped[indexX] = swapped[indexY];
  swapped[indexY] = temp;

  return swapped;
}

export function makeTimeOptions(timeValue: string = '00:00'): Option[] {
  const [hourStr, minuteStr] = timeValue.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  return new Array((24 - hour) * 6 - minute / 10).fill(0).map((_, index) => {
    const startIndex = index + minute / 10;
    const h = Math.floor(startIndex / 6) + hour;
    const m = (startIndex % 6) * 10;
    const period = Math.floor(h / 12);

    return {
      text: `${period === 0 ? '오전' : '오후'} ${h % 12 || '12'}:${pad(m, 2)}`,
      value: `${pad(h, 2)}:${pad(m, 2)}`,
    };
  });
}

export function addHoursToTimeValue(
  timeValue: string,
  addHours: number
): string {
  const [hourStr, minuteStr] = timeValue.split(':');
  let hour = parseInt(hourStr, 10) + addHours;
  let minute = parseInt(minuteStr, 10);

  if (hour > 23) {
    hour = 23;
    minute = 50;
  }

  return `${pad(hour, 2)}:${pad(minute, 2)}`;
}

export function convertTimeValueToDate(date: Date, timeValue: string): Date {
  const [hourStr, minuteStr] = timeValue.split(':');
  const hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hour,
    minute
  );
}

export function convertEnumToArray<T>(value: any): T[keyof T][] {
  return Object.keys(value).map((key) => value[key]);
}

export function convertNumberEnumToArray<T>(value: any): T[keyof T][] {
  return Object.keys(value)
    .filter((key) => !isNaN(+key))
    .map((key) => value[key]);
}

export function convertEnumToOptions<T>(value: any): Option[] {
  const array = convertEnumToArray(value);

  return array.map((v) => ({ value: v, text: v }));
}

export function convertNumberEnumToOptions<T>(
  value: any,
  mapper: (value: any) => string
): Option[] {
  const array = Object.keys(value)
    .filter((key) => !isNaN(+key))
    .map((key) => +key);

  return array.map((v) => ({ value: v, text: mapper(v) }));
}

export function checkCordova(): boolean {
  return window.hasOwnProperty('cordova');
}

export function diffHoursBetweenStartTimeAndEndTime(
  startTime: string,
  endTime: string
): number {
  const [startHour, startMinute] = startTime.split(':');
  const [endHour, endMinute] = endTime.split(':');

  const hourDiff = parseInt(endHour, 10) - parseInt(startHour, 10);
  const minuteDiff = parseInt(endMinute, 10) - parseInt(startMinute, 10);

  return Math.ceil(hourDiff + minuteDiff / 100);
}

export function diffDate(diff: {
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  second?: number;
}): Date {
  const now = new Date();

  return new Date(
    now.getFullYear() + (diff.year || 0),
    now.getMonth() + (diff.month || 0),
    now.getDate() + (diff.day || 0),
    now.getHours() + (diff.hour || 0),
    now.getMinutes() + (diff.minute || 0),
    now.getSeconds() + (diff.second || 0)
  );
}

export function getOffsetTopFromRoot(element: HTMLElement): number {
  if (element.offsetParent) {
    return (
      element.offsetTop +
      getOffsetTopFromRoot(element.offsetParent as HTMLElement)
    );
  } else {
    return element.offsetTop;
  }
}

export function getTodayStart(): Date {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

export function getTomorrow(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
}

export function getAddedDate(addedDay: number): Date {
  const now = new Date();

  return new Date(now.getFullYear(), now.getMonth(), now.getDate() + addedDay);
}

export function formatDateYMD(date: Date): string {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1, 2)}-${pad(
    date.getDate(),
    2
  )}`;
}

export function dataURItoBlob(dataURI: any): Blob {
  const byteString = atob(dataURI.split(',')[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: 'image/jpeg' });
}

export function delayTask(callback: () => void): void {
  setTimeout(() => {
    callback();
  });
}

export function delayMicrotask(callback: () => void): void {
  Promise.resolve(null).then(() => {
    callback();
  });
}

export function readAsDataURL(file: File): Observable<string> {
  const { reader, observable } = readAs(file);

  reader.readAsDataURL(file);

  return observable;
}

function readAs(file: File): {
  reader: FileReader;
  observable: Observable<string>;
} {
  const reader = new FileReader();

  const observable = fromEvent(reader, 'load').pipe(
    take(1),
    map((event: any) => event.target.result)
  );

  return { reader, observable };
}

export function convertDateToString(date: Date, time: Date): string {
  if (date) {
    return (
      `${pad(date.getFullYear(), 4)}` +
      `${pad(date.getMonth() + 1, 2)}` +
      `${pad(date.getDate(), 2)}` +
      `${pad(time.getHours(), 2)}` +
      `${pad(time.getMinutes(), 2)}`
    );
  } else {
    return null as any;
  }
}

export function makeAlarms(
  start: Date,
  end: Date,
  firstTime: Date,
  secondTime: Date,
  thirdTime: Date
): string[] {
  const alarms: string[] = [];

  for (let i = start.getTime(); i < end.getTime(); i += 1000 * 60 * 60 * 24) {
    if (firstTime) {
      const str = convertDateToString(new Date(i), firstTime);

      if (str) {
        alarms.push(str);
      }
    }

    if (secondTime) {
      const str = convertDateToString(new Date(i), secondTime);

      if (str) {
        alarms.push(str);
      }
    }

    if (thirdTime) {
      const str = convertDateToString(new Date(i), thirdTime);

      if (str) {
        alarms.push(str);
      }
    }
  }

  return alarms;
}

export function isEmptyObject(obj: { [key: string]: any }): boolean {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

export function convertTypesValueToArray(types: object): string[] {
  return Object.values(types);
}

export function getThisWeek() : any[]{
  const week = [];

  const now = new Date();
  const nowDayOfWeek = now.getDay();
  const nowDay = now.getDate();
  const nowMonth = now.getMonth();
  let nowYear = now.getFullYear();
      nowYear += (nowYear < 2000) ? 1900 : 0;
  const weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);
  const weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
        week.push(weekStartDate);
        week.push(weekEndDate);

  return week;
}
