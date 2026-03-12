'use client';

import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';
import { FilterApprovalPage } from '@/views/FilterApprovalPage';

export default function FilterApprovalRoute() {
  return (
    <RoleProtectedRoute allowedRoles={['pharma', 'admin']}>
      <FilterApprovalPage />
    </RoleProtectedRoute>
  );
}
