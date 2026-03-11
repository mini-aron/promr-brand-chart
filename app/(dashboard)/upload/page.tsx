'use client';

import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';
import { SalesRegisterPage } from '@/views/SalesRegisterPage';

export default function UploadRoute() {
  return (
    <RoleProtectedRoute allowedRoles={['corporation']}>
      <SalesRegisterPage />
    </RoleProtectedRoute>
  );
}
