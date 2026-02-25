/** @jsxImportSource @emotion/react */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { css } from '@emotion/react';
import { useApp } from '@/context/AppContext';
import { theme } from '@/theme';

const pageStyles = css({
  '& h1': { marginBottom: theme.spacing(2), color: theme.colors.text },
  '& p': { color: theme.colors.textMuted, marginBottom: theme.spacing(4) },
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
  '& input': {
    display: 'block',
    width: '100%',
    minHeight: 48,
    padding: `0 ${theme.spacing(3)}px`,
    fontSize: 15,
    borderRadius: theme.radius.md,
    border: `2px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    '&::placeholder': { color: theme.colors.textMuted },
    '&:hover': { borderColor: theme.colors.primary },
    '&:focus': {
      outline: 'none',
      borderColor: theme.colors.primary,
      boxShadow: `0 0 0 3px ${theme.colors.primary}20`,
    },
  },
});

const inquiryRow = css({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  marginTop: theme.spacing(3),
  paddingTop: theme.spacing(3),
  borderTop: `1px solid ${theme.colors.border}`,
});

const inquiryButton = css({
  padding: `${theme.buttonPadding.y}px ${theme.spacing(3)}px`,
  fontSize: 15,
  fontWeight: 600,
  borderRadius: theme.radius.md,
  border: `2px solid ${theme.colors.primary}`,
  backgroundColor: theme.colors.primary,
  color: 'white',
  cursor: 'pointer',
  '&:hover': { backgroundColor: theme.colors.primaryHover },
});

const tableWrap = css({
  overflow: 'auto',
  maxHeight: 'calc(100vh - 280px)',
  minHeight: 320,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.surface,
  boxShadow: theme.shadow.sm,
  fontSize: 12,
  '& table': { width: '100%', borderCollapse: 'collapse', minWidth: 1000 },
  '& th, & td': {
    padding: theme.spacing(1.5),
    textAlign: 'left',
    borderBottom: `1px solid ${theme.colors.border}`,
    borderRight: `1px solid ${theme.colors.border}`,
    whiteSpace: 'nowrap',
  },
  '& th:last-child, & td:last-child': { borderRight: 'none' },
  '& th': { backgroundColor: theme.colors.background, fontWeight: 600 },
  '& thead tr:first-of-type th': { borderBottom: `1px solid ${theme.colors.border}` },
  '& .col-amount, & .col-inout': { textAlign: 'right' },
  '& tbody tr:hover': { backgroundColor: `${theme.colors.primary}06` },
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
  const [hospitalSearchQuery, setHospitalSearchQuery] = useState('');
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

  const hospitalFilterListFiltered = useMemo(() => {
    const q = hospitalSearchQuery.trim().toLowerCase();
    if (!q) return hospitalFilterList;
    return hospitalFilterList.filter((h) => h.name.toLowerCase().includes(q));
  }, [hospitalFilterList, hospitalSearchQuery]);

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
  const selectedHospital = hospitalId ? getHospital(hospitalId) : null;

  const handleInquiry = useCallback(() => {
    if (!selectedHospital) return;
    const subject = encodeURIComponent(`[문의] ${selectedHospital.name}`);
    const body = encodeURIComponent(`병의원: ${selectedHospital.name}\n거래처코드: ${selectedHospital.accountCode ?? '-'}\n\n문의 내용:\n`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }, [selectedHospital]);

  const 정산월 = '2026-02';
  const 처방월 = '2026-01';

  return (
    <div css={pageStyles}>
      <h1>법인 정산 확인</h1>
      <p>
        {isCorporation
          ? '본인 법인 실적을 확인하고 정산합니다. 병의원 필터와 품목 검색을 사용할 수 있습니다.'
          : '법인별 실적을 확인하고 정산합니다. 법인·병의원 필터와 품목 검색을 사용할 수 있습니다.'}
      </p>

      <div css={filterCard}>
        <h2 css={css({ fontSize: 16, fontWeight: 600, marginBottom: theme.spacing(3), color: theme.colors.text })}>
          필터
        </h2>
        <div css={filterRow}>
          {!isCorporation && (
            <div>
              <label htmlFor="aggregate-corporation">법인</label>
              <select
                id="aggregate-corporation"
                value={corporationId}
                onChange={(e) => {
                  setCorporationId(e.target.value);
                  setHospitalId('');
                  setHospitalSearchQuery('');
                }}
              >
                <option value="">전체</option>
                {corporations.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div>
            <label htmlFor="aggregate-hospital-search">병의원 검색</label>
            <input
              id="aggregate-hospital-search"
              type="search"
              placeholder="병의원명으로 검색"
              value={hospitalSearchQuery}
              onChange={(e) => setHospitalSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="aggregate-hospital">병의원</label>
            <select
              id="aggregate-hospital"
              value={hospitalId}
              onChange={(e) => setHospitalId(e.target.value)}
            >
              <option value="">전체</option>
              {hospitalFilterListFiltered.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="aggregate-product">품목 검색</label>
            <input
              id="aggregate-product"
              type="search"
              placeholder="제품명으로 검색"
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
            />
          </div>
        </div>
        {selectedHospital && (
          <div css={inquiryRow}>
            <span css={css({ fontSize: 14, color: theme.colors.textMuted })}>
              선택된 병의원: <strong css={css({ color: theme.colors.text })}>{selectedHospital.name}</strong>
            </span>
            <button type="button" css={inquiryButton} onClick={handleInquiry}>
              문의
            </button>
          </div>
        )}
      </div>

      <div css={tableWrap}>
        <table>
          <thead>
            <tr>
              <th rowSpan={2}>No.</th>
              <th rowSpan={2}>상태</th>
              <th rowSpan={2}>정산월</th>
              <th rowSpan={2}>처방월</th>
              <th rowSpan={2}>거래처코드</th>
              <th rowSpan={2}>거래처명</th>
              <th rowSpan={2}>사업자번호</th>
              <th rowSpan={2}>주소</th>
              <th rowSpan={2} className="col-amount">금액</th>
              <th colSpan={2}>원내</th>
              <th colSpan={2}>원외</th>
            </tr>
            <tr>
              <th className="col-inout">품목수 <span css={sortIcon}>▼</span></th>
              <th className="col-inout">처방액 <span css={sortIcon}>▼</span></th>
              <th className="col-inout">품목수 <span css={sortIcon}>▼</span></th>
              <th className="col-inout">처방액 <span css={sortIcon}>▼</span></th>
            </tr>
          </thead>
          <tbody>
            {settlementRows.map((row, idx) => {
              const h = getHospital(row.hospitalId);
              return (
                <tr key={row.hospitalId}>
                  <td>{idx + 1}</td>
                  <td>승인</td>
                  <td>{정산월}</td>
                  <td>{처방월}</td>
                  <td>{h?.accountCode ?? '-'}</td>
                  <td>{h?.name ?? row.hospitalId}</td>
                  <td>{h?.businessNumber ?? '-'}</td>
                  <td>{h?.address ?? '-'}</td>
                  <td className="col-amount">{formatAmount(row.amount)}</td>
                  <td className="col-inout">{row.inHouseItemCount}</td>
                  <td className="col-inout">{formatAmount(row.inHouseAmount)}</td>
                  <td className="col-inout">{row.outHouseItemCount}</td>
                  <td className="col-inout">{formatAmount(row.outHouseAmount)}</td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={9}>합계</td>
              <td className="col-inout">{totals.totalInHouseItems}</td>
              <td className="col-inout">{formatAmount(totals.totalInHouseAmount)}</td>
              <td className="col-inout">{totals.totalOutHouseItems}</td>
              <td className="col-inout">{formatAmount(totals.totalOutHouseAmount)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      {settlementRows.length === 0 && (
        <p css={css({ marginTop: theme.spacing(2), color: theme.colors.textMuted })}>
          조건에 맞는 정산 실적이 없습니다.
        </p>
      )}
    </div>
  );
}
