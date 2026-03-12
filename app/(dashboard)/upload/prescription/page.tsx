'use client';

import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';
import { PrescriptionUploadPage } from '@/views/PrescriptionUploadPage';

export default function PrescriptionUploadRoute() {
  return (
    <RoleProtectedRoute allowedRoles={['corporation', 'admin']}>
      <PrescriptionUploadPage />
    </RoleProtectedRoute>
  );
}
