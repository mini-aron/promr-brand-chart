import { create } from 'zustand';
import type { UserRole } from '@/types';
import { mockCorporations, mockPharmas } from '@/store/mockData';

type AppState = {
  userRole: UserRole;
  currentCorporationId: string;
  currentPharmaId: string;
};

type AppActions = {
  setUserRole: (role: UserRole) => void;
  setCurrentCorporationId: (id: string) => void;
  setCurrentPharmaId: (id: string) => void;
};

const initialState: AppState = {
  userRole: 'corporation',
  currentCorporationId: mockCorporations[0]?.id ?? '',
  currentPharmaId: mockPharmas[0]?.id ?? '',
};

export const useAppStore = create<AppState & AppActions>((set) => ({
  ...initialState,
  setUserRole: (userRole) => set({ userRole }),
  setCurrentCorporationId: (currentCorporationId) => set({ currentCorporationId }),
  setCurrentPharmaId: (currentPharmaId) => set({ currentPharmaId }),
}));

export function useApp() {
  return useAppStore();
}
