'use client';

import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';
import { HospitalManagePage } from '@/views/HospitalManagePage';

export default function HospitalsRoute() {
  return (
    <RoleProtectedRoute allowedRoles={['pharma']}>
      <HospitalManagePage />
    </RoleProtectedRoute>
  );
}
