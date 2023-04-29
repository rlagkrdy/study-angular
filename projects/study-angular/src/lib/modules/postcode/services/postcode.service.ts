import { Injectable } from '@angular/core';
declare const daum: any;

// http://postcode.map.daum.net/guide
export interface AddressInfo {
  postcode: string;
  address: string;
  addressDetail?: string;
  sigunguCode: string;
  dongCode: string;
  bun: string;
  ji: string;
}

export interface PostcodeData {
  zonecode: string;
  address: string;
  addressEnglish: string;
  addressType: 'R' | 'J';
  userSelectedType: 'R' | 'J';
  noSelected: 'Y' | 'N';
  userLanguageType: 'K' | 'E';
  roadAddress: string;
  roadAddressEnglish: string;
  jibunAddress: string;
  jibunAddressEnglish: string;
  autoRoadAddress: string;
  autoRoadAddressEnglish: string;
  autoJibunAddress: string;
  autoJibunAddressEnglish: string;
  buildingCode: string;
  buildingName: string;
  apartment: 'Y' | 'N';
  sido: string;
  sigungu: string;
  sigunguCode: string;
  roadnameCode: string;
  bcode: string;
  roadname: string;
  bname: string;
  bname1: string;
  bnam2: string;
  hname: string;
  query: string;
}

@Injectable({
  providedIn: 'root',
})
export class PostcodeService {
  constructor() {}

  open(): Promise<PostcodeData> {
    return new Promise((resolve, reject) => {
      new daum.Postcode({
        oncomplete: (data: PostcodeData) => {
          resolve(data);
        },
      }).open();
    });
  }

  embed(element: HTMLElement): Promise<PostcodeData> {
    return new Promise((resolve, reject) => {
      new daum.Postcode({
        oncomplete: (data: PostcodeData) => {
          resolve(data);
        },
        onresize: (size: any) => {
          element.style.height = size.height + 'px';
        },
        width: '100%',
        height: '100%',
      }).embed(element);
    });
  }
}
