import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { UserRole } from '@/types';
import {
  mockCorporations,
  mockHospitals,
  mockSalesRows,
  mockPrescriptionUploads,
  mockFilterRequests,
  mockDealers,
} from '@/store/mockData';
import type { Corporation, Hospital, SalesRow, PrescriptionUpload, FilterRequest, Dealer } from '@/types';

type AppState = {
  userRole: UserRole;
  currentCorporationId: string;
  corporations: Corporation[];
  hospitals: Hospital[];
  salesRows: SalesRow[];
  prescriptionUploads: PrescriptionUpload[];
  filterRequests: FilterRequest[];
  dealers: Dealer[];
};

type AppActions = {
  setUserRole: (role: UserRole) => void;
  setCurrentCorporationId: (id: string) => void;
  addSalesRows: (rows: SalesRow[]) => void;
  addPrescriptionUpload: (upload: PrescriptionUpload) => void;
  addHospital: (hospital: Hospital) => void;
  updateFilterRequestStatus: (id: string, status: 'approved' | 'rejected') => void;
  addFilterRequest: (corporationId: string, hospitalId: string, requestMessage?: string) => void;
  addFilterRequestNewHospital: (
    corporationId: string,
    payload: { hospitalName: string; businessNumber: string; address: string; representativeName: string; requestMessage?: string }
  ) => void;
  addDealer: (dealer: Dealer) => void;
};

const initialState: AppState = {
  userRole: 'corporation',
  currentCorporationId: mockCorporations[0]?.id ?? '',
  corporations: mockCorporations,
  hospitals: mockHospitals,
  salesRows: mockSalesRows,
  prescriptionUploads: mockPrescriptionUploads,
  filterRequests: mockFilterRequests,
  dealers: mockDealers,
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
  const [dealers, setDealers] = useState<Dealer[]>(initialState.dealers);

  const updateFilterRequestStatus = useCallback((id: string, status: 'approved' | 'rejected') => {
    const processedAt = new Date().toISOString().slice(0, 19);
    setFilterRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status, processedAt } : r
      )
    );
  }, []);

  const addFilterRequest = useCallback(
    (corporationId: string, hospitalId: string, requestMessage?: string) => {
      const id = `fr-${Date.now()}`;
      const requestedAt = new Date().toISOString().slice(0, 19);
      setFilterRequests((prev) => [
        ...prev,
        { id, corporationId, hospitalId, status: 'pending', requestedAt, requestMessage },
      ]);
    },
    []
  );

  const addFilterRequestNewHospital = useCallback(
    (
      corporationId: string,
      payload: {
        hospitalName: string;
        businessNumber: string;
        address: string;
        representativeName: string;
        requestMessage?: string;
      }
    ) => {
      const id = `fr-${Date.now()}`;
      const requestedAt = new Date().toISOString().slice(0, 19);
      const hospitalId = `new-${id}`;
      setFilterRequests((prev) => [
        ...prev,
        {
          id,
          corporationId,
          hospitalId,
          status: 'pending',
          requestedAt,
          hospitalName: payload.hospitalName,
          businessNumber: payload.businessNumber,
          address: payload.address,
          representativeName: payload.representativeName,
          requestMessage: payload.requestMessage,
        },
      ]);
    },
    []
  );

  const value = useMemo<AppState & AppActions>(
    () => ({
      userRole,
      currentCorporationId,
      corporations: mockCorporations,
      hospitals,
      salesRows,
      prescriptionUploads,
      filterRequests,
      dealers,
      setUserRole,
      setCurrentCorporationId,
      addSalesRows: (rows) => setSalesRows((prev) => [...prev, ...rows]),
      addPrescriptionUpload: (upload) => setPrescriptionUploads((prev) => [...prev, upload]),
      addHospital: (hospital) => setHospitals((prev) => [...prev, hospital]),
      updateFilterRequestStatus,
      addFilterRequest,
      addFilterRequestNewHospital,
      addDealer: (dealer) => setDealers((prev) => [...prev, dealer]),
    }),
    [userRole, currentCorporationId, hospitals, salesRows, prescriptionUploads, filterRequests, dealers, updateFilterRequestStatus, addFilterRequest, addFilterRequestNewHospital]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
