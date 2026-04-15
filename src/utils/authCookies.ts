import { deleteCookie, getCookie, setCookie } from '@/utils/cookiesManage';

/** access JWT (first-party, non-httpOnly) */
export const AUTH_ACCESS_COOKIE = 'promr_auth_token';

const AUTH_COOKIE_OPTIONS = {
  path: '/',
  sameSite: 'Lax' as const,
  maxAgeSec: 60 * 60 * 24 * 7,
};

export function getAccessToken(): string | null {
  return getCookie(AUTH_ACCESS_COOKIE);
}

export function setAccessToken(token: string): void {
  setCookie(AUTH_ACCESS_COOKIE, token, AUTH_COOKIE_OPTIONS);
}

export function removeAccessToken(): void {
  deleteCookie(AUTH_ACCESS_COOKIE, {
    path: AUTH_COOKIE_OPTIONS.path,
    sameSite: AUTH_COOKIE_OPTIONS.sameSite,
  });
}

export function clearAuthCookies(): void {
  removeAccessToken();
}
