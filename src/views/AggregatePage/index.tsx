'use client';
/** @jsxImportSource @emotion/react */
import { useEffect, useMemo, useState } from 'react';
import { css } from '@emotion/react';
import { HiChevronDown } from 'react-icons/hi';
import { useApp } from '@/context/AppContext';
import { theme } from '@/theme';
import { SingleSelect } from '@/components/Common/Select';
import { FilterInput } from '@/components/Common/Input';
import { DataTable } from '@/components/Common/DataTable';
import { createColumnHelper } from '@tanstack/react-table';

const pageStyles = css({
  '& h1': { marginBottom: theme.spacing(2) },
  '& p': { marginBottom: theme.spacing(4) },
});

const filterCard = css({
  backgroundColor: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.lg,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadow.sm,
});

const filterRow = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: theme.spacing(4),
  alignItems: 'flex-end',
  '& label': {
    display: 'block',
    marginBottom: theme.spacing(2),
    fontSize: 15,
    fontWeight: 600,
    color: theme.colors.text,
  },
  '& select': {
    display: 'block',
    width: '100%',
    minHeight: 48,
    padding: `0 ${theme.spacing(3)}px`,
    paddingRight: 40,
    fontSize: 15,
    borderRadius: theme.radius.md,
    border: `2px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    cursor: 'pointer',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    '&:hover': { borderColor: theme.colors.primary },
    '&:focus': {
      outline: 'none',
      borderColor: theme.colors.primary,
      boxShadow: `0 0 0 3px ${theme.colors.primary}20`,
    },
    '&:disabled': { opacity: 0.8, cursor: 'not-allowed' },
  },
});

type AggregateRow = {
  hospitalId: string;
  amount: number;
  inHouseItemCount: number;
  inHouseAmount: number;
  outHouseItemCount: number;
  outHouseAmount: number;
};

const aggregateTableWrap = css({
  maxHeight: 'calc(100vh - 280px)',
  minHeight: 320,
  '& table': { minWidth: 1000, tableLayout: 'fixed' },
  '& th, & td': { whiteSpace: 'nowrap' },
  '& thead tr:first-of-type th': { borderBottom: `1px solid ${theme.colors.border}` },
  '& .col-amount, & .col-inout': { textAlign: 'right' },
  '& tfoot tr': {
    position: 'sticky',
    bottom: 0,
    zIndex: 1,
    fontWeight: 700,
    borderTop: `2px solid ${theme.colors.border}`,
    boxShadow: `0 -2px 8px ${theme.colors.border}40`,
  },
  '& tfoot td': {
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    fontSize: 13,
    fontWeight: 700,
  },
  '& tfoot .col-amount, & tfoot .col-inout': { textAlign: 'right' },
});

const sortIcon = css({ marginLeft: 4, opacity: 0.6, fontSize: 10 });

function formatAmount(n: number): string {
  return n.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function AggregatePage() {
  const { userRole, currentCorporationId, corporations, hospitals, salesRows } = useApp();
  const isCorporation = userRole === 'corporation';
  const [corporationId, setCorporationId] = useState<string | ''>(
    () => (isCorporation ? currentCorporationId : '')
  );
  const [hospitalId, setHospitalId] = useState<string | ''>('');
  const [productSearch, setProductSearch] = useState('');

  useEffect(() => {
    if (isCorporation && corporationId !== currentCorporationId) {
      setCorporationId(currentCorporationId);
      setHospitalId('');
    }
  }, [isCorporation, currentCorporationId, corporationId]);

  const effectiveCorporationId = isCorporation ? currentCorporationId : corporationId;

  const filtered = useMemo(() => {
    let list = salesRows;
    if (effectiveCorporationId) list = list.filter((r) => r.corporationId === effectiveCorporationId);
    if (hospitalId) list = list.filter((r) => r.hospitalId === hospitalId);
    if (productSearch.trim()) {
      const q = productSearch.trim().toLowerCase();
      list = list.filter((r) => r.productName.toLowerCase().includes(q));
    }
    return list;
  }, [salesRows, effectiveCorporationId, hospitalId, productSearch]);

  const hospitalFilterList = useMemo(() => {
    if (!effectiveCorporationId) return hospitals;
    return hospitals.filter((h) => h.corporationId === effectiveCorporationId);
  }, [effectiveCorporationId, hospitals]);

  const hospitalOptions = useMemo(
    () => [
      { label: '전체', value: '' as string },
      ...hospitalFilterList.map((h) => ({
        label: h.name,
        value: h.id,
        description: h.address || undefined,
      })),
    ],
    [hospitalFilterList]
  );

  /** 병의원별로 묶어서 정산 행 생성 (거래처 단위). 제약사는 원내 없음 → 원내 0, 원외만 집계 */
  const settlementRows = useMemo(() => {
    const byHospital = new Map<
      string,
      { hospitalId: string; amount: number; itemCount: number }
    >();
    for (const r of filtered) {
      const cur = byHospital.get(r.hospitalId);
      const amount = (cur?.amount ?? 0) + r.amount;
      const itemCount = (cur?.itemCount ?? 0) + r.quantity;
      byHospital.set(r.hospitalId, { hospitalId: r.hospitalId, amount, itemCount });
    }
    return Array.from(byHospital.entries())
      .map(([hospitalId, agg]) => ({
        hospitalId,
        amount: agg.amount,
        inHouseItemCount: 0,
        inHouseAmount: 0,
        outHouseItemCount: agg.itemCount,
        outHouseAmount: agg.amount,
      }))
      .sort((a, b) => a.hospitalId.localeCompare(b.hospitalId));
  }, [filtered]);

  const totals = useMemo(() => {
    const totalAmount = settlementRows.reduce((s, r) => s + r.amount, 0);
    const totalInHouseItems = settlementRows.reduce((s, r) => s + r.inHouseItemCount, 0);
    const totalInHouseAmount = settlementRows.reduce((s, r) => s + r.inHouseAmount, 0);
    const totalOutHouseItems = settlementRows.reduce((s, r) => s + r.outHouseItemCount, 0);
    const totalOutHouseAmount = settlementRows.reduce((s, r) => s + r.outHouseAmount, 0);
    return {
      totalAmount,
      totalInHouseItems,
      totalInHouseAmount,
      totalOutHouseItems,
      totalOutHouseAmount,
    };
  }, [settlementRows]);

  const getHospital = (id: string) => hospitals.find((h) => h.id === id);

  const 정산월 = '2026-02';
  const 처방월 = '2026-01';

  const columnHelper = createColumnHelper<AggregateRow>();
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'no',
        header: 'No.',
        size: 40,
        cell: (info) => info.row.index + 1,
      }),
      columnHelper.display({ id: 'status', header: '상태', size: 50, cell: () => '승인' }),
      columnHelper.display({ id: 'settlementMonth', header: '정산월', size: 70, cell: () => 정산월 }),
      columnHelper.display({ id: 'prescriptionMonth', header: '처방월', size: 70, cell: () => 처방월 }),
      columnHelper.accessor(
        (r) => getHospital(r.hospitalId)?.accountCode ?? '-',
        { id: 'accountCode', header: '거래처코드', size: 90 }
      ),
      columnHelper.accessor(
        (r) => getHospital(r.hospitalId)?.name ?? r.hospitalId,
        { id: 'hospitalName', header: '거래처명', size: 120 }
      ),
      columnHelper.accessor(
        (r) => getHospital(r.hospitalId)?.businessNumber ?? '-',
        { id: 'businessNumber', header: '사업자번호', size: 100 }
      ),
      columnHelper.accessor(
        (r) => getHospital(r.hospitalId)?.address ?? '-',
        { id: 'address', header: '주소', size: 120 }
      ),
      columnHelper.accessor('amount', {
        id: 'amount',
        header: '금액',
        size: 90,
        cell: (info) => formatAmount(info.getValue()),
        meta: { className: 'col-amount' },
      }),
      columnHelper.group({
        id: 'inHouse',
        header: '원내',
        columns: [
          columnHelper.accessor('inHouseItemCount', {
            header: () => <>품목수 <span css={sortIcon}><HiChevronDown size={12} /></span></>,
            size: 70,
            meta: { className: 'col-inout' },
          }),
          columnHelper.accessor('inHouseAmount', {
            header: () => <>처방액 <span css={sortIcon}><HiChevronDown size={12} /></span></>,
            size: 90,
            cell: (info) => formatAmount(info.getValue()),
            meta: { className: 'col-inout' },
          }),
        ],
      }),
      columnHelper.group({
        id: 'outHouse',
        header: '원외',
        columns: [
          columnHelper.accessor('outHouseItemCount', {
            header: () => <>품목수 <span css={sortIcon}><HiChevronDown size={12} /></span></>,
            size: 70,
            meta: { className: 'col-inout' },
          }),
          columnHelper.accessor('outHouseAmount', {
            header: () => <>처방액 <span css={sortIcon}><HiChevronDown size={12} /></span></>,
            size: 90,
            cell: (info) => formatAmount(info.getValue()),
            meta: { className: 'col-inout' },
          }),
        ],
      }),
    ],
    [columnHelper, getHospital, 정산월, 처방월]
  );

  return (
    <div css={pageStyles}>
      <h1>법인 정산 확인</h1>
      <p>
        {isCorporation
          ? '본인 법인 실적을 확인하고 정산합니다. 병의원 필터와 품목 검색을 사용할 수 있습니다.'
          : '법인별 실적을 확인하고 정산합니다. 법인·병의원 필터와 품목 검색을 사용할 수 있습니다.'}
      </p>

      <div css={filterCard}>
        <div css={filterRow}>
          {!isCorporation && (
            <div>
              <label htmlFor="aggregate-corporation">법인</label>
              <SingleSelect
                id="aggregate-corporation"
                options={[{ label: '전체', value: '' }, ...corporations.map((c) => ({ label: c.name, value: c.id }))]}
                selected={corporationId}
                onChange={(v) => {
                  setCorporationId(String(v));
                  setHospitalId('');
                }}
                placeholder="전체"
                aria-label="법인"
              />
            </div>
          )}
          <div>
            <label htmlFor="aggregate-hospital">병의원</label>
            <SingleSelect
              id="aggregate-hospital"
              options={hospitalOptions}
              selected={hospitalId || null}
              onChange={(v) => setHospitalId(String(v))}
              placeholder="전체"
              enableSearch
              aria-label="병의원"
            />
          </div>
          <div>
            <label htmlFor="aggregate-product">품목 검색</label>
            <FilterInput
              id="aggregate-product"
              type="search"
              placeholder="제품명으로 검색"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              aria-label="품목 검색"
              css={css({
                minHeight: 32,
                padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
                fontSize: 13,
                borderRadius: theme.radius.sm,
              })}
            />
          </div>
        </div>
      </div>

      <DataTable<AggregateRow>
        columns={columns}
        data={settlementRows}
        getRowId={(r) => r.hospitalId}
        tableCss={aggregateTableWrap}
        renderFooter={() => (
          <tr>
            <td colSpan={9}>합계</td>
            <td className="col-inout">{totals.totalInHouseItems}</td>
            <td className="col-inout">{formatAmount(totals.totalInHouseAmount)}</td>
            <td className="col-inout">{totals.totalOutHouseItems}</td>
            <td className="col-inout">{formatAmount(totals.totalOutHouseAmount)}</td>
          </tr>
        )}
      />
      {settlementRows.length === 0 && (
        <p css={css({ marginTop: theme.spacing(2), color: theme.colors.textMuted })}>
          조건에 맞는 정산 실적이 없습니다.
        </p>
      )}
    </div>
  );
}
