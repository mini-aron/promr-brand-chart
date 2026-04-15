import { create } from 'zustand';
import type { UserRole } from '@/types';

type AppState = {
  userRole: UserRole;
  currentCorporationId: string;
  currentPharmaId: string;
  mapGradientEnabled: boolean;
};

type AppActions = {
  setUserRole: (role: UserRole) => void;
  setCurrentCorporationId: (id: string) => void;
  setCurrentPharmaId: (id: string) => void;
  setMapGradientEnabled: (enabled: boolean) => void;
};

const initialState: AppState = {
  userRole: 'corporation',
  /** 데모: 법인 계정 = 한국메디컬(corp-1), 제약사 = 샘플제약(pharma-1) */
  currentCorporationId: 'corp-1',
  currentPharmaId: 'pharma-1',
  mapGradientEnabled: true,
};

export const useAppStore = create<AppState & AppActions>((set) => ({
  ...initialState,
  setUserRole: (userRole) => set({ userRole }),
  setCurrentCorporationId: (currentCorporationId) => set({ currentCorporationId }),
  setCurrentPharmaId: (currentPharmaId) => set({ currentPharmaId }),
  setMapGradientEnabled: (mapGradientEnabled) => set({ mapGradientEnabled }),
}));

export function useApp() {
  return useAppStore();
}
