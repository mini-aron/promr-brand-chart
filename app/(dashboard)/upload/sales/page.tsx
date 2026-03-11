'use client';

import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';
import { SalesUploadPage } from '@/views/SalesUploadPage';

export default function SalesUploadRoute() {
  return (
    <RoleProtectedRoute allowedRoles={['corporation']}>
      <SalesUploadPage />
    </RoleProtectedRoute>
  );
}
