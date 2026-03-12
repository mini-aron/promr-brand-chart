'use client';

import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';
import { UploadNoticePage } from '@/views/UploadNoticePage';

export default function UploadNoticeRoute() {
  return (
    <RoleProtectedRoute allowedRoles={['corporation', 'admin']}>
      <UploadNoticePage />
    </RoleProtectedRoute>
  );
}
