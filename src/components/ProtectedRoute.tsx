'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

/**
 * 인증이 필요한 라우트를 감싸는 컴포넌트.
 * 비인증 시 /promotion으로 리다이렉트.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated) {
      router.replace(`/promotion?from=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading) return null;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
