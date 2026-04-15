import type {
  Corporation,
  Dealer,
  FilterRequest,
  Hospital,
  Pharma,
  PrescriptionUpload,
  SalesRow,
} from '@/types';

export function formatAmount(value: number): string {
  return value.toLocaleString('ko-KR');
}

function getMonthKey(date: Date): string {
  return date.toISOString().slice(0, 7);
}

function getRecentMonthKeys(count: number): string[] {
  const now = new Date();
  const keys: string[] = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    keys.push(getMonthKey(new Date(now.getFullYear(), now.getMonth() - i, 1)));
  }
  return keys;
}

export function computeGrowthRate(thisMonthAmount: number, lastMonthAmount: number): number {
  return lastMonthAmount > 0 ? ((thisMonthAmount - lastMonthAmount) / lastMonthAmount) * 100 : 0;
}

export function computeAccountHeading(params: {
  userRole: 'corporation' | 'pharma' | 'admin';
  currentCorporationId: string;
  currentPharmaId: string;
  corporations: Corporation[];
  pharmas: Pharma[];
}): { name: string; roleLabel: '법인 계정' | '제약사 계정' | '어드민' | '' } {
  const { userRole, currentCorporationId, currentPharmaId, corporations, pharmas } = params;

  if (userRole === 'corporation') {
    const c = corporations.find((x) => x.id === currentCorporationId);
    return { name: c?.name ?? '법인', roleLabel: '법인 계정' };
  }
  if (userRole === 'pharma') {
    const p = pharmas.find((x) => x.id === currentPharmaId);
    return { name: p?.name ?? '제약사', roleLabel: '제약사 계정' };
  }
  if (userRole === 'admin') {
    return { name: '시스템 관리자', roleLabel: '어드민' };
  }
  return { name: '사용자', roleLabel: '' };
}

export function computeCorporationStats(params: {
  salesRows: SalesRow[];
  prescriptionUploads: PrescriptionUpload[];
  dealers: Dealer[];
  filterRequests: FilterRequest[];
  currentCorporationId: string;
}): {
  totalSalesCount: number;
  totalAmount: number;
  prescriptionCount: number;
  dealerCount: number;
  pendingRequestCount: number;
  thisMonthAmount: number;
  thisMonthSalesCount: number;
  lastMonthAmount: number;
  growthRate: number;
} {
  const { salesRows, prescriptionUploads, dealers, filterRequests, currentCorporationId } = params;
  const mySalesRows = salesRows.filter((s) => s.corporationId === currentCorporationId);
  const myPrescriptionUploads = prescriptionUploads.filter(
    (p) => p.corporationId === currentCorporationId,
  );
  const myDealers = dealers.filter((d) => d.corporationId === currentCorporationId);
  const myFilterRequests = filterRequests.filter((f) => f.corporationId === currentCorporationId);

  const totalAmount = mySalesRows.reduce((sum, row) => sum + row.amount, 0);
  const pendingRequests = myFilterRequests.filter((f) => f.status === 'pending').length;

  const thisMonth = getMonthKey(new Date());
  const lastMonth = getMonthKey(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1));

  const thisMonthSales = mySalesRows.filter((s) => s.settlementMonth === thisMonth);
  const lastMonthSales = mySalesRows.filter((s) => s.settlementMonth === lastMonth);

  const thisMonthAmount = thisMonthSales.reduce((sum, row) => sum + row.amount, 0);
  const lastMonthAmount = lastMonthSales.reduce((sum, row) => sum + row.amount, 0);

  return {
    totalSalesCount: mySalesRows.length,
    totalAmount,
    prescriptionCount: myPrescriptionUploads.length,
    dealerCount: myDealers.length,
    pendingRequestCount: pendingRequests,
    thisMonthAmount,
    thisMonthSalesCount: thisMonthSales.length,
    lastMonthAmount,
    growthRate: computeGrowthRate(thisMonthAmount, lastMonthAmount),
  };
}

function filterByPharmaIdIfPresent<T extends { pharmaId?: string }>(
  rows: T[],
  pharmaId: string,
): T[] {
  const hasAnyPharmaId = rows.some((r) => Boolean(r.pharmaId));
  if (!hasAnyPharmaId) return rows;
  return rows.filter((r) => r.pharmaId === pharmaId);
}

export function computePharmaStats(params: {
  salesRows: SalesRow[];
  filterRequests: FilterRequest[];
  dealers: Dealer[];
  corporations: Corporation[];
  hospitals: Hospital[];
  currentPharmaId: string;
}): {
  totalSalesCount: number;
  totalAmount: number;
  corpCount: number;
  hospitalCount: number;
  dealerCount: number;
  pendingRequestCount: number;
  thisMonthAmount: number;
  thisMonthSalesCount: number;
  lastMonthAmount: number;
  growthRate: number;
} {
  const { salesRows, filterRequests, dealers, corporations, hospitals, currentPharmaId } = params;

  const scopedSalesRows = filterByPharmaIdIfPresent(salesRows, currentPharmaId);
  const scopedFilterRequests = filterByPharmaIdIfPresent(filterRequests, currentPharmaId);

  const totalAmount = scopedSalesRows.reduce((sum, row) => sum + row.amount, 0);
  const pendingRequests = scopedFilterRequests.filter((f) => f.status === 'pending').length;

  const thisMonth = getMonthKey(new Date());
  const lastMonth = getMonthKey(new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1));

  const thisMonthSales = scopedSalesRows.filter((s) => s.settlementMonth === thisMonth);
  const lastMonthSales = scopedSalesRows.filter((s) => s.settlementMonth === lastMonth);

  const thisMonthAmount = thisMonthSales.reduce((sum, row) => sum + row.amount, 0);
  const lastMonthAmount = lastMonthSales.reduce((sum, row) => sum + row.amount, 0);

  return {
    totalSalesCount: scopedSalesRows.length,
    totalAmount,
    corpCount: corporations.length,
    hospitalCount: hospitals.length,
    dealerCount: dealers.length,
    pendingRequestCount: pendingRequests,
    thisMonthAmount,
    thisMonthSalesCount: thisMonthSales.length,
    lastMonthAmount,
    growthRate: computeGrowthRate(thisMonthAmount, lastMonthAmount),
  };
}

export function buildMonthlySalesData(params: {
  salesRows: SalesRow[];
  userRole: 'corporation' | 'pharma' | 'admin';
  currentCorporationId: string;
  currentPharmaId: string;
  months?: number;
}): Array<{ month: string; 매출액: number; 건수: number }> {
  const { salesRows, userRole, currentCorporationId, currentPharmaId, months = 6 } = params;

  const scopedSalesRows =
    userRole === 'corporation'
      ? salesRows.filter((s) => s.corporationId === currentCorporationId)
      : userRole === 'pharma'
        ? filterByPharmaIdIfPresent(salesRows, currentPharmaId)
        : salesRows;

  const monthKeys = getRecentMonthKeys(months);
  const monthlyMap = new Map<string, { month: string; amount: number; count: number }>();
  monthKeys.forEach((month) => monthlyMap.set(month, { month, amount: 0, count: 0 }));

  scopedSalesRows.forEach((sale) => {
    const month = sale.settlementMonth || sale.uploadedAt.slice(0, 7);
    if (!monthlyMap.has(month)) return;
    const entry = monthlyMap.get(month)!;
    entry.amount += sale.amount;
    entry.count += 1;
  });

  return Array.from(monthlyMap.values()).map((item) => ({
    month: item.month.slice(5) + '월',
    매출액: item.amount,
    건수: item.count,
  }));
}
