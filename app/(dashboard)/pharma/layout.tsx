'use client';

import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';

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
