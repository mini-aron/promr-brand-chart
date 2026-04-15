import { RoleProtectedRoute } from '@/shared/components/providers/RoleProtectedRoute';

export default function PharmaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProtectedRoute allowedRoles={['pharma', 'admin']}>
      {children}
    </RoleProtectedRoute>
  );
}
