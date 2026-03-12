'use client';

import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';
import { CorpManagePage } from '@/views/CorpManagePage';

export default function CorpManageRoute() {
  return (
    <RoleProtectedRoute allowedRoles={['pharma']}>
      <CorpManagePage />
    </RoleProtectedRoute>
  );
}
