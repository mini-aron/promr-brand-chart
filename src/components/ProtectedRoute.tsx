/** @jsxImportSource @emotion/react */
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';

type ProtectedRouteProps = {
  children?: React.ReactNode;
};

/**
 * 인증이 필요한 라우트를 감싸는 컴포넌트.
 * 비인증 시 /promotion으로 리다이렉트.
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuthContext();
  const location = useLocation();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/promotion" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
