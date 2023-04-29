import { formatDate } from '@angular/common';
import firebase from 'firebase/compat/app';
import Timestamp = firebase.firestore.Timestamp;
import {Career, CareerKoText} from "../../../../../../../src/entities/recruitment/types";

export function fullDateFormatterForDate(date: Date) {
  return date ? formatDate(date, 'yyyy.MM.dd', 'ko') : '';
}

export function fullDateFormatterForEndDate(date: Date) {
  const today = new Date();
  if (today > date) {
    return date ? formatDate(date, 'yyyy.MM.dd', 'ko') : '';
  }
  return '';
}

export function closeFormatteWithDate(date: Date) {
  const today = new Date();
  if (today > date) {
    return '종료';
  }
  return '진행';
}

export function fullDateFormatterForHH(date: Date) {
  const today = new Date(date);
  const hours = ('0' + today.getHours()).slice(-2);

  return hours;
}
export function fullDateFormatterForYYmmdd(date: Date) {
  return date ? formatDate(date, 'yyyy-MM-dd', 'ko') : '';
}

export function timeStampObjectFormatterForYYmmdd(date: any) {
  const { _seconds, _nanoseconds } = date;
  return date ? formatDate(new Timestamp(_seconds, _nanoseconds).toDate(), 'yyyy-MM-dd', 'ko') : '';
}

export function phoneNumberFormatter(mobile) {
  return mobile
    .replace(/[^0-9]/g, '')
    .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
    .replace(/(\-{1,2})$/g, '');
}

export function closeFormatter(closed: boolean, type?: string) {
  if (type && type === 'survey') {
  }
  return closed ? '종료' : '진행';
}



export function imagesCountFormatter(images: string[]): number{
  return images.length;
}