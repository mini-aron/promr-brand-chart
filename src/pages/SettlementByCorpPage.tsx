/** @jsxImportSource @emotion/react */
import { Navigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { HiChevronDown } from 'react-icons/hi';
import { useApp } from '@/context/AppContext';
import { theme } from '@/theme';
import { Button } from '@/components/Common/Button';
import { formatAmount } from '@/utils/formatNumber';
import { useSettlementByCorp } from '@/hooks/useSettlementByCorp';
import { FilterInput } from '@/components/Common/Input';
import type { Corporation, Hospital } from '@/types';
import type { SettlementDisplayRow, SettlementTotals } from '@/hooks/useSettlementByCorp';
import { tableWrapCompact } from '@/style';

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

const settlementTableWrap = css(tableWrapCompact, {
  '& table': { minWidth: 720 },
  '& th, & td': {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '& .col-no': { width: 40, minWidth: 40, maxWidth: 40, textAlign: 'center' },
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
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    fontSize: 12,
    fontWeight: 700,
  },
  '& tfoot .col-amount, & tfoot .col-inout': { textAlign: 'right' },
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
  return (
    <div css={settlementTableWrap}>
      <table>
        <thead>
          <tr>
            <th rowSpan={2} className="col-no">
              No.
            </th>
            <th rowSpan={2}>영업사원명</th>
            <th rowSpan={2}>상태</th>
            <th rowSpan={2}>정산월</th>
            <th rowSpan={2}>처방월</th>
            <th rowSpan={2}>거래처코드</th>
            <th rowSpan={2}>거래처명</th>
            <th rowSpan={2}>사업자번호</th>
            <th rowSpan={2}>주소</th>
            <th rowSpan={2} className="col-amount">
              금액
            </th>
            <th colSpan={2}>원내</th>
            <th colSpan={2}>원외</th>
          </tr>
          <tr>
            <th className="col-inout">
              품목수 <span css={sortIcon}><HiChevronDown size={12} /></span>
            </th>
            <th className="col-inout">
              처방액 <span css={sortIcon}><HiChevronDown size={12} /></span>
            </th>
            <th className="col-inout">
              품목수 <span css={sortIcon}><HiChevronDown size={12} /></span>
            </th>
            <th className="col-inout">
              처방액 <span css={sortIcon}><HiChevronDown size={12} /></span>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => {
            const h = getHospital(row.hospitalId);
            return (
              <tr key={isPromr ? `${row.hospitalId}-${row.salespersonLabel}-${idx}` : row.hospitalId}>
                <td className="col-no">{idx + 1}</td>
                <td>{row.salespersonLabel}</td>
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
            <td className="col-inout">{totals.totalInHouseItems}</td>
            <td className="col-inout">{formatAmount(totals.totalInHouseAmount)}</td>
            <td className="col-inout">{totals.totalOutHouseItems}</td>
            <td className="col-inout">{formatAmount(totals.totalOutHouseAmount)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// --- Page ---

export function SettlementByCorpPage() {
  const { userRole, corporations, hospitals, salesRows } = useApp();
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
