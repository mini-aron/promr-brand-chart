import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Corporation,
  CorpHospitalFee,
  Hospital,
  Pharmacy,
  SalesRow,
  PrescriptionUpload,
  ProductFee,
  ProductAbsorptionRate,
  HospitalProductAbsorptionRate,
  FilterRequest,
  Dealer,
  Pharma,
  FeeEvent,
  CorpInvitation,
  Notice,
  NoticeDetail,
  NoticeScope,
  AppNotification,
} from '@/types';
import type { RegionStat } from '@/hooks/useSettlementByRegion';
import {
  mockNotices,
  mockNoticeDetails,
  mockPharmas,
  mockCorporations,
  mockCorpHospitalFees,
  mockHospitals,
  mockPharmacies,
  mockFeeEvents,
  mockProductFees,
  mockProductAbsorptionRates,
  mockHospitalProductAbsorptionRates,
  mockSalesRows,
  mockPrescriptionUploads,
  mockFilterRequests,
  mockCorpInvitations,
  mockDealers,
  mockRegionStats,
  mockAppNotifications,
} from '@/store/mockData';

const STORAGE_KEY = 'promr_demo_play';
const LEGACY_FILTER_DEADLINE_KEY = 'filter-approval-deadlines';

function deepClone<T>(value: T): T {
  return structuredClone(value);
}

function currentMonthKey(): string {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`;
}

function formatNoticeListDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

export type DemoPlayState = {
  dataVersion: number;
  notices: Notice[];
  noticeDetails: NoticeDetail[];
  pharmas: Pharma[];
  corporations: Corporation[];
  corpHospitalFees: CorpHospitalFee[];
  hospitals: Hospital[];
  pharmacies: Pharmacy[];
  feeEvents: FeeEvent[];
  /** 품목 마스터(수수료 풀) */
  productFees: ProductFee[];
  productAbsorptionRates: ProductAbsorptionRate[];
  hospitalProductAbsorptionRates: HospitalProductAbsorptionRate[];
  salesRows: SalesRow[];
  prescriptionUploads: PrescriptionUpload[];
  filterRequests: FilterRequest[];
  corpInvitations: CorpInvitation[];
  dealers: Dealer[];
  regionStats: RegionStat[];
  /** FeeManagePage: 월별 품목 수수료 */
  feeMonthlyFees: Record<string, ProductFee[]>;
  feeInitialMonthlyFees: Record<string, ProductFee[]>;
  /** FilterApprovalPage: 월 키 → 마감일 */
  filterApprovalDeadlines: Record<string, number>;
  appNotifications: AppNotification[];
};

export type DemoPlayActions = {
  setNotices: (v: Notice[] | ((prev: Notice[]) => Notice[])) => void;
  setNoticeDetails: (v: NoticeDetail[] | ((prev: NoticeDetail[]) => NoticeDetail[])) => void;
  setPharmas: (v: Pharma[] | ((prev: Pharma[]) => Pharma[])) => void;
  setCorporations: (v: Corporation[] | ((prev: Corporation[]) => Corporation[])) => void;
  setCorpHospitalFees: (
    v: CorpHospitalFee[] | ((prev: CorpHospitalFee[]) => CorpHospitalFee[]),
  ) => void;
  setHospitals: (v: Hospital[] | ((prev: Hospital[]) => Hospital[])) => void;
  setPharmacies: (v: Pharmacy[] | ((prev: Pharmacy[]) => Pharmacy[])) => void;
  setFeeEvents: (v: FeeEvent[] | ((prev: FeeEvent[]) => FeeEvent[])) => void;
  setProductFees: (v: ProductFee[] | ((prev: ProductFee[]) => ProductFee[])) => void;
  setProductAbsorptionRates: (
    v: ProductAbsorptionRate[] | ((prev: ProductAbsorptionRate[]) => ProductAbsorptionRate[]),
  ) => void;
  setHospitalProductAbsorptionRates: (
    v:
      | HospitalProductAbsorptionRate[]
      | ((prev: HospitalProductAbsorptionRate[]) => HospitalProductAbsorptionRate[]),
  ) => void;
  setSalesRows: (v: SalesRow[] | ((prev: SalesRow[]) => SalesRow[])) => void;
  setPrescriptionUploads: (
    v: PrescriptionUpload[] | ((prev: PrescriptionUpload[]) => PrescriptionUpload[]),
  ) => void;
  setFilterRequests: (v: FilterRequest[] | ((prev: FilterRequest[]) => FilterRequest[])) => void;
  setCorpInvitations: (
    v: CorpInvitation[] | ((prev: CorpInvitation[]) => CorpInvitation[]),
  ) => void;
  setDealers: (v: Dealer[] | ((prev: Dealer[]) => Dealer[])) => void;
  addDealer: (dealer: Dealer) => void;
  removeDealer: (id: string) => void;
  updateDealer: (id: string, patch: Partial<Dealer>) => void;
  setRegionStats: (v: RegionStat[] | ((prev: RegionStat[]) => RegionStat[])) => void;
  setFeeMonthlyFees: (
    v:
      | Record<string, ProductFee[]>
      | ((prev: Record<string, ProductFee[]>) => Record<string, ProductFee[]>),
  ) => void;
  setFeeInitialMonthlyFees: (
    v:
      | Record<string, ProductFee[]>
      | ((prev: Record<string, ProductFee[]>) => Record<string, ProductFee[]>),
  ) => void;
  setFilterApprovalDeadlines: (
    v: Record<string, number> | ((prev: Record<string, number>) => Record<string, number>),
  ) => void;
  setAppNotifications: (
    v: AppNotification[] | ((prev: AppNotification[]) => AppNotification[]),
  ) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  /** 공지 목록·상세에 동시 반영 (데모) */
  addNoticeEntry: (payload: {
    title: string;
    content: string;
    author: string;
    noticeScope: NoticeScope;
    pharmaId?: string;
  }) => string;
  updateNoticeEntry: (id: string, patch: { title: string; content: string }) => void;
};

export function getDefaultDemoState(): DemoPlayState {
  const month = currentMonthKey();
  return {
    dataVersion: 1,
    notices: deepClone(mockNotices),
    noticeDetails: deepClone(mockNoticeDetails),
    pharmas: deepClone(mockPharmas),
    corporations: deepClone(mockCorporations),
    corpHospitalFees: deepClone(mockCorpHospitalFees),
    hospitals: deepClone(mockHospitals),
    pharmacies: deepClone(mockPharmacies),
    feeEvents: deepClone(mockFeeEvents),
    productFees: deepClone(mockProductFees),
    productAbsorptionRates: deepClone(mockProductAbsorptionRates),
    hospitalProductAbsorptionRates: deepClone(mockHospitalProductAbsorptionRates),
    salesRows: deepClone(mockSalesRows),
    prescriptionUploads: deepClone(mockPrescriptionUploads),
    filterRequests: deepClone(mockFilterRequests),
    corpInvitations: deepClone(mockCorpInvitations),
    dealers: deepClone(mockDealers),
    regionStats: deepClone(mockRegionStats),
    feeMonthlyFees: {
      [month]: deepClone(mockProductFees),
    },
    feeInitialMonthlyFees: {},
    filterApprovalDeadlines: {},
    appNotifications: deepClone(mockAppNotifications),
  };
}

function applyArrayOrUpdater<T>(setter: (v: T) => void, get: () => T, value: T | ((prev: T) => T)) {
  setter(typeof value === 'function' ? (value as (p: T) => T)(get()) : value);
}

export const useDemoPlayStore = create<DemoPlayState & DemoPlayActions>()(
  persist(
    (set, get) => ({
      ...getDefaultDemoState(),
      setNotices: (value) =>
        applyArrayOrUpdater(
          (v) => set({ notices: v }),
          () => get().notices,
          value,
        ),
      setNoticeDetails: (value) =>
        applyArrayOrUpdater(
          (v) => set({ noticeDetails: v }),
          () => get().noticeDetails,
          value,
        ),
      setPharmas: (value) =>
        applyArrayOrUpdater(
          (v) => set({ pharmas: v }),
          () => get().pharmas,
          value,
        ),
      setCorporations: (value) =>
        applyArrayOrUpdater(
          (v) => set({ corporations: v }),
          () => get().corporations,
          value,
        ),
      setCorpHospitalFees: (value) =>
        applyArrayOrUpdater(
          (v) => set({ corpHospitalFees: v }),
          () => get().corpHospitalFees,
          value,
        ),
      setHospitals: (value) =>
        applyArrayOrUpdater(
          (v) => set({ hospitals: v }),
          () => get().hospitals,
          value,
        ),
      setPharmacies: (value) =>
        applyArrayOrUpdater(
          (v) => set({ pharmacies: v }),
          () => get().pharmacies,
          value,
        ),
      setFeeEvents: (value) =>
        applyArrayOrUpdater(
          (v) => set({ feeEvents: v }),
          () => get().feeEvents,
          value,
        ),
      setProductFees: (value) =>
        applyArrayOrUpdater(
          (v) => set({ productFees: v }),
          () => get().productFees,
          value,
        ),
      setProductAbsorptionRates: (value) =>
        applyArrayOrUpdater(
          (v) => set({ productAbsorptionRates: v }),
          () => get().productAbsorptionRates,
          value,
        ),
      setHospitalProductAbsorptionRates: (value) =>
        applyArrayOrUpdater(
          (v) => set({ hospitalProductAbsorptionRates: v }),
          () => get().hospitalProductAbsorptionRates,
          value,
        ),
      setSalesRows: (value) =>
        applyArrayOrUpdater(
          (v) => set({ salesRows: v }),
          () => get().salesRows,
          value,
        ),
      setPrescriptionUploads: (value) =>
        applyArrayOrUpdater(
          (v) => set({ prescriptionUploads: v }),
          () => get().prescriptionUploads,
          value,
        ),
      setFilterRequests: (value) =>
        applyArrayOrUpdater(
          (v) => set({ filterRequests: v }),
          () => get().filterRequests,
          value,
        ),
      setCorpInvitations: (value) =>
        applyArrayOrUpdater(
          (v) => set({ corpInvitations: v }),
          () => get().corpInvitations,
          value,
        ),
      setDealers: (value) =>
        applyArrayOrUpdater(
          (v) => set({ dealers: v }),
          () => get().dealers,
          value,
        ),
      addDealer: (dealer) => set((s) => ({ dealers: [...s.dealers, dealer] })),
      removeDealer: (id) => set((s) => ({ dealers: s.dealers.filter((d) => d.id !== id) })),
      updateDealer: (id, patch) =>
        set((s) => ({
          dealers: s.dealers.map((d) => (d.id === id ? { ...d, ...patch } : d)),
        })),
      setRegionStats: (value) =>
        applyArrayOrUpdater(
          (v) => set({ regionStats: v }),
          () => get().regionStats,
          value,
        ),
      setFeeMonthlyFees: (value) =>
        applyArrayOrUpdater(
          (v) => set({ feeMonthlyFees: v }),
          () => get().feeMonthlyFees,
          value,
        ),
      setFeeInitialMonthlyFees: (value) =>
        applyArrayOrUpdater(
          (v) => set({ feeInitialMonthlyFees: v }),
          () => get().feeInitialMonthlyFees,
          value,
        ),
      setFilterApprovalDeadlines: (value) =>
        applyArrayOrUpdater(
          (v) => set({ filterApprovalDeadlines: v }),
          () => get().filterApprovalDeadlines,
          value,
        ),
      setAppNotifications: (value) =>
        applyArrayOrUpdater(
          (v) => set({ appNotifications: v }),
          () => get().appNotifications,
          value,
        ),
      markNotificationRead: (id) =>
        set((s) => ({
          appNotifications: s.appNotifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
      markAllNotificationsRead: () =>
        set((s) => ({
          appNotifications: s.appNotifications.map((n) => ({ ...n, read: true })),
        })),
      addNoticeEntry: ({ title, content, author, noticeScope, pharmaId }) => {
        const { notices, noticeDetails } = get();
        const maxNo = notices.length ? Math.max(...notices.map((n) => n.no)) : 0;
        const nextNo = maxNo + 1;
        const id = `${noticeScope}-${Date.now()}`;
        const createdAt = formatNoticeListDate(new Date());
        const list: Notice = {
          id,
          no: nextNo,
          title,
          author,
          createdAt,
          noticeScope,
          ...(noticeScope === 'pharma' && pharmaId != null ? { pharmaId } : {}),
        };
        const detail: NoticeDetail = {
          ...list,
          content,
          updatedAt: createdAt,
        };
        set({
          notices: [list, ...notices],
          noticeDetails: [detail, ...noticeDetails],
        });
        return id;
      },
      updateNoticeEntry: (id, { title, content }) => {
        const updatedAt = formatNoticeListDate(new Date());
        set((s) => ({
          notices: s.notices.map((n) => (n.id === id ? { ...n, title } : n)),
          noticeDetails: s.noticeDetails.map((d) =>
            d.id === id ? { ...d, title, content, updatedAt } : d,
          ),
        }));
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      version: 1,
    },
  ),
);

/** 구버전 persist에 `appNotifications` 없을 때 기본값 주입 */
export function ensureAppNotificationsMigrated(): void {
  useDemoPlayStore.setState((s) => {
    if (s.appNotifications == null) {
      return { appNotifications: deepClone(mockAppNotifications) };
    }
    return {};
  });
}

/** persist 복원 후 공지 목록·상세가 비어 있으면 mockData와 동일한 기본값으로 채움 */
export function ensureNoticesMigrated(): void {
  useDemoPlayStore.setState((s) => {
    const hasNotices = Array.isArray(s.notices) && s.notices.length > 0;
    const hasDetails = Array.isArray(s.noticeDetails) && s.noticeDetails.length > 0;
    if (hasNotices && hasDetails) return {};
    return {
      notices: deepClone(mockNotices),
      noticeDetails: deepClone(mockNoticeDetails),
    };
  });
}

/** 레거시 마감일 키를 스토어로 한 번 이관 */
export function migrateFilterApprovalDeadlinesFromLegacy(): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(LEGACY_FILTER_DEADLINE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw) as Record<string, number>;
    useDemoPlayStore.setState((s) => ({
      filterApprovalDeadlines: { ...s.filterApprovalDeadlines, ...data },
    }));
    localStorage.removeItem(LEGACY_FILTER_DEADLINE_KEY);
  } catch {
    /* ignore */
  }
}
