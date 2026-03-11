'use client';

import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';
import { FeeManagePage } from '@/views/FeeManagePage';

export default function FeesRoute() {
  return (
    <RoleProtectedRoute allowedRoles={['pharma']}>
      <FeeManagePage />
    </RoleProtectedRoute>
  );
}
