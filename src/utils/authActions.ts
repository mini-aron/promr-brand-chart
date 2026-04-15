import { login as loginApi, logout as logoutApi } from '@/api/services/authService';
import type { UserRole } from '@/types';
import { clearAuthCookies, getAccessToken, setAccessToken } from '@/utils/authCookies';
import { applyUserRoleFromAccessToken } from '@/utils/accessTokenRole';

export async function loginWithCredentials(
  email: string,
  password: string,
): Promise<{ userRole: UserRole | null }> {
  const { accessToken } = await loginApi({
    accountId: email.trim(),
    password,
  });
  setAccessToken(accessToken);
  const userRole = applyUserRoleFromAccessToken(accessToken);
  return { userRole };
}

export async function logoutUser(): Promise<void> {
  try {
    if (getAccessToken()) await logoutApi();
  } catch {
    // 클라이언트 로그아웃은 토큰 삭제로 처리
  } finally {
    clearAuthCookies();
  }
}
