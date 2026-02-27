import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
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
          { path: 'upload', element: <Navigate to="/upload/sales" replace /> },
          { path: 'upload/sales', element: <P.SalesUploadPage /> },
          { path: 'upload/prescription', element: <P.PrescriptionUploadPage /> },
          { path: 'aggregate', element: <P.AggregatePage /> },
          { path: 'accounts', element: <P.AccountManagePage /> },
          { path: 'fees', element: <P.FeeManagePage /> },
          { path: 'settlement', element: <P.SettlementByCorpPage /> },
          { path: 'filter-approval', element: <P.FilterApprovalPage /> },
          { path: 'filter-request', element: <P.FilterRequestPage /> },
          { path: 'dealer-manage', element: <P.DealerManagePage /> },
          { path: 'dealer-view', element: <P.DealerViewPage /> },
          { path: 'hospitals', element: <P.HospitalManagePage /> },
          { path: '*', element: <Navigate to="/" replace /> },
        ],
      },
    ],
  },
]);
