export function generateId(len: number): string {
  const arr = new Uint8Array((len || 40) / 2);
  const crypto = window.crypto || (window as any).msCrypto;
  crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join('');
}

function dec2hex(dec: number): string {
  return ('0' + dec.toString(16)).substr(-2);
}

export function checkPlatform(): 'android' | 'ios' | 'other' {
  const varUA = navigator.userAgent.toLowerCase();

  if (varUA.indexOf('android') > -1) {
    return 'android';
  } else if (
    varUA.indexOf('iphone') > -1 ||
    varUA.indexOf('ipad') > -1 ||
    varUA.indexOf('ipod') > -1
  ) {
    return 'ios';
  } else {
    return 'other';
  }
}
