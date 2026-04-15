import { getPageMetadata } from '@/lib/metadata/site';
import { RoleProtectedRoute } from '@/shared/components/providers/RoleProtectedRoute';

export const metadata = getPageMetadata({
  title: '관리자',
  description: '관리자 관리 페이지입니다.',
  canonicalPath: '/admin',
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProtectedRoute allowedRoles={['admin']}>
      {children}
    </RoleProtectedRoute>
  );
}
