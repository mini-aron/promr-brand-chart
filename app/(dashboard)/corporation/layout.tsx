import { RoleProtectedRoute } from '@/shared/components/providers/RoleProtectedRoute';

export default function CorporationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleProtectedRoute allowedRoles={['corporation', 'admin']}>
      {children}
    </RoleProtectedRoute>
  );
}
