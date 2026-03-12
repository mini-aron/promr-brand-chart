'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/store/appStore';
import type { UserRole } from '@/types';

type RoleProtectedRouteProps = {
  allowedRoles: UserRole[];
  children: React.ReactNode;
};

export function RoleProtectedRoute({ allowedRoles, children }: RoleProtectedRouteProps) {
  const router = useRouter();
  const { userRole } = useApp();

  useEffect(() => {
    if (!allowedRoles.includes(userRole)) {
      router.replace('/home');
    }
  }, [allowedRoles, userRole, router]);

  if (!allowedRoles.includes(userRole)) return null;

  return <>{children}</>;
}
