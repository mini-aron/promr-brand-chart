'use client';
import { useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { useDemoPlayStore } from '@/store/demoPlayStore';
import { formatAmount } from '@/utils/formatNumber';
import { useSettlementByCorp } from '@/hooks/useSettlementByCorp';
import { Input } from '@/shared/components/ui/Input';
import { HospitalSearchSelect } from '@/shared/components/ui/Select';
import { DataTable } from '@/shared/components/ui/DataTable';
import { CorpListSidebar, PageHeader } from '@/shared/components/layout';
import { createColumnHelper } from '@tanstack/react-table';
import * as s from './index.css';
import type { Hospital } from '@/types';
import type { SettlementDisplayRow, SettlementTotals } from '@/hooks/useSettlementByCorp';

// --- Helpers ---

function getSettlementMonths(): { 정산월: string; 처방월: string } {
  const now = new Date();
  const 정산월 = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const 처방월 = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;
  return { 정산월, 처방월 };
}

// --- Sub-components ---

interface SettlementTableProps {
  rows: SettlementDisplayRow[];
  totals: SettlementTotals;
  getHospital: (id: string) => Hospital | undefined;
  isPromr: boolean;
  정산월: string;
  처방월: string;
}

function SettlementTable({
  rows,
  totals,
  getHospital,
  isPromr,
  정산월,
  처방월,
}: SettlementTableProps) {
  const columnHelper = createColumnHelper<SettlementDisplayRow>();
  const columns = useMemo(() => {
    const base = [
      columnHelper.display({
        id: 'no',
        header: 'No.',
        cell: (info) => info.row.index + 1,
        meta: { className: 'col-no' },
      }),
      ...(isPromr ? [columnHelper.accessor('salespersonLabel', { header: '영업사원명' })] : []),
      columnHelper.display({ id: 'status', header: '상태', cell: () => '승인' }),
      columnHelper.display({ id: 'settlementMonth', header: '정산월', cell: () => 정산월 }),
      columnHelper.display({ id: 'prescriptionMonth', header: '처방월', cell: () => 처방월 }),
      columnHelper.accessor((r) => getHospital(r.hospitalId)?.accountCode ?? '-', {
        id: 'accountCode',
        header: '거래처코드',
      }),
      columnHelper.accessor((r) => getHospital(r.hospitalId)?.name ?? r.hospitalId, {
        id: 'hospitalName',
        header: '거래처명',
      }),
      columnHelper.accessor((r) => getHospital(r.hospitalId)?.businessNumber ?? '-', {
        id: 'businessNumber',
        header: '사업자번호',
      }),
      columnHelper.accessor((r) => getHospital(r.hospitalId)?.address ?? '-', {
        id: 'address',
        header: '주소',
      }),
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
            header: () => (
              <>
                품목수{' '}
                <span className={s.sortIcon}>
                  <ChevronDown size={12} aria-hidden />
                </span>
              </>
            ),
            meta: { className: 'col-inout' },
          }),
          columnHelper.accessor('inHouseAmount', {
            header: () => (
              <>
                처방액{' '}
                <span className={s.sortIcon}>
                  <ChevronDown size={12} aria-hidden />
                </span>
              </>
            ),
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
            header: () => (
              <>
                품목수{' '}
                <span className={s.sortIcon}>
                  <ChevronDown size={12} aria-hidden />
                </span>
              </>
            ),
            meta: { className: 'col-inout' },
          }),
          columnHelper.accessor('outHouseAmount', {
            header: () => (
              <>
                처방액{' '}
                <span className={s.sortIcon}>
                  <ChevronDown size={12} aria-hidden />
                </span>
              </>
            ),
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
  const corporations = useDemoPlayStore((s) => s.corporations);
  const hospitals = useDemoPlayStore((s) => s.hospitals);
  const salesRows = useDemoPlayStore((s) => s.salesRows);
  const settlement = useSettlementByCorp({ corporations, hospitals, salesRows });
  const { 정산월, 처방월 } = getSettlementMonths();

  const {
    selectedCorpId,
    setSelectedCorpId,
    corpSearch,
    setCorpSearch,
    salespersonSearch,
    setSalespersonSearch,
    filterHospitalId,
    setFilterHospitalId,
    corporationsFiltered,
    selectedCorp,
    filteredDisplayRows,
    displayTotals,
    getHospital,
  } = settlement;

  const corpHospitalOptions = useMemo(() => {
    if (!selectedCorpId) return [];
    return hospitals
      .filter((h) => h.corporationId === selectedCorpId)
      .map((h) => ({
        label: h.name,
        value: h.id,
        address: h.address,
        businessNumber: h.businessNumber,
      }));
  }, [hospitals, selectedCorpId]);

  const filterHospitalOptions = useMemo(
    () => [{ label: '전체', value: '' as const }, ...corpHospitalOptions],
    [corpHospitalOptions],
  );

  return (
    <div className={s.page}>
      <PageHeader
        title="법인별 정산확인"
        description="우측에서 법인 선택 시 해당 법인 실적이 표시됩니다."
      />

      <div className={s.layoutWrap}>
        <main className={s.mainArea}>
          {selectedCorp ? (
            <>
              <p className={s.corpDesc}>
                <strong className={s.corpDescStrong}>{selectedCorp.name}</strong> 실적
              </p>
              <div className={s.filterSection}>
                <div className={s.filterRow}>
                  {selectedCorp.isPromr && (
                    <div className={s.filterField}>
                      <label htmlFor="salesperson-search">영업사원명</label>
                      <Input
                        id="salesperson-search"
                        size="default"
                        type="search"
                        placeholder="영업사원명 검색"
                        value={salespersonSearch}
                        onChange={(e) => setSalespersonSearch(e.target.value)}
                      />
                    </div>
                  )}
                  <div className={s.filterField}>
                    <label htmlFor="filter-hospital">병의원</label>
                    <HospitalSearchSelect
                      id="filter-hospital"
                      options={filterHospitalOptions}
                      selected={filterHospitalId}
                      onChange={(v) =>
                        setFilterHospitalId(v === '' || v == null ? null : String(v))
                      }
                      placeholder="병의원 검색"
                      openOnFocus
                    />
                  </div>
                </div>
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
                <p className={s.emptyMessage}>해당 법인의 정산 실적이 없습니다.</p>
              )}
            </>
          ) : (
            <p className={s.selectCorpHint}>우측에서 법인을 선택하세요.</p>
          )}
        </main>

        <CorpListSidebar
          corporations={corporationsFiltered}
          selectedCorpId={selectedCorpId}
          corpSearch={corpSearch}
          onSelectCorp={setSelectedCorpId}
          onCorpSearchChange={setCorpSearch}
          searchLabel="법인 검색"
          searchInputId="corp-search"
        />
      </div>
    </div>
  );
}
