import { AddressInfo, PostcodeData } from './services/postcode.service';
import { pad } from '../../../../../../src/core/utils';

export function makeAddressInfoFromDaumPostcode(postcodeData: PostcodeData): AddressInfo {
  const jibunAddress = postcodeData.jibunAddress || postcodeData.autoJibunAddress;

  const splitJibunAddress = jibunAddress.split(' ');

  let bunji = '';

  for (let i = splitJibunAddress.length - 1; i >= 0; i--) {
    const result = /\d+(-\d+)?/.exec(splitJibunAddress[i]);

    if (result) {
      bunji = result[0];
      break;
    }
  }

  const [bun, ji] = bunji.split('-');
  const bunNum: number = parseInt(bun, 10);
  const jiNum: number = parseInt(ji, 10);

  return {
    postcode: postcodeData.zonecode,
    address: postcodeData.roadAddress,
    sigunguCode: postcodeData.bcode.slice(0, 5),
    dongCode: postcodeData.bcode.slice(5),
    bun: pad(bunNum, 4),
    ji: ji ? pad(jiNum, 4) : '0000',
  };
}
