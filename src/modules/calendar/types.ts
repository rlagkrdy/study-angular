import { SymptomLog } from '../../entities/symptom-log/types';


export interface CurrentDate {
  year: number;
  month: number;
  week: number;
  day: number;
}

export enum CalendarType {
  Month = 'month',
  Week = 'week'
}

export interface CalendarMonth<D> {
  year: number;
  month: number;
  weekCount: number;
  start: Date;
  end: Date;
  weekList: CalendarWeek<D>[];
}

export interface CalendarWeek<D> {
  year: number;
  month: number;
  week: number;
  weekCount: number;
  start: Date;
  end: Date;
  dayList: CalendarDay<D>[];
}

export interface CalendarDay<D> {
  year: number;
  month: number;
  week: number;
  day: number;
  dataList: D[];
}

export interface CalendarData {
  type: CalendarDataType;
  start: Date;
  end: Date;
  title: string;
  description?: string;
  index: number;
  blockSize: number;
  top: number;
  height: number;
  backgroundColor: string;
  color: string;
  eventId: string;
}

export enum CalendarDataType {
  SymptomLog = 'symptomLog'
}

export interface CalendarEvent {
  symptomLogs: SymptomLog[];
}
