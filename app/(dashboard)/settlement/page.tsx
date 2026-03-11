'use client';

import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';
import { SettlementByCorpPage } from '@/views/SettlementByCorpPage';

export default function SettlementRoute() {
  return (
    <RoleProtectedRoute allowedRoles={['pharma']}>
      <SettlementByCorpPage />
    </RoleProtectedRoute>
  );
}
