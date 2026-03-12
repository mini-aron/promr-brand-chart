'use client';

import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';
import { FilterRequestPage } from '@/views/FilterRequestPage';

export default function FilterRequestRoute() {
  return (
    <RoleProtectedRoute allowedRoles={['corporation', 'admin']}>
      <FilterRequestPage />
    </RoleProtectedRoute>
  );
}
