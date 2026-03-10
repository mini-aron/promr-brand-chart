import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { RoleProtectedRoute } from '@/components/RoleProtectedRoute';
import * as P from '@/pages';

const rootElement = (
  <ThemeProvider>
    <AppProvider>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </AppProvider>
  </ThemeProvider>
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: rootElement,
    children: [
      { path: 'promotion', element: <P.PromotionPage /> },
      { path: 'login', element: <P.LoginPage /> },
      {
        path: '',
        element: (
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <P.HomePage /> },
          {
            path: 'upload',
            element: (
              <RoleProtectedRoute allowedRoles={['corporation']}>
                <P.SalesRegisterPage />
              </RoleProtectedRoute>
            ),
          },
          {
            path: 'upload/notice',
            element: (
              <RoleProtectedRoute allowedRoles={['corporation']}>
                <P.UploadNoticePage />
              </RoleProtectedRoute>
            ),
          },
          {
            path: 'upload/sales',
            element: (
              <RoleProtectedRoute allowedRoles={['corporation']}>
                <P.SalesUploadPage />
              </RoleProtectedRoute>
            ),
          },
          {
            path: 'upload/prescription',
            element: (
              <RoleProtectedRoute allowedRoles={['corporation']}>
                <P.PrescriptionUploadPage />
              </RoleProtectedRoute>
            ),
          },
          { path: 'aggregate', element: <P.AggregatePage /> },
          {
            path: 'fees',
            element: (
              <RoleProtectedRoute allowedRoles={['pharma']}>
                <P.FeeManagePage />
              </RoleProtectedRoute>
            ),
          },
          {
            path: 'settlement',
            element: (
              <RoleProtectedRoute allowedRoles={['pharma']}>
                <P.SettlementByCorpPage />
              </RoleProtectedRoute>
            ),
          },
          {
            path: 'filter-approval',
            element: (
              <RoleProtectedRoute allowedRoles={['pharma']}>
                <P.FilterApprovalPage />
              </RoleProtectedRoute>
            ),
          },
          {
            path: 'filter-request',
            element: (
              <RoleProtectedRoute allowedRoles={['corporation']}>
                <P.FilterRequestPage />
              </RoleProtectedRoute>
            ),
          },
          {
            path: 'dealer-manage',
            element: (
              <RoleProtectedRoute allowedRoles={['corporation']}>
                <P.DealerManagePage />
              </RoleProtectedRoute>
            ),
          },
          {
            path: 'dealer-view',
            element: (
              <RoleProtectedRoute allowedRoles={['pharma']}>
                <P.DealerViewPage />
              </RoleProtectedRoute>
            ),
          },
          {
            path: 'hospitals',
            element: (
              <RoleProtectedRoute allowedRoles={['pharma']}>
                <P.HospitalManagePage />
              </RoleProtectedRoute>
            ),
          },
          {
            path: 'deadline-manage',
            element: (
              <RoleProtectedRoute allowedRoles={['pharma']}>
                <P.DeadlineManagePage />
              </RoleProtectedRoute>
            ),
          },
          { path: '*', element: <Navigate to="/" replace /> },
        ],
      },
    ],
  },
]);
