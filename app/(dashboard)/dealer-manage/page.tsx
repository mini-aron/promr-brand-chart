'use client';

import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';
import { DealerManagePage } from '@/views/DealerManagePage';

export default function DealerManageRoute() {
  return (
    <RoleProtectedRoute allowedRoles={['corporation', 'admin']}>
      <DealerManagePage />
    </RoleProtectedRoute>
  );
}
