import { ProtectedRoute } from '@/shared/components/providers/ProtectedRoute';
import { Layout } from '@/shared/components/layout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}
