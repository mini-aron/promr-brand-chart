import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { UserRole } from '@/types';
import {
  mockCorporations,
  mockHospitals,
  mockSalesRows,
  mockPrescriptionUploads,
  mockFilterRequests,
} from '@/store/mockData';
import type { Corporation, Hospital, SalesRow, PrescriptionUpload, FilterRequest } from '@/types';

type AppState = {
  userRole: UserRole;
  currentCorporationId: string;
  corporations: Corporation[];
  hospitals: Hospital[];
  salesRows: SalesRow[];
  prescriptionUploads: PrescriptionUpload[];
  filterRequests: FilterRequest[];
};

type AppActions = {
  setUserRole: (role: UserRole) => void;
  setCurrentCorporationId: (id: string) => void;
  addSalesRows: (rows: SalesRow[]) => void;
  addPrescriptionUpload: (upload: PrescriptionUpload) => void;
  addHospital: (hospital: Hospital) => void;
  updateFilterRequestStatus: (id: string, status: 'approved' | 'rejected') => void;
  addFilterRequest: (corporationId: string, hospitalId: string) => void;
};

const initialState: AppState = {
  userRole: 'corporation',
  currentCorporationId: mockCorporations[0]?.id ?? '',
  corporations: mockCorporations,
  hospitals: mockHospitals,
  salesRows: mockSalesRows,
  prescriptionUploads: mockPrescriptionUploads,
  filterRequests: mockFilterRequests,
};

const AppContext = createContext<AppState & AppActions | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>(initialState.userRole);
  const [currentCorporationId, setCurrentCorporationId] = useState<string>(
    initialState.currentCorporationId
  );
  const [hospitals, setHospitals] = useState<Hospital[]>(initialState.hospitals);
  const [salesRows, setSalesRows] = useState<SalesRow[]>(initialState.salesRows);
  const [prescriptionUploads, setPrescriptionUploads] = useState<PrescriptionUpload[]>(
    initialState.prescriptionUploads
  );
  const [filterRequests, setFilterRequests] = useState<FilterRequest[]>(initialState.filterRequests);

  const updateFilterRequestStatus = useCallback((id: string, status: 'approved' | 'rejected') => {
    const processedAt = new Date().toISOString().slice(0, 19);
    setFilterRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status, processedAt } : r
      )
    );
  }, []);

  const addFilterRequest = useCallback((corporationId: string, hospitalId: string) => {
    const id = `fr-${Date.now()}`;
    const requestedAt = new Date().toISOString().slice(0, 19);
    setFilterRequests((prev) => [
      ...prev,
      { id, corporationId, hospitalId, status: 'pending', requestedAt },
    ]);
  }, []);

  const value = useMemo<AppState & AppActions>(
    () => ({
      userRole,
      currentCorporationId,
      corporations: mockCorporations,
      hospitals,
      salesRows,
      prescriptionUploads,
      filterRequests,
      setUserRole,
      setCurrentCorporationId,
      addSalesRows: (rows) => setSalesRows((prev) => [...prev, ...rows]),
      addPrescriptionUpload: (upload) => setPrescriptionUploads((prev) => [...prev, upload]),
      addHospital: (hospital) => setHospitals((prev) => [...prev, hospital]),
      updateFilterRequestStatus,
      addFilterRequest,
    }),
    [userRole, currentCorporationId, hospitals, salesRows, prescriptionUploads, filterRequests, updateFilterRequestStatus, addFilterRequest]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
