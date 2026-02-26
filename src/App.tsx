import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Layout } from '@/components/Layout';
import { HomePage } from '@/pages/HomePage';
import { SalesUploadPage } from '@/pages/SalesUploadPage';
import { PrescriptionUploadPage } from '@/pages/PrescriptionUploadPage';
import { AggregatePage } from '@/pages/AggregatePage';
import { AccountManagePage } from '@/pages/AccountManagePage';
import { FeeManagePage } from '@/pages/FeeManagePage';
import { SettlementByCorpPage } from '@/pages/SettlementByCorpPage';
import { FilterApprovalPage } from '@/pages/FilterApprovalPage';
import { FilterRequestPage } from '@/pages/FilterRequestPage';
import { DealerManagePage } from '@/pages/DealerManagePage';
import { DealerViewPage } from '@/pages/DealerViewPage';
import { HospitalManagePage } from '@/pages/HospitalManagePage';

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="upload" element={<Navigate to="/upload/sales" replace />} />
          <Route path="upload/sales" element={<SalesUploadPage />} />
          <Route path="upload/prescription" element={<PrescriptionUploadPage />} />
          <Route path="aggregate" element={<AggregatePage />} />
          <Route path="accounts" element={<AccountManagePage />} />
          <Route path="fees" element={<FeeManagePage />} />
          <Route path="settlement" element={<SettlementByCorpPage />} />
          <Route path="filter-approval" element={<FilterApprovalPage />} />
          <Route path="filter-request" element={<FilterRequestPage />} />
          <Route path="dealer-manage" element={<DealerManagePage />} />
          <Route path="dealer-view" element={<DealerViewPage />} />
          <Route path="hospitals" element={<HospitalManagePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        </Routes>
      </AppProvider>
    </ThemeProvider>
  );
}
