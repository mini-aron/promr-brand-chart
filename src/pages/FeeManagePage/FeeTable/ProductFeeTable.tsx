/** @jsxImportSource @emotion/react */
import React, { useCallback, useMemo } from 'react';
import { css } from '@emotion/react';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { mockCorporations, mockHospitals } from '@/store/mockData';
import type { ProductFee, FeeEvent } from '@/types';
import { theme } from '@/theme';
import { Button } from '@/components/Common/Button';
import { tableRowModified, tableWrapPlain } from '@/style/TableStyles';

const feeTableWrap = css([
  tableWrapPlain,
  css({
    overflow: 'visible',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.radius.md,
    '& table': { minWidth: 400 },
    '& th, & td': { padding: theme.spacing(0.75), fontSize: 13 },
    '& th:nth-of-type(2), & td:nth-of-type(2)': { width: 220, minWidth: 220, maxWidth: 220 },
    '& td:nth-of-type(2)': { padding: 0, verticalAlign: 'middle' },
    '& th:nth-of-type(5), & td:nth-of-type(5)': {
      textAlign: 'right',
      fontVariantNumeric: 'tabular-nums',
    },
    '& th:nth-of-type(6), & td:nth-of-type(6)': {
      textAlign: 'right',
      fontVariantNumeric: 'tabular-nums',
      paddingRight: theme.spacing(2),
    },
  }),
]);

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
  borderCollapse: 'collapse',
  fontSize: 12,
  '& th, & td': {
    padding: theme.spacing(1),
    paddingLeft: theme.spacing(1.5),
    textAlign: 'left',
    borderBottom: `1px solid ${theme.colors.border}`,
    verticalAlign: 'middle',
  },
  '& th:nth-of-type(2), & td:nth-of-type(2), & th:nth-of-type(4), & td:nth-of-type(4), & th:nth-of-type(5), & td:nth-of-type(5)': {
    textAlign: 'center',
  },
  '& th:last-child, & td:last-child': { textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
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
  padding: theme.spacing(1.5),
  paddingRight: theme.spacing(2),
  marginTop: theme.spacing(1),
  borderTop: `1px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.surface,
  fontSize: 13,
  '& .final-fee-header': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.spacing(2),
    marginBottom: theme.spacing(1),
    flexWrap: 'wrap',
  },
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

  const getRowCss = useCallback(
    (p: ProductFee) => {
      const idx = currentFees.findIndex((x) => x.productCode === p.productCode);
      const modified = isRowModified(idx);
      const selectedForEvent = rightPanelMode === 'event' && eventProductCode === p.productCode;
      const selectedStyles = css({
        outline: `2px solid ${theme.colors.primary}`,
        boxShadow: `0 0 12px 2px ${theme.colors.primary}30`,
      });
      if (modified && selectedForEvent) return css([tableRowModified, selectedStyles]);
      if (modified) return tableRowModified;
      if (selectedForEvent) return selectedStyles;
      return undefined;
    },
    [currentFees, isRowModified, rightPanelMode, eventProductCode]
  );

  const colCount = showFinalFee ? 6 : 5;

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

  const renderTableBody = useCallback(
    (scopeOverride?: ScopeForCompute, productCodesToShow?: Set<string>) => {
      const feesToRender = productCodesToShow
        ? filteredFees.filter((p) => productCodesToShow.has(p.productCode))
        : filteredFees;
      return feesToRender.map((p) => {
        const originalIdx = currentFees.findIndex((x) => x.productCode === p.productCode);
        const productEvents = eventsByProduct.get(p.productCode) ?? [];
        const hasEvents = productEvents.length > 0;
        const isExpanded = expandedProducts.has(p.productCode);
        return (
          <React.Fragment key={p.productCode}>
            <tr
              css={getRowCss(p)}
              onClick={(e) => onRowClickForEvent(p.productCode, e)}
              role={rightPanelMode === 'event' ? 'button' : undefined}
              style={rightPanelMode === 'event' ? { cursor: 'pointer' } : undefined}
            >
              <td
                css={[expandCell, { borderBottom: `1px solid ${theme.colors.border}`, borderRight: `1px solid ${theme.colors.border}` }]}
                onClick={() => hasEvents && onToggleExpand(p.productCode)}
                role={hasEvents ? 'button' : undefined}
                aria-label={hasEvents ? (isExpanded ? '이벤트 접기' : `이벤트 펼치기 (${productEvents.length}건)`) : undefined}
              >
                {hasEvents ? (
                  <>
                    {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                    <span css={expandCellCount}>{productEvents.length}</span>
                  </>
                ) : null}
              </td>
              <td css={{ padding: 0, verticalAlign: 'middle', borderBottom: `1px solid ${theme.colors.border}`, borderRight: `1px solid ${theme.colors.border}` }}>
                <input
                  type="text"
                  css={productCodeInputStyles}
                  value={p.productCode}
                  onChange={(e) => onUpdateProductCode(originalIdx, e.target.value)}
                  aria-label={`${p.productName} 품목코드`}
                />
              </td>
              <td css={{ padding: theme.spacing(0.75), borderBottom: `1px solid ${theme.colors.border}`, borderRight: `1px solid ${theme.colors.border}` }}>
                {p.productName}
              </td>
              <td css={{ padding: theme.spacing(0.75), borderBottom: `1px solid ${theme.colors.border}`, borderRight: `1px solid ${theme.colors.border}` }}>
                {p.ediCode ?? '-'}
              </td>
              <td css={{ padding: theme.spacing(0.75), borderBottom: `1px solid ${theme.colors.border}`, borderRight: `1px solid ${theme.colors.border}` }}>
                <span css={feeInputCell}>
                  <input
                    css={feeInputStyles}
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={p.feeRate}
                    onChange={(e) => onUpdateFeeRate(p.productCode, Number(e.target.value) || 0)}
                    aria-label={`${p.productName} 기본 수수료`}
                  />
                  <span className="fee-suffix">%</span>
                </span>
              </td>
              {showFinalFee && (
                <td css={{ padding: theme.spacing(0.75), borderBottom: `1px solid ${theme.colors.border}` }}>
                  <span css={feeInputCell}>
                    {getFinalFeeForRow(p, scopeOverride)}%
                  </span>
                </td>
              )}
            </tr>
            {hasEvents && (
              <tr css={eventSubRow(isExpanded)}>
                <td colSpan={colCount}>
                  <div css={eventExpandWrap(isExpanded)}>
                    {isExpanded && productEvents.length > 0 && (
                      <>
                        <div
                          css={css({
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: theme.spacing(1),
                            paddingLeft: theme.spacing(1.5),
                            paddingRight: theme.spacing(1.5),
                          })}
                        >
                          <p css={{ margin: 0, fontSize: 11, color: theme.colors.textMuted }}>
                            아래로 갈수록 우선순위 높음. 가장 아래(최우선)가 고정이면 해당 고정수수료 적용.
                          </p>
                          <Button
                            variant="ghost"
                            size="small"
                            onClick={() => onSwitchToEventMode(p.productCode)}
                            css={css({
                              padding: theme.spacing(0.5),
                              minHeight: 0,
                              backgroundColor: theme.colors.border,
                              borderRadius: theme.radius.sm,
                              '&:hover': { backgroundColor: `${theme.colors.primary}30` },
                            })}
                            aria-label="이벤트 추가"
                          >
                            <Plus size={18} />
                          </Button>
                        </div>
                        <table css={eventTableWrap}>
                          <thead>
                            <tr>
                              <th>제목</th>
                              <th>적용범위</th>
                              <th>비고</th>
                              <th>시작날짜</th>
                              <th>끝 날짜</th>
                              <th>수수료</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sortEventsByScope(productEvents).map((e) => {
                              const applicable = isEventApplicable(e);
                              const inScope = isEventInFilterScope(e, scopeOverride);
                              return (
                              <tr
                                key={e.id}
                                css={!applicable ? { opacity: 0.5 } : undefined}
                              >
                                <td>
                                  <div css={css({ display: 'flex', alignItems: 'center', gap: theme.spacing(1), flexWrap: 'wrap' })}>
                                    <Button variant="ghost" size="small" onClick={() => onDeleteEvent(e.id)}>
                                      삭제
                                    </Button>
                                    <strong>{e.name}</strong>
                                    <span css={{ fontSize: 11, color: applicable ? theme.colors.success : theme.colors.textMuted }}>
                                      {applicable ? '적용 가능' : '적용 불가'}
                                    </span>
                                  </div>
                                </td>
                                <td>{getEventScopeText(e)}</td>
                                <td css={{ color: theme.colors.textMuted }}>{e.note ?? '-'}</td>
                                <td>{e.startDate}</td>
                                <td>{e.endDate}</td>
                                <td css={!inScope ? { opacity: 0.5 } : undefined}>
                                  <span
                                    css={[
                                      eventFeeRateBadgeBase,
                                      {
                                        color: applicable ? getEventFeeRateColor(e) : theme.colors.textMuted,
                                        opacity: applicable ? 1 : 0.6,
                                      },
                                    ]}
                                  >
                                    {formatEventFeeRate(e)}
                                  </span>
                                </td>
                              </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </>
                    )}
                    {isExpanded && (
                      <div css={finalFeeResultWrap}>
                        <div className="final-fee-header">
                          <span className="final-fee-title">위 이벤트 수수료 적용 결과</span>
                          <span className="final-fee-rate" css={[eventFeeRateBadgeBase, { color: theme.colors.text }]}>
                            {computeFinalFeeForScope(p.feeRate, productEvents, scopeOverride ?? feeScopeForCompute ?? { type: 'item' })}%
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        );
      });
    },
    [
      filteredFees,
      currentFees,
      eventsByProduct,
      expandedProducts,
      getRowCss,
      getFinalFeeForRow,
      isEventInFilterScope,
      sortEventsByScope,
      isEventApplicable,
      getEventScopeText,
      getEventFeeRateColor,
      formatEventFeeRate,
      computeFinalFeeForScope,
      feeScopeForCompute,
      colCount,
      eventSubRow,
      eventExpandWrap,
      eventTableWrap,
      finalFeeResultWrap,
      onToggleExpand,
      onUpdateProductCode,
      onUpdateFeeRate,
      onRowClickForEvent,
      onDeleteEvent,
      onSwitchToEventMode,
      rightPanelMode,
      eventProductCode,
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
              <div css={feeTableWrap}>
                <table>
                  <colgroup>
                    <col style={{ width: 36, minWidth: 36 }} />
                    <col style={{ width: 220, minWidth: 220 }} />
                    <col />
                    <col />
                    <col style={{ width: 100 }} />
                    {showFinalFee && <col style={{ width: 100 }} />}
                  </colgroup>
                  <thead>
                    <tr>
                      <th css={[thBase, { textAlign: 'center', width: 36 }]} />
                      <th css={[thBase, { textAlign: 'left' }]}>품목코드</th>
                      <th css={[thBase, { textAlign: 'left' }]}>품목명</th>
                      <th css={[thBase, { textAlign: 'left' }]}>EDI코드</th>
                      <th css={[thBase, { textAlign: 'right' }, showFinalFee ? {} : { borderRight: 'none' }]}>기본 수수료 (%)</th>
                      {showFinalFee && <th css={[thBase, { textAlign: 'right', borderRight: 'none' }]}>최종수수료 (%)</th>}
                    </tr>
                  </thead>
                  <tbody>{renderTableBody(scope, productCodes)}</tbody>
                </table>
              </div>
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
              <div css={feeTableWrap}>
                <table>
                  <colgroup>
                    <col style={{ width: 36, minWidth: 36 }} />
                    <col style={{ width: 220, minWidth: 220 }} />
                    <col />
                    <col />
                    <col style={{ width: 100 }} />
                    {showFinalFee && <col style={{ width: 100 }} />}
                  </colgroup>
                  <thead>
                    <tr>
                      <th css={[thBase, { textAlign: 'center', width: 36 }]} />
                      <th css={[thBase, { textAlign: 'left' }]}>품목코드</th>
                      <th css={[thBase, { textAlign: 'left' }]}>품목명</th>
                      <th css={[thBase, { textAlign: 'left' }]}>EDI코드</th>
                      <th css={[thBase, { textAlign: 'right' }, showFinalFee ? {} : { borderRight: 'none' }]}>기본 수수료 (%)</th>
                      {showFinalFee && <th css={[thBase, { textAlign: 'right', borderRight: 'none' }]}>최종수수료 (%)</th>}
                    </tr>
                  </thead>
                  <tbody>{renderTableBody(scope, productCodes)}</tbody>
                </table>
              </div>
            </div>
          );
        })
        )}
      </div>
    );
  }

  return (
    <div css={feeTableWrap}>
      <table>
        <colgroup>
          <col style={{ width: 36, minWidth: 36 }} />
          <col style={{ width: 220, minWidth: 220 }} />
          <col />
          <col />
          <col style={{ width: 100 }} />
          {showFinalFee && <col style={{ width: 100 }} />}
        </colgroup>
        <thead>
          <tr>
            <th css={[thBase, { textAlign: 'center', width: 36 }]} />
            <th css={[thBase, { textAlign: 'left' }]}>품목코드</th>
            <th css={[thBase, { textAlign: 'left' }]}>품목명</th>
            <th css={[thBase, { textAlign: 'left' }]}>EDI코드</th>
            <th css={[thBase, { textAlign: 'right' }, showFinalFee ? {} : { borderRight: 'none' }]}>기본 수수료 (%)</th>
            {showFinalFee && <th css={[thBase, { textAlign: 'right', borderRight: 'none' }]}>최종수수료 (%)</th>}
          </tr>
        </thead>
        <tbody>{renderTableBody()}</tbody>
      </table>
    </div>
  );
}
