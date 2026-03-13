'use client';

import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';

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
