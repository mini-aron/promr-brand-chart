'use client';

import { useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { PageHeader } from '@/shared/components/layout';
import CardWrapper from '@/shared/components/layout/CardWrapper/CardWrapper';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { SingleSelect } from '@/shared/components/ui/Select';
import { DataTable } from '@/shared/components/ui/DataTable';
import { useDemoPlayStore } from '@/store/demoPlayStore';
import type { ProductAbsorptionRate, HospitalProductAbsorptionRate } from '@/types';
import * as s from './index.css';

type ViewMode = 'product' | 'hospital';

function getMonthOptions(count: number): { value: string; label: string }[] {
  const list: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    list.push({
      value,
      label: `${d.getFullYear()}년 ${String(d.getMonth() + 1).padStart(2, '0')}월`,
    });
  }
  return list;
}

const MONTH_OPTIONS = getMonthOptions(12);

function formatAmount(value: number): string {
  return value.toLocaleString('ko-KR');
}

export function AbsorptionCalculationPage() {
  const mockProductAbsorptionRates = useDemoPlayStore((s) => s.productAbsorptionRates);
  const mockHospitalProductAbsorptionRates = useDemoPlayStore(
    (s) => s.hospitalProductAbsorptionRates,
  );
  const mockHospitals = useDemoPlayStore((s) => s.hospitals);
  const [viewMode, setViewMode] = useState<ViewMode>('product');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}`;
  });
  const [productSearch, setProductSearch] = useState('');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [hospitalSearch, setHospitalSearch] = useState('');

  const filteredProductRates = useMemo(() => {
    const byMonth = mockProductAbsorptionRates.filter((p) => p.month === selectedMonth);
    const q = productSearch.trim().toLowerCase();
    if (!q) return byMonth;
    return byMonth.filter(
      (p) => p.productName.toLowerCase().includes(q) || p.productCode.toLowerCase().includes(q),
    );
  }, [selectedMonth, productSearch, mockProductAbsorptionRates]);

  const filteredHospitals = useMemo(() => {
    const q = hospitalSearch.trim().toLowerCase();
    if (!q) return mockHospitals.slice(0, 30);
    return mockHospitals.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        (h.address ?? '').toLowerCase().includes(q) ||
        (h.accountCode ?? '').toLowerCase().includes(q),
    );
  }, [hospitalSearch, mockHospitals]);

  const hospitalProductRates = useMemo(() => {
    if (!selectedHospitalId) return [];
    return mockHospitalProductAbsorptionRates.filter(
      (r) => r.hospitalId === selectedHospitalId && r.month === selectedMonth,
    );
  }, [selectedHospitalId, selectedMonth, mockHospitalProductAbsorptionRates]);

  const columnHelper = createColumnHelper<ProductAbsorptionRate>();
  const productColumns = useMemo(
    () => [
      columnHelper.accessor('productCode', { header: '품목코드' }),
      columnHelper.accessor('productName', { header: '품목명' }),
      columnHelper.accessor('absorptionRate', {
        header: '흡수율(%)',
        cell: (info) => `${info.getValue()}%`,
      }),
      columnHelper.accessor('salesAmount', {
        header: '매출액',
        cell: (info) => `${formatAmount(info.getValue())}원`,
      }),
      columnHelper.accessor('prescriptionAmount', {
        header: '처방액',
        cell: (info) => `${formatAmount(info.getValue())}원`,
      }),
    ],
    [columnHelper],
  );

  const hospitalProductColumnHelper = createColumnHelper<HospitalProductAbsorptionRate>();
  const hospitalProductColumns = useMemo(
    () => [
      hospitalProductColumnHelper.accessor('productCode', { header: '품목코드' }),
      hospitalProductColumnHelper.accessor('productName', { header: '품목명' }),
      hospitalProductColumnHelper.accessor('absorptionRate', {
        header: '흡수율(%)',
        cell: (info) => `${info.getValue()}%`,
      }),
      hospitalProductColumnHelper.accessor('salesAmount', {
        header: '매출액',
        cell: (info) => `${formatAmount(info.getValue())}원`,
      }),
      hospitalProductColumnHelper.accessor('prescriptionAmount', {
        header: '처방액',
        cell: (info) => `${formatAmount(info.getValue())}원`,
      }),
    ],
    [hospitalProductColumnHelper],
  );

  return (
    <div className={s.page}>
      <PageHeader
        title="흡수율 계산"
        description="월별로 품목별 또는 병원별 흡수율을 조회합니다."
      />

      <div className={s.tableTypeButtons}>
        <Button
          variant={viewMode === 'product' ? 'primary' : 'secondary'}
          size="small"
          onClick={() => setViewMode('product')}
        >
          품목별
        </Button>
        <Button
          variant={viewMode === 'hospital' ? 'primary' : 'secondary'}
          size="small"
          onClick={() => setViewMode('hospital')}
        >
          병원별
        </Button>
      </div>

      {viewMode === 'product' ? (
        <CardWrapper className={s.tableCard} padding={0}>
          <div className={s.filterSection}>
            <div className={s.filterRow}>
              <div className={s.filterField}>
                <label htmlFor="absorption-month">조회 월</label>
                <SingleSelect
                  id="absorption-month"
                  options={MONTH_OPTIONS.map((o) => ({ label: o.label, value: o.value }))}
                  selected={selectedMonth}
                  onChange={(v) => setSelectedMonth(String(v))}
                  placeholder="월 선택"
                  aria-label="조회 월"
                />
              </div>
              <div className={s.filterField}>
                <label htmlFor="product-search">품목 검색</label>
                <Input
                  id="product-search"
                  size="default"
                  type="search"
                  placeholder="품목명·품목코드"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className={s.tableWrap}>
            <DataTable<ProductAbsorptionRate>
              columns={productColumns}
              data={filteredProductRates}
              getRowId={(r) => r.productCode}
              emptyMessage="등록된 품목이 없습니다."
            />
          </div>
        </CardWrapper>
      ) : (
        <div className={s.layoutWrap}>
          <CardWrapper title="병원 리스트" className={s.hospitalSidebarLayout} padding={0} fill>
            <div className={s.hospitalSidebar}>
              <div className={s.sidebarSearchWrap}>
                <label htmlFor="hospital-search">병원 검색</label>
                <Input
                  id="hospital-search"
                  size="large"
                  type="search"
                  placeholder="병원명, 주소, 거래처코드"
                  value={hospitalSearch}
                  onChange={(e) => setHospitalSearch(e.target.value)}
                />
              </div>
              <div className={s.hospitalList}>
                {filteredHospitals.map((h) => (
                  <Button
                    key={h.id}
                    variant="menu"
                    size="menu"
                    active={selectedHospitalId === h.id}
                    onClick={() => setSelectedHospitalId(selectedHospitalId === h.id ? null : h.id)}
                  >
                    {h.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardWrapper>

          <CardWrapper className={s.tableCard} padding={0}>
            <div className={s.filterSection}>
              <div className={s.filterRow}>
                <div className={s.filterField}>
                  <label htmlFor="absorption-month-hospital">조회 월</label>
                  <SingleSelect
                    id="absorption-month-hospital"
                    options={MONTH_OPTIONS.map((o) => ({ label: o.label, value: o.value }))}
                    selected={selectedMonth}
                    onChange={(v) => setSelectedMonth(String(v))}
                    placeholder="월 선택"
                    aria-label="조회 월"
                  />
                </div>
              </div>
            </div>
            <div className={s.tableWrap}>
              {selectedHospitalId ? (
                <DataTable<HospitalProductAbsorptionRate>
                  columns={hospitalProductColumns}
                  data={hospitalProductRates}
                  getRowId={(r) => `${r.hospitalId}-${r.productCode}`}
                  emptyMessage="해당 병원의 품목 흡수율 데이터가 없습니다."
                />
              ) : (
                <div className={s.emptyHint}>
                  좌측에서 병원을 선택하면 품목 흡수율 리스트가 표시됩니다.
                </div>
              )}
            </div>
          </CardWrapper>
        </div>
      )}
    </div>
  );
}
