/** @jsxImportSource @emotion/react */
import { useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { useApp } from '@/context/AppContext';
import { theme } from '@/theme';

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
    color: theme.colors.text,
  },
  '& .page-header p': {
    margin: 0,
    fontSize: 13,
    color: theme.colors.textMuted,
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

const tableWrap = css({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.surface,
  boxShadow: theme.shadow.sm,
  fontSize: 12,
  '& table': { width: '100%', borderCollapse: 'collapse', minWidth: 900 },
  '& th, & td': {
    padding: theme.spacing(1.5),
    textAlign: 'left',
    borderBottom: `1px solid ${theme.colors.border}`,
    borderRight: `1px solid ${theme.colors.border}`,
    whiteSpace: 'nowrap',
  },
  '& th:last-child, & td:last-child': { borderRight: 'none' },
  '& th': { backgroundColor: theme.colors.background, fontWeight: 600 },
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

const tablesRow = css({
  display: 'flex',
  gap: theme.spacing(4),
  flex: 1,
  minHeight: 0,
  '& > *': { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' },
});

const sortIcon = css({ marginLeft: 4, opacity: 0.6, fontSize: 10 });

function formatAmount(n: number): string {
  return n.toLocaleString('ko-KR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function SettlementByCorpPage() {
  const { userRole, corporations, hospitals, salesRows } = useApp();
  const [selectedCorpId, setSelectedCorpId] = useState<string | null>(null);
  const [corpSearch, setCorpSearch] = useState('');

  const corporationsFiltered = useMemo(() => {
    const q = corpSearch.trim().toLowerCase();
    if (!q) return corporations;
    return corporations.filter((c) => c.name.toLowerCase().includes(q));
  }, [corporations, corpSearch]);

  const filtered = useMemo(() => {
    if (!selectedCorpId) return [];
    return salesRows.filter((r) => r.corporationId === selectedCorpId);
  }, [salesRows, selectedCorpId]);

  const settlementRows = useMemo(() => {
    const byHospital = new Map<string, { amount: number; itemCount: number }>();
    for (const r of filtered) {
      const cur = byHospital.get(r.hospitalId);
      const amount = (cur?.amount ?? 0) + r.amount;
      const itemCount = (cur?.itemCount ?? 0) + r.quantity;
      byHospital.set(r.hospitalId, { amount, itemCount });
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

  const dealerSettlementRows = useMemo(() => {
    const key = (h: string, s: string) => `${h}\t${s}`;
    const byKey = new Map<string, { amount: number; itemCount: number }>();
    for (const r of filtered) {
      const name = r.salespersonName ?? '-';
      const k = key(r.hospitalId, name);
      const cur = byKey.get(k);
      const amount = (cur?.amount ?? 0) + r.amount;
      const itemCount = (cur?.itemCount ?? 0) + r.quantity;
      byKey.set(k, { amount, itemCount });
    }
    return Array.from(byKey.entries())
      .map(([k, agg]) => {
        const [hospitalId, salespersonName] = k.split('\t');
        return {
          hospitalId,
          salespersonName,
          amount: agg.amount,
          inHouseItemCount: 0,
          inHouseAmount: 0,
          outHouseItemCount: agg.itemCount,
          outHouseAmount: agg.amount,
        };
      })
      .sort((a, b) =>
        a.hospitalId.localeCompare(b.hospitalId) || a.salespersonName.localeCompare(b.salespersonName)
      );
  }, [filtered]);

  const totals = useMemo(() => ({
    totalInHouseItems: settlementRows.reduce((s, r) => s + r.inHouseItemCount, 0),
    totalInHouseAmount: settlementRows.reduce((s, r) => s + r.inHouseAmount, 0),
    totalOutHouseItems: settlementRows.reduce((s, r) => s + r.outHouseItemCount, 0),
    totalOutHouseAmount: settlementRows.reduce((s, r) => s + r.outHouseAmount, 0),
  }), [settlementRows]);

  const dealerTotals = useMemo(
    () => ({
      totalInHouseItems: dealerSettlementRows.reduce((s, r) => s + r.inHouseItemCount, 0),
      totalInHouseAmount: dealerSettlementRows.reduce((s, r) => s + r.inHouseAmount, 0),
      totalOutHouseItems: dealerSettlementRows.reduce((s, r) => s + r.outHouseItemCount, 0),
      totalOutHouseAmount: dealerSettlementRows.reduce((s, r) => s + r.outHouseAmount, 0),
    }),
    [dealerSettlementRows]
  );

  const getHospital = (id: string) => hospitals.find((h) => h.id === id);
  const selectedCorp = selectedCorpId ? corporations.find((c) => c.id === selectedCorpId) : null;
  const 정산월 = '2026-02';
  const 처방월 = '2026-01';

  if (userRole === 'corporation') return <Navigate to="/" replace />;

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
              <div css={selectedCorp.isPromr ? tablesRow : undefined}>
                {selectedCorp.isPromr && (
                  <div>
                    <p css={css({ marginBottom: 4, fontSize: 12, fontWeight: 600, color: theme.colors.textMuted })}>
                      딜러 실적
                    </p>
                    <div css={tableWrap}>
                      <table>
                        <thead>
                          <tr>
                            <th rowSpan={2}>No.</th>
                            <th rowSpan={2}>영업사원명</th>
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
                          {dealerSettlementRows.map((row, idx) => {
                            const h = getHospital(row.hospitalId);
                            return (
                              <tr key={`${row.hospitalId}-${row.salespersonName}-${idx}`}>
                                <td>{idx + 1}</td>
                                <td>{row.salespersonName}</td>
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
                            <td colSpan={10}>합계</td>
                            <td className="col-inout">{dealerTotals.totalInHouseItems}</td>
                            <td className="col-inout">{formatAmount(dealerTotals.totalInHouseAmount)}</td>
                            <td className="col-inout">{dealerTotals.totalOutHouseItems}</td>
                            <td className="col-inout">{formatAmount(dealerTotals.totalOutHouseAmount)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                    {dealerSettlementRows.length === 0 && (
                      <p css={css({ marginTop: theme.spacing(1), fontSize: 13, color: theme.colors.textMuted })}>
                        딜러 실적이 없습니다.
                      </p>
                    )}
                  </div>
                )}
                <div>
                  {selectedCorp.isPromr && (
                    <p css={css({ marginBottom: 4, fontSize: 12, fontWeight: 600, color: theme.colors.textMuted })}>
                      법인 실적
                    </p>
                  )}
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
                      해당 법인의 정산 실적이 없습니다.
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p css={css({ color: theme.colors.textMuted, padding: theme.spacing(4) })}>
              우측에서 법인을 선택하세요.
            </p>
          )}
        </main>

        <aside css={corpListSidebar}>
          <div className="corp-search">
            <input
              type="search"
              placeholder="법인 검색"
              value={corpSearch}
              onChange={(e) => setCorpSearch(e.target.value)}
              aria-label="법인 검색"
            />
          </div>
          <div className="corp-list">
            {corporationsFiltered.map((c) => (
              <button
                key={c.id}
                type="button"
                data-active={selectedCorpId === c.id}
                onClick={() => setSelectedCorpId(c.id)}
              >
                {c.name}
                {c.isPromr && <span css={promrBadge}>프로엠알</span>}
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
