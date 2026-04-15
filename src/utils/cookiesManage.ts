import {
  deleteCookie as deleteCookieNext,
  getCookie as getCookieNext,
  setCookie as setCookieNext,
} from 'cookies-next';

type CookiesNextSetOptions = NonNullable<Parameters<typeof setCookieNext>[2]>;

export type CookiesManageSetOptions = {
  path?: string;
  sameSite?: 'Strict' | 'Lax' | 'None';
  /** 초 단위. 생략 시 세션 쿠키 */
  maxAgeSec?: number;
  /** 생략 시 현재 origin이 https일 때만 true */
  secure?: boolean;
};

function hasDocument(): boolean {
  return typeof document !== 'undefined';
}

function defaultSecure(): boolean {
  return typeof window !== 'undefined' && window.location.protocol === 'https:';
}

function sameSiteToLib(
  s: CookiesManageSetOptions['sameSite'],
): 'strict' | 'lax' | 'none' | undefined {
  if (s === undefined) return undefined;
  const lower = s.toLowerCase();
  if (lower === 'strict') return 'strict';
  if (lower === 'none') return 'none';
  return 'lax';
}

function toSetOptions(options: CookiesManageSetOptions = {}): CookiesNextSetOptions {
  const sameSite = sameSiteToLib(options.sameSite);
  return {
    path: options.path ?? '/',
    ...(options.maxAgeSec !== undefined ? { maxAge: options.maxAgeSec } : {}),
    ...(sameSite !== undefined ? { sameSite } : {}),
    secure: options.secure ?? defaultSecure(),
  } as CookiesNextSetOptions;
}

export type CookiesManageDeleteOptions = Pick<
  CookiesManageSetOptions,
  'path' | 'secure' | 'sameSite'
>;

export function getCookie(name: string): string | null {
  if (!hasDocument()) return null;
  const v = getCookieNext(name);
  if (v === undefined || v === '') return null;
  return v;
}

export function setCookie(
  name: string,
  value: string,
  options: CookiesManageSetOptions = {},
): void {
  if (!hasDocument()) return;
  setCookieNext(name, value, toSetOptions(options));
}

/** 삭제(set과 path·sameSite·secure 일치 필요) */
export function deleteCookie(name: string, options: CookiesManageDeleteOptions = {}): void {
  if (!hasDocument()) return;
  deleteCookieNext(
    name,
    toSetOptions({
      path: options.path,
      sameSite: options.sameSite,
      secure: options.secure,
    }),
  );
}

export const cookiesManage = {
  get: getCookie,
  set: setCookie,
  delete: deleteCookie,
} as const;
