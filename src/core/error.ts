export class AsmError extends Error {
  code: AsmErrorCode;

  constructor(code: AsmErrorCode, message?: string) {
    super(message);
    this.code = code;
  }
}

export function throwMgError(code: AsmErrorCode): void {
  throw new AsmError(code, makeAsmErrorMessage(code));
}

export function makeAsmErrorMessage(code: AsmErrorCode): string {
  switch (code) {
    case AsmAuthErrorCode.NotLoggedIn:
      return '로그인 되어 있지 않습니다.';
  }
}

export type AsmErrorCode = AsmAuthErrorCode;

export enum AsmAuthErrorCode {
  NotLoggedIn = 'auth/not-logged-in'
}
