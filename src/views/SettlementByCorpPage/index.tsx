'use client';
/** @jsxImportSource @emotion/react */
import { useMemo } from 'react';
import { css } from '@emotion/react';
import { HiChevronDown } from 'react-icons/hi';
import { mockCorporations, mockHospitals, mockSalesRows } from '@/store/mockData';
import { theme } from '@/theme';
import { Button } from '@/components/Common/Button';
import { formatAmount } from '@/utils/formatNumber';
import { useSettlementByCorp } from '@/hooks/useSettlementByCorp';
import { FilterInput } from '@/components/Common/Input';
import { DataTable } from '@/components/Common/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import * as s from './index.css';
import type { Corporation, Hospital } from '@/types';
import type { SettlementDisplayRow, SettlementTotals } from '@/hooks/useSettlementByCorp';

// --- Styles ---

const pageStyles = css({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
  '& .page-header': {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'baseline',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  '& .page-header h1': {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: 600,
  },
  '& .page-header p': {
    margin: 0,
    fontSize: 13,
  },
});

const layoutWrap = css({
  display: 'flex',
  gap: theme.spacing(4),
  flex: 1,
  minHeight: 0,
  alignItems: 'stretch',
});

const mainArea = css({
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const corpListSidebar = css({
  width: 260,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  backgroundColor: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadow.sm,
  '& .corp-search': {
    flexShrink: 0,
    padding: theme.spacing(2),
    '& input': {
      width: '100%',
      minHeight: 44,
      padding: `0 ${theme.spacing(2)}px`,
      fontSize: 14,
      borderRadius: theme.radius.md,
      border: `2px solid ${theme.colors.border}`,
      '&:focus': {
        outline: 'none',
        borderColor: theme.colors.primary,
        boxShadow: `0 0 0 2px ${theme.colors.primary}20`,
      },
      '&::placeholder': { color: theme.colors.textMuted },
    },
  },
  '& .corp-list': {
    flex: 1,
    minHeight: 0,
    overflow: 'auto',
    padding: theme.spacing(2),
    paddingTop: 0,
  },
  '& button': {
    display: 'block',
    width: '100%',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    textAlign: 'left',
    border: 'none',
    borderRadius: theme.radius.md,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    color: theme.colors.text,
    '&:hover': { backgroundColor: theme.colors.background },
  },
  '& button[data-active="true"]': {
    backgroundColor: `${theme.colors.primary}14`,
    color: theme.colors.primary,
    fontWeight: 600,
  },
});

const promrBadge = css({
  display: 'inline-block',
  marginLeft: theme.spacing(1),
  padding: '2px 8px',
  fontSize: 11,
  fontWeight: 600,
  color: theme.colors.primary,
  backgroundColor: `${theme.colors.primary}18`,
  borderRadius: theme.radius.sm,
});

const sortIcon = css({ marginLeft: 4, opacity: 0.6, fontSize: 10 });

const filterRowStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
});

// --- Helpers ---

function getSettlementMonths(): { 정산월: string; 처방월: string } {
  const now = new Date();
  const 정산월 = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const 처방월 = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;
  return { 정산월, 처방월 };
}

// --- Sub-components ---

interface CorpListSidebarProps {
  corporations: Corporation[];
  selectedCorpId: string | null;
  corpSearch: string;
  onSelectCorp: (id: string) => void;
  onCorpSearchChange: (value: string) => void;
}

function CorpListSidebar({
  corporations,
  selectedCorpId,
  corpSearch,
  onSelectCorp,
  onCorpSearchChange,
}: CorpListSidebarProps) {
  return (
    <aside css={corpListSidebar}>
      <div className="corp-search">
        <input
          type="search"
          placeholder="법인 검색"
          value={corpSearch}
          onChange={(e) => onCorpSearchChange(e.target.value)}
          aria-label="법인 검색"
        />
      </div>
      <div className="corp-list">
        {corporations.map((c) => (
          <Button
            key={c.id}
            variant="menu"
            size="menu"
            active={selectedCorpId === c.id}
            onClick={() => onSelectCorp(c.id)}
          >
            {c.name}
            {c.isPromr && <span css={promrBadge}>프로엠알</span>}
          </Button>
        ))}
      </div>
    </aside>
  );
}

interface SettlementTableProps {
  rows: SettlementDisplayRow[];
  totals: SettlementTotals;
  getHospital: (id: string) => Hospital | undefined;
  isPromr: boolean;
  정산월: string;
  처방월: string;
}

function SettlementTable({ rows, totals, getHospital, isPromr, 정산월, 처방월 }: SettlementTableProps) {
  const columnHelper = createColumnHelper<SettlementDisplayRow>();
  const columns = useMemo(() => {
    const base = [
      columnHelper.display({
        id: 'no',
        header: 'No.',
        cell: (info) => info.row.index + 1,
        meta: { className: 'col-no' },
      }),
      ...(isPromr
        ? [columnHelper.accessor('salespersonLabel', { header: '영업사원명' })]
        : []),
      columnHelper.display({ id: 'status', header: '상태', cell: () => '승인' }),
      columnHelper.display({ id: 'settlementMonth', header: '정산월', cell: () => 정산월 }),
      columnHelper.display({ id: 'prescriptionMonth', header: '처방월', cell: () => 처방월 }),
      columnHelper.accessor(
        (r) => getHospital(r.hospitalId)?.accountCode ?? '-',
        { id: 'accountCode', header: '거래처코드' }
      ),
      columnHelper.accessor(
        (r) => getHospital(r.hospitalId)?.name ?? r.hospitalId,
        { id: 'hospitalName', header: '거래처명' }
      ),
      columnHelper.accessor(
        (r) => getHospital(r.hospitalId)?.businessNumber ?? '-',
        { id: 'businessNumber', header: '사업자번호' }
      ),
      columnHelper.accessor(
        (r) => getHospital(r.hospitalId)?.address ?? '-',
        { id: 'address', header: '주소' }
      ),
      columnHelper.accessor('amount', {
        id: 'amount',
        header: '금액',
        cell: (info) => formatAmount(info.getValue()),
        meta: { className: 'col-amount' },
      }),
      columnHelper.group({
        id: 'inHouse',
        header: '원내',
        columns: [
          columnHelper.accessor('inHouseItemCount', {
            header: () => <>품목수 <span css={sortIcon}><HiChevronDown size={12} /></span></>,
            meta: { className: 'col-inout' },
          }),
          columnHelper.accessor('inHouseAmount', {
            header: () => <>처방액 <span css={sortIcon}><HiChevronDown size={12} /></span></>,
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
            meta: { className: 'col-inout' },
          }),
          columnHelper.accessor('outHouseAmount', {
            header: () => <>처방액 <span css={sortIcon}><HiChevronDown size={12} /></span></>,
            cell: (info) => formatAmount(info.getValue()),
            meta: { className: 'col-inout' },
          }),
        ],
      }),
    ];
    return base;
  }, [columnHelper, isPromr, getHospital, 정산월, 처방월]);

  const footerColSpan = isPromr ? 10 : 9;

  return (
    <DataTable<SettlementDisplayRow>
      columns={columns}
      data={rows}
      getRowId={(r) => (isPromr ? `${r.hospitalId}-${r.salespersonLabel}` : r.hospitalId)}
      variant="compact"
      className={s.settlementTableWrap}
      renderFooter={() => (
        <tr>
          <td colSpan={footerColSpan}>합계</td>
          <td className="col-inout">{totals.totalInHouseItems}</td>
          <td className="col-inout">{formatAmount(totals.totalInHouseAmount)}</td>
          <td className="col-inout">{totals.totalOutHouseItems}</td>
          <td className="col-inout">{formatAmount(totals.totalOutHouseAmount)}</td>
        </tr>
      )}
    />
  );
}

// --- Page ---

export function SettlementByCorpPage() {
  const corporations = mockCorporations;
  const hospitals = mockHospitals;
  const salesRows = mockSalesRows;
  const settlement = useSettlementByCorp({ corporations, hospitals, salesRows });
  const { 정산월, 처방월 } = getSettlementMonths();

  const {
    selectedCorpId,
    setSelectedCorpId,
    corpSearch,
    setCorpSearch,
    salespersonSearch,
    setSalespersonSearch,
    hospitalSearch,
    setHospitalSearch,
    corporationsFiltered,
    selectedCorp,
    filteredDisplayRows,
    displayTotals,
    getHospital,
  } = settlement;


  return (
    <div css={pageStyles}>
      <header className="page-header">
        <h1>법인별 정산확인</h1>
        <p>우측에서 법인 선택 시 해당 법인 실적이 표시됩니다.</p>
      </header>

      <div css={layoutWrap}>
        <main css={mainArea}>
          {selectedCorp ? (
            <>
              <p css={css({ marginBottom: theme.spacing(1), fontSize: 13, color: theme.colors.textMuted })}>
                <strong css={css({ color: theme.colors.text })}>{selectedCorp.name}</strong> 실적
              </p>
              <div css={filterRowStyles}>
                {selectedCorp.isPromr && (
                  <FilterInput
                    type="search"
                    placeholder="영업사원명 검색"
                    value={salespersonSearch}
                    onChange={(e) => setSalespersonSearch(e.target.value)}
                    aria-label="영업사원명 검색"
                    css={css({ maxWidth: 280, minWidth: 140 })}
                  />
                )}
                <FilterInput
                  type="search"
                  placeholder="거래처 검색"
                  value={hospitalSearch}
                  onChange={(e) => setHospitalSearch(e.target.value)}
                  aria-label="거래처 검색"
                  css={css({ maxWidth: 280, minWidth: 140 })}
                />
              </div>
              <SettlementTable
                rows={filteredDisplayRows}
                totals={displayTotals}
                getHospital={getHospital}
                isPromr={selectedCorp.isPromr ?? false}
                정산월={정산월}
                처방월={처방월}
              />
              {filteredDisplayRows.length === 0 && (
                <p css={css({ marginTop: theme.spacing(2), color: theme.colors.textMuted })}>
                  해당 법인의 정산 실적이 없습니다.
                </p>
              )}
            </>
          ) : (
            <p css={css({ color: theme.colors.textMuted, padding: theme.spacing(4) })}>우측에서 법인을 선택하세요.</p>
          )}
        </main>

        <CorpListSidebar
          corporations={corporationsFiltered}
          selectedCorpId={selectedCorpId}
          corpSearch={corpSearch}
          onSelectCorp={setSelectedCorpId}
          onCorpSearchChange={setCorpSearch}
        />
      </div>
    </div>
  );
}
