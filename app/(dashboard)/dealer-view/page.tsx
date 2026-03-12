'use client';

import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';
import { DealerViewPage } from '@/views/DealerViewPage';

export default function DealerViewRoute() {
  return (
    <RoleProtectedRoute allowedRoles={['pharma', 'admin']}>
      <DealerViewPage />
    </RoleProtectedRoute>
  );
}
