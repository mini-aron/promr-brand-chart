'use client';

import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';
import { AbsorptionPage } from '@/views/AbsorptionPage';

export default function AbsorptionRoute() {
  return (
    <RoleProtectedRoute allowedRoles={['pharma', 'admin']}>
      <AbsorptionPage />
    </RoleProtectedRoute>
  );
}
