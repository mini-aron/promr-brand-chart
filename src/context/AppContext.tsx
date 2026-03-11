import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { UserRole } from '@/types';
import {
  mockCorporations,
  mockHospitals,
  mockSalesRows,
  mockPrescriptionUploads,
  mockFilterRequests,
  mockDealers,
  mockPharmas,
} from '@/store/mockData';
import type { Corporation, Hospital, SalesRow, PrescriptionUpload, FilterRequest, Dealer, Pharma } from '@/types';

type AppState = {
  userRole: UserRole;
  currentCorporationId: string;
  currentPharmaId: string;
  corporations: Corporation[];
  pharmas: Pharma[];
  hospitals: Hospital[];
  salesRows: SalesRow[];
  prescriptionUploads: PrescriptionUpload[];
  filterRequests: FilterRequest[];
  dealers: Dealer[];
};

type AppActions = {
  setUserRole: (role: UserRole) => void;
  setCurrentCorporationId: (id: string) => void;
  setCurrentPharmaId: (id: string) => void;
  addSalesRows: (rows: SalesRow[]) => void;
  addPrescriptionUpload: (upload: PrescriptionUpload) => void;
  addHospital: (hospital: Hospital) => void;
  updateHospital: (id: string, patch: Partial<Pick<Hospital, 'accountCode'>>) => void;
  updateFilterRequestStatus: (id: string, status: 'approved' | 'rejected') => void;
  addFilterRequest: (corporationId: string, pharmaId: string, hospitalId: string, requestMessage?: string, status?: FilterRequest['status']) => void;
  addFilterRequestNewHospital: (
    corporationId: string,
    pharmaId: string,
    payload: { hospitalName: string; businessNumber: string; address: string; representativeName: string; requestMessage?: string }
  ) => void;
  addDealer: (dealer: Dealer) => void;
  deleteDealer: (dealerId: string) => void;
};

const initialState: AppState = {
  userRole: 'corporation',
  currentCorporationId: mockCorporations[0]?.id ?? '',
  currentPharmaId: mockPharmas[0]?.id ?? '',
  corporations: mockCorporations,
  pharmas: mockPharmas,
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
  const [currentPharmaId, setCurrentPharmaId] = useState<string>(initialState.currentPharmaId);
  const [hospitals, setHospitals] = useState<Hospital[]>(initialState.hospitals);
  const [salesRows, setSalesRows] = useState<SalesRow[]>(initialState.salesRows);
  const [prescriptionUploads, setPrescriptionUploads] = useState<PrescriptionUpload[]>(
    initialState.prescriptionUploads
  );
  const [filterRequests, setFilterRequests] = useState<FilterRequest[]>(initialState.filterRequests);
  const [dealers, setDealers] = useState<Dealer[]>(initialState.dealers);

  const updateFilterRequestStatus = useCallback((id: string, status: 'approved' | 'rejected') => {
    const now = new Date().toISOString().slice(0, 19);
    setFilterRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status, processedAt: now, updatedAt: now, updatedBy: 'admin' } : r
      )
    );
  }, []);

  const addFilterRequest = useCallback(
    (corporationId: string, pharmaId: string, hospitalId: string, requestMessage?: string, status?: FilterRequest['status']) => {
      const id = `fr-${Date.now()}`;
      const now = new Date().toISOString().slice(0, 19);
      const newStatus = status ?? 'pending';
      const processedAt = newStatus !== 'pending' ? now : undefined;
      setFilterRequests((prev) => [
        ...prev,
        {
          id,
          corporationId,
          pharmaId,
          hospitalId,
          status: newStatus,
          requestedAt: now,
          requestMessage,
          processedAt,
          createdAt: now,
          updatedAt: newStatus !== 'pending' ? now : undefined,
          createdBy: 'admin',
          updatedBy: newStatus !== 'pending' ? 'admin' : undefined,
        },
      ]);
    },
    []
  );

  const addFilterRequestNewHospital = useCallback(
    (
      corporationId: string,
      pharmaId: string,
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
          pharmaId,
          hospitalId,
          status: 'pending',
          requestedAt,
          hospitalName: payload.hospitalName,
          businessNumber: payload.businessNumber,
          address: payload.address,
          representativeName: payload.representativeName,
          requestMessage: payload.requestMessage,
          createdAt: requestedAt,
          createdBy: 'admin',
        },
      ]);
    },
    []
  );

  const value = useMemo<AppState & AppActions>(
    () => ({
      userRole,
      currentCorporationId,
      currentPharmaId,
      corporations: mockCorporations,
      pharmas: mockPharmas,
      hospitals,
      salesRows,
      prescriptionUploads,
      filterRequests,
      dealers,
      setUserRole,
      setCurrentCorporationId,
      setCurrentPharmaId,
      addSalesRows: (rows) => setSalesRows((prev) => [...prev, ...rows]),
      addPrescriptionUpload: (upload) => setPrescriptionUploads((prev) => [...prev, upload]),
      addHospital: (hospital) => setHospitals((prev) => [...prev, hospital]),
      updateHospital: (id, patch) =>
        setHospitals((prev) =>
          prev.map((h) => (h.id === id ? { ...h, ...patch } : h))
        ),
      updateFilterRequestStatus,
      addFilterRequest,
      addFilterRequestNewHospital,
      addDealer: (dealer) => setDealers((prev) => [...prev, dealer]),
      deleteDealer: (dealerId) => setDealers((prev) => prev.filter((d) => d.id !== dealerId)),
    }),
    [userRole, currentCorporationId, currentPharmaId, hospitals, salesRows, prescriptionUploads, filterRequests, dealers, updateFilterRequestStatus, addFilterRequest, addFilterRequestNewHospital]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
