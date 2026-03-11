/** @jsxImportSource @emotion/react */
import React, { useCallback, useMemo } from 'react';
import { css } from '@emotion/react';
import { clsx } from 'clsx';
import { mockCorporations, mockHospitals } from '@/store/mockData';
import type { ProductFee, FeeEvent } from '@/types';
import { theme } from '@/theme';
import * as tableStyles from '@/style/TableStyles.css';
import { ProductFeeTableSection } from './ProductFeeTableSection';
import * as s from './ProductFeeTable.css';

const finalFeeDivider = css({
  borderRight: `2px solid ${theme.colors.text} !important`,
});

const expandCell = css({
  width: 36,
  minWidth: 36,
  height: 28,
  minHeight: 28,
  padding: theme.spacing(0.5),
  verticalAlign: 'middle',
  cursor: 'pointer',
  textAlign: 'center',
  lineHeight: 1,
  '&:hover': { backgroundColor: `${theme.colors.primary}08` },
});

const expandCellCount = css({
  display: 'inline-block',
  minWidth: '1.5em',
  fontSize: 10,
  fontVariantNumeric: 'tabular-nums',
  textAlign: 'center',
  color: theme.colors.textMuted,
  marginTop: 1,
});

const feeInputStyles = css({
  width: 72,
  minHeight: 28,
  padding: `0 ${theme.spacing(1.5)}px`,
  fontSize: 13,
  fontWeight: 500,
  borderRadius: theme.radius.md,
  border: `2px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.surface,
  color: theme.colors.text,
  textAlign: 'right',
  '&:focus': {
    outline: 'none',
    borderColor: theme.colors.primary,
    boxShadow: `0 0 0 3px ${theme.colors.primary}20`,
  },
  '&::placeholder': { color: theme.colors.textMuted },
});

const productCodeInputStyles = css({
  width: '100%',
  minHeight: 28,
  padding: theme.spacing(0.75),
  fontSize: 13,
  borderRadius: 0,
  border: 'none',
  backgroundColor: 'transparent',
  color: theme.colors.text,
  boxSizing: 'border-box',
  display: 'block',
  '&:focus': {
    outline: 'none',
    boxShadow: 'inset 0 0 0 2px ' + theme.colors.primary,
  },
});

const feeInputCell = css({
  '& .fee-suffix': {
    marginLeft: 4,
    fontSize: 13,
    color: theme.colors.textMuted,
  },
});

const eventSubRow = (isExpanded: boolean) =>
  css({
    backgroundColor: theme.colors.background,
    '& td': {
      padding: 0,
      borderBottom: isExpanded ? `1px solid ${theme.colors.border}` : 'none',
      borderTop: 'none',
      verticalAlign: 'top',
      ...(isExpanded && { overflow: 'visible' }),
      ...(!isExpanded && { lineHeight: 0, fontSize: 0 }),
    },
  });

const eventExpandWrap = (isExpanded: boolean) =>
  css({
    overflow: isExpanded ? 'visible' : 'hidden',
    maxHeight: isExpanded ? 1500 : 0,
    opacity: isExpanded ? 1 : 0,
    transition: 'max-height 0.35s ease-out, opacity 0.25s ease-out',
    ...(isExpanded && { padding: theme.spacing(1.5), paddingTop: theme.spacing(1) }),
    ...(!isExpanded && { margin: 0, padding: 0, minHeight: 0 }),
  });

const eventTableWrap = css({
  width: '100%',
  tableLayout: 'fixed',
  borderCollapse: 'collapse',
  fontSize: 12,
  '& th, & td': {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
    textAlign: 'left',
    borderBottom: `1px solid ${theme.colors.border}`,
    verticalAlign: 'middle',
  },
  '& th:nth-of-type(3), & td:nth-of-type(3), & th:nth-of-type(6), & td:nth-of-type(6), & th:nth-of-type(7), & td:nth-of-type(7), & th:nth-of-type(8), & td:nth-of-type(8), & th:nth-of-type(9), & td:nth-of-type(9)': {
    textAlign: 'center',
  },
  '& th:nth-of-type(5), & td:nth-of-type(5)': {
    textAlign: 'right',
    fontVariantNumeric: 'tabular-nums',
    borderRight: `2px solid ${theme.colors.text}`,
  },
  '& th': {
    backgroundColor: theme.colors.background,
    fontWeight: 600,
    color: theme.colors.textMuted,
    fontSize: 11,
  },
  '& tbody tr:last-child td': { borderBottom: 'none' },
});

const eventFeeRateBadgeBase = css({ fontSize: 12, fontWeight: 600 });

const finalFeeResultWrap = css({
  backgroundColor: theme.colors.surface,
  '& tr td': { borderTop: `1px solid ${theme.colors.border}` },
});

const finalFeeResultRow = css({
  fontSize: 13,
  '& td': { borderBottom: 'none' },
  '& .final-fee-title': { fontWeight: 600 },
  '& .final-fee-rate': { fontWeight: 600, fontVariantNumeric: 'tabular-nums', fontSize: 14 },
});

const thBase = css({
  padding: theme.spacing(0.75),
  borderBottom: `1px solid ${theme.colors.border}`,
  borderRight: `1px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.background,
  fontWeight: 600,
});

const corpSectionHeader = css({
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  fontSize: 15,
  fontWeight: 700,
  color: theme.colors.text,
  borderBottom: `2px solid ${theme.colors.border}`,
  marginBottom: 0,
});

export interface ProductFeeTableProps {
  filteredFees: ProductFee[];
  currentFees: ProductFee[];
  eventsByProduct: Map<string, FeeEvent[]>;
  expandedProducts: Set<string>;
  rightPanelMode: 'event' | 'product';
  eventProductCode: string;
  isRowModified: (index: number) => boolean;
  /** 최종수수료 계산 기준. item=전체(품목 이벤트만), corporation=법인/병원 선택 시 */
  feeScope: { type: 'item' } | { corporationId: string; hospitalId?: string };
  /** 품목별(기본) | 법인별 그룹화 | 병원별 그룹화 */
  tableCriteria?: 'product' | 'corporation' | 'hospital';
  onToggleExpand: (productCode: string) => void;
  onUpdateFeeRate: (productCode: string, feeRate: number) => void;
  onUpdateProductCode: (index: number, newCode: string) => void;
  onRowClickForEvent: (productCode: string, e: React.MouseEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onSwitchToEventMode: (productCode: string) => void;
}

export function ProductFeeTable({
  filteredFees,
  currentFees,
  eventsByProduct,
  expandedProducts,
  rightPanelMode,
  eventProductCode,
  isRowModified,
  feeScope,
  onToggleExpand,
  onUpdateFeeRate,
  onUpdateProductCode,
  onRowClickForEvent,
  onDeleteEvent,
  onSwitchToEventMode,
  tableCriteria = 'product',
}: ProductFeeTableProps) {
  const showFinalFee = true;
  const feeScopeForCompute = useMemo(() => {
    if (!('corporationId' in feeScope)) return { type: 'item' as const };
    const { corporationId, hospitalId } = feeScope;
    if (hospitalId)
      return { type: 'corporation_hospital' as const, corporationId, hospitalId };
    const firstHospital = mockHospitals.find((h) => h.corporationId === corporationId);
    if (firstHospital)
      return { type: 'corporation_hospital' as const, corporationId, hospitalId: firstHospital.id };
    return { type: 'corporation' as const, corporationId };
  }, [feeScope]);

  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  const isEventApplicable = useCallback(
    (e: FeeEvent) => todayStr >= e.startDate && todayStr <= e.endDate,
    [todayStr]
  );

  const formatEventFeeRate = useCallback((e: FeeEvent) => {
    if (e.isFixedFee) return `[고정]${e.fixedFeeRate ?? 0}%`;
    const rate = e.additionalFeeRate ?? 0;
    return rate >= 0 ? `+${rate}%` : `${rate}%`;
  }, []);

  const getEventFeeRateColor = useCallback((e: FeeEvent) => {
    if (e.isFixedFee) return theme.colors.text;
    const rate = e.additionalFeeRate ?? 0;
    return rate < 0 ? theme.colors.error : theme.colors.primary;
  }, []);

  const getEventScopeText = useCallback((e: FeeEvent) => {
    if (e.type === 'item') return '전체';
    const corp = mockCorporations.find((c) => c.id === e.corporationId)?.name ?? '';
    if (e.type === 'corporation') return corp || '-';
    const hosp = mockHospitals.find((h) => h.id === e.hospitalId)?.name ?? '';
    return corp && hosp ? `${corp}/${hosp}` : corp || hosp || '-';
  }, []);

  /** 이벤트 정렬: 전체 → 법인별 → 법인 내 병원별(병원 이벤트는 해당 법인 아래) */
  const sortEventsByScope = useCallback((events: FeeEvent[]): FeeEvent[] => {
    const key = (e: FeeEvent) => {
      if (e.type === 'item') return '0';
      if (e.type === 'corporation') return `1_${e.corporationId ?? ''}_0`;
      return `1_${e.corporationId ?? ''}_1_${e.hospitalId ?? ''}`;
    };
    return [...events].sort((a, b) => key(a).localeCompare(key(b)));
  }, []);

  const computeFinalFeeForScope = useCallback(
    (
      baseRate: number,
      events: FeeEvent[],
      scope:
        | { type: 'item' }
        | { type: 'corporation'; corporationId: string }
        | { type: 'corporation_hospital'; corporationId: string; hospitalId: string }
    ): number => {
      const matches = events.filter((e) => {
        if (e.type === 'item') return true;
        if (e.type === 'corporation') return scope.type !== 'item' && e.corporationId === scope.corporationId;
        if (e.type === 'corporation_hospital')
          return (
            scope.type === 'corporation_hospital' &&
            e.corporationId === scope.corporationId &&
            e.hospitalId === scope.hospitalId
          );
        return false;
      });
      const sorted = [...matches].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
      let result = baseRate;
      for (const e of sorted) {
        if (e.isFixedFee) return e.fixedFeeRate ?? 0;
        result += e.additionalFeeRate ?? 0;
      }
      return Math.max(0, Math.min(100, result));
    },
    []
  );

  type ScopeForCompute =
    | { type: 'item' }
    | { type: 'corporation'; corporationId: string }
    | { type: 'corporation_hospital'; corporationId: string; hospitalId: string };

  const getFinalFeeForRow = useCallback(
    (p: ProductFee, scopeOverride?: ScopeForCompute): number => {
      const scope = scopeOverride ?? feeScopeForCompute;
      if (!scope) return p.feeRate;
      const productEvents = eventsByProduct.get(p.productCode) ?? [];
      return computeFinalFeeForScope(p.feeRate, productEvents, scope);
    },
    [feeScopeForCompute, eventsByProduct, computeFinalFeeForScope]
  );

  /** 현재 필터(법인/병원) 범위에 해당 이벤트가 적용되는지 */
  const isEventInFilterScope = useCallback(
    (e: FeeEvent, scopeOverride?: ScopeForCompute): boolean => {
      const scope = scopeOverride ?? feeScopeForCompute;
      if (!scope) return e.type === 'item';
      if (scope.type === 'item') return e.type === 'item';
      if (e.type === 'item') return true;
      if (e.type === 'corporation') return e.corporationId === scope.corporationId;
      if (e.type === 'corporation_hospital')
        return (
          scope.type === 'corporation_hospital' &&
          e.corporationId === scope.corporationId &&
          e.hospitalId === scope.hospitalId
        );
      return false;
    },
    [feeScopeForCompute]
  );

  const getRowClassName = useCallback(
    (p: ProductFee) => {
      const idx = currentFees.findIndex((x) => x.productCode === p.productCode);
      const modified = isRowModified(idx);
      const selectedForEvent = rightPanelMode === 'event' && eventProductCode === p.productCode;
      if (modified && selectedForEvent) return clsx(tableStyles.tableRowModified, s.selectedRow);
      if (modified) return tableStyles.tableRowModified;
      if (selectedForEvent) return s.selectedRow;
      return undefined;
    },
    [currentFees, isRowModified, rightPanelMode, eventProductCode]
  );

  const tableWrapClassName = clsx(tableStyles.tableWrapPlain, s.feeTableWrapOverrides);

  const colCount = showFinalFee ? 10 : 9;

  const getScopeForCorp = useCallback((corporationId: string): ScopeForCompute => {
    const firstHospital = mockHospitals.find((h) => h.corporationId === corporationId);
    if (firstHospital)
      return { type: 'corporation_hospital', corporationId, hospitalId: firstHospital.id };
    return { type: 'corporation', corporationId };
  }, []);

  /** 법인별: 해당 법인 이벤트가 있는 (법인ID → 품목코드[]) */
  const productsByCorporation = useMemo(() => {
    const map = new Map<string, Set<string>>();
    eventsByProduct.forEach((events, productCode) => {
      events.forEach((e) => {
        if (e.type === 'corporation' && e.corporationId) {
          const set = map.get(e.corporationId) ?? new Set();
          set.add(productCode);
          map.set(e.corporationId, set);
        }
        if (e.type === 'corporation_hospital' && e.corporationId) {
          const set = map.get(e.corporationId) ?? new Set();
          set.add(productCode);
          map.set(e.corporationId, set);
        }
      });
    });
    return map;
  }, [eventsByProduct]);

  /** 병원별: 해당 병원 이벤트가 있는 ((법인ID,병원ID) → 품목코드[]) */
  const productsByHospital = useMemo(() => {
    const map = new Map<string, Set<string>>();
    eventsByProduct.forEach((events, productCode) => {
      events.forEach((e) => {
        if (e.type === 'corporation_hospital' && e.corporationId && e.hospitalId) {
          const key = `${e.corporationId}:${e.hospitalId}`;
          const set = map.get(key) ?? new Set();
          set.add(productCode);
          map.set(key, set);
        }
      });
    });
    return map;
  }, [eventsByProduct]);

  const sectionProps = useMemo(
    () => ({
      currentFees,
      eventsByProduct,
      expandedProducts,
      rightPanelMode,
      getFinalFeeForRow,
      getRowClassName,
      isEventApplicable,
      isEventInFilterScope,
      getEventScopeText,
      getEventFeeRateColor,
      formatEventFeeRate,
      sortEventsByScope,
      computeFinalFeeForScope,
      feeScopeForCompute,
      showFinalFee,
      colCount,
      onToggleExpand,
      onUpdateFeeRate,
      onUpdateProductCode,
      onRowClickForEvent,
      onDeleteEvent,
      onSwitchToEventMode,
      tableWrapClassName,
      finalFeeDivider,
      expandCell,
      expandCellCount,
      feeInputStyles,
      productCodeInputStyles,
      feeInputCell,
      thBase,
      eventSubRow,
      eventExpandWrap,
      eventTableWrap,
      eventFeeRateBadgeBase,
      finalFeeResultWrap,
      finalFeeResultRow,
    }),
    [
      currentFees,
      eventsByProduct,
      expandedProducts,
      rightPanelMode,
      getFinalFeeForRow,
      getRowClassName,
      isEventApplicable,
      isEventInFilterScope,
      getEventScopeText,
      getEventFeeRateColor,
      formatEventFeeRate,
      sortEventsByScope,
      computeFinalFeeForScope,
      feeScopeForCompute,
      showFinalFee,
      colCount,
      onToggleExpand,
      onUpdateFeeRate,
      onUpdateProductCode,
      onRowClickForEvent,
      onDeleteEvent,
      onSwitchToEventMode,
    ]
  );

  if (tableCriteria === 'corporation') {
    const corpsToShow = mockCorporations.filter((c) => productsByCorporation.has(c.id));
    return (
      <div css={css({ display: 'flex', flexDirection: 'column', gap: theme.spacing(3) })}>
        {corpsToShow.length === 0 ? (
          <p css={css({ padding: theme.spacing(4), textAlign: 'center', color: theme.colors.textMuted })}>
            법인 이벤트가 있는 항목이 없습니다.
          </p>
        ) : (
        corpsToShow.map((corp) => {
          const scope = getScopeForCorp(corp.id);
          const productCodes = productsByCorporation.get(corp.id)!;
          return (
            <div key={corp.id}>
              <h3 css={corpSectionHeader}>{corp.name}</h3>
              <ProductFeeTableSection
                data={filteredFees.filter((p) => productCodes.has(p.productCode))}
                scopeOverride={scope}
                {...sectionProps}
              />
            </div>
          );
        })
        )}
      </div>
    );
  }

  if (tableCriteria === 'hospital') {
    const hospitalSections: { corp: typeof mockCorporations[0]; hospital: typeof mockHospitals[0]; productCodes: Set<string> }[] = [];
    productsByHospital.forEach((productCodes, key) => {
      const [corpId, hospId] = key.split(':');
      const corp = mockCorporations.find((c) => c.id === corpId);
      const hosp = mockHospitals.find((h) => h.id === hospId);
      if (corp && hosp) hospitalSections.push({ corp, hospital: hosp, productCodes });
    });
    return (
      <div css={css({ display: 'flex', flexDirection: 'column', gap: theme.spacing(3) })}>
        {hospitalSections.length === 0 ? (
          <p css={css({ padding: theme.spacing(4), textAlign: 'center', color: theme.colors.textMuted })}>
            병원 이벤트가 있는 항목이 없습니다.
          </p>
        ) : (
        hospitalSections.map(({ corp, hospital, productCodes }) => {
          const scope: ScopeForCompute = { type: 'corporation_hospital', corporationId: corp.id, hospitalId: hospital.id };
          return (
            <div key={`${corp.id}-${hospital.id}`}>
              <h3 css={corpSectionHeader}>{corp.name} / {hospital.name}</h3>
              <ProductFeeTableSection
                data={filteredFees.filter((p) => productCodes.has(p.productCode))}
                scopeOverride={scope}
                {...sectionProps}
              />
            </div>
          );
        })
        )}
      </div>
    );
  }

  return (
    <ProductFeeTableSection
      data={filteredFees}
      {...sectionProps}
    />
  );
}
