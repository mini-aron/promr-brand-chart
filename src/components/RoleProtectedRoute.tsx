/** @jsxImportSource @emotion/react */
import { Navigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import type { UserRole } from '@/types';

type RoleProtectedRouteProps = {
  allowedRoles: UserRole[];
  children: React.ReactNode;
};


export function RoleProtectedRoute({ allowedRoles, children }: RoleProtectedRouteProps) {
  const { userRole } = useApp();

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
