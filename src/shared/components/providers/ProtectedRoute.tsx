'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthSession } from '@/hooks/useAuthSession';
import { getAccessToken } from '@/utils/authCookies';
import { applyUserRoleFromAccessToken } from '@/utils/accessTokenRole';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

/**
 * 인증이 필요한 라우트를 감싸는 컴포넌트.
 * 비인증 시 /promotion으로 리다이렉트.
 * 인증된 경우 새로고침 시 JWT에서 userRole을 한 번 복구합니다.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuthSession();
  const appliedTokenRoleRef = useRef(false);

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace(`/promotion?from=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  useLayoutEffect(() => {
    if (!isAuthenticated || isLoading) return;
    const token = getAccessToken();
    if (!token || appliedTokenRoleRef.current) return;
    if (!applyUserRoleFromAccessToken(token)) return;
    appliedTokenRoleRef.current = true;
  }, [isAuthenticated, isLoading]);

  if (isLoading) return null;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
