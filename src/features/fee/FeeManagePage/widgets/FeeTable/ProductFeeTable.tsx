import React, { useCallback, useMemo } from 'react';
import { clsx } from 'clsx';
import { Plus } from 'lucide-react';
import type { Corporation, ProductFee, FeeEvent, Hospital } from '@/types';
import { Button } from '@/shared/components/ui/Button';
import { DataTable } from '@/shared/components/ui/DataTable';
import { FeeEventTable } from './FeeEventTable';
import * as tableStyles from '@/style/TableStyles.css';
import * as s from './ProductFeeTable.css';
import { createProductFeeColumns } from './ProductFeeTable.columns';
import { useFeeEventHelpers } from '../../hooks/useFeeEventHelpers';

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
  corporations: Corporation[];
  hospitals: Hospital[];
  onToggleExpand: (productCode: string) => void;
  onUpdateFeeRate: (productCode: string, feeRate: number) => void;
  onRowClickForEvent: (productCode: string, e: React.MouseEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onSwitchToEventMode: (productCode: string) => void;
  onEditEvent?: (event: FeeEvent) => void;
  editingEventId?: string | null;
}

const tableWrapClassName = clsx(tableStyles.tableWrapPlain, s.feeTableWrapOverrides);

export function ProductFeeTable({
  filteredFees,
  currentFees,
  eventsByProduct,
  expandedProducts,
  rightPanelMode,
  eventProductCode,
  isRowModified,
  feeScope,
  corporations,
  hospitals,
  onToggleExpand,
  onUpdateFeeRate,
  onRowClickForEvent,
  onDeleteEvent,
  onSwitchToEventMode,
  onEditEvent,
  editingEventId,
}: ProductFeeTableProps) {
  const showFinalFee = true;

  const eventHelpers = useFeeEventHelpers({ feeScope, corporations, hospitals });
  const {
    isEventApplicable,
    isEventInFilterScope,
    getEventScopeText,
    getEventFeeRateColor,
    formatEventFeeRate,
    sortEventsByScope,
    computeFinalFeeForScope,
    feeScopeForCompute,
  } = eventHelpers;

  const feeEventConfig = useMemo(
    () => ({
      isEventApplicable,
      isEventInFilterScope,
      getEventScopeText,
      getEventFeeRateColor,
      formatEventFeeRate,
      computeFinalFeeForScope,
    }),
    [
      isEventApplicable,
      isEventInFilterScope,
      getEventScopeText,
      getEventFeeRateColor,
      formatEventFeeRate,
      computeFinalFeeForScope,
    ],
  );

  const getFinalFeeForRow = useCallback(
    (p: ProductFee, scopeOverride?: typeof feeScopeForCompute): number => {
      const scope = scopeOverride ?? feeScopeForCompute;
      if (!scope) return p.feeRate;
      const productEvents = eventsByProduct.get(p.productCode) ?? [];
      return computeFinalFeeForScope(p.feeRate, productEvents, scope);
    },
    [feeScopeForCompute, eventsByProduct, computeFinalFeeForScope],
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
    [currentFees, isRowModified, rightPanelMode, eventProductCode],
  );

  const columns = useMemo(
    () =>
      createProductFeeColumns({
        eventsByProduct,
        expandedProducts,
        showFinalFee,
        scopeOverride: undefined,
        getFinalFeeForRow,
        onUpdateFeeRate,
      }),
    [eventsByProduct, expandedProducts, showFinalFee, getFinalFeeForRow, onUpdateFeeRate],
  );

  const getTdProps = useMemo(
    () => (cell: { column: { id: string } }) => {
      if (cell.column.id === 'expand') {
        return { className: clsx(s.expandCell, s.cellBorder) };
      }
      const isMeta = ['createdAt', 'updatedAt', 'createdBy', 'updatedBy'].includes(cell.column.id);
      return {
        className: clsx(s.cellBorder, isMeta && s.metaCell),
      };
    },
    [],
  );

  const getTdPropsWithClick = useMemo(
    () => (cell: { column: { id: string } }, row: { original: ProductFee }) => {
      const p = row.original;
      const productEvents = eventsByProduct.get(p.productCode) ?? [];
      const hasEvents = productEvents.length > 0;
      const isExpanded = expandedProducts.has(p.productCode);

      const base = getTdProps(cell);

      if (cell.column.id === 'expand') {
        return {
          ...base,
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            hasEvents && onToggleExpand(p.productCode);
          },
          role: hasEvents ? ('button' as const) : undefined,
          'aria-label': hasEvents
            ? isExpanded
              ? '이벤트 접기'
              : `이벤트 펼치기 (${productEvents.length}건)`
            : undefined,
        };
      }

      return base;
    },
    [getTdProps, eventsByProduct, expandedProducts, onToggleExpand],
  );

  const renderExpandedRow = useMemo(
    () => (p: ProductFee) => {
      const productEvents = eventsByProduct.get(p.productCode) ?? [];
      const hasEvents = productEvents.length > 0;
      const isExpanded = expandedProducts.has(p.productCode);

      if (!hasEvents || !isExpanded) return null;

      return (
        <div className={s.eventExpandWrap}>
          {productEvents.length > 0 && (
            <>
              <div className={s.eventHeaderRow}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 11,
                    color: 'var(--color-text-muted)',
                  }}
                >
                  아래로 갈수록 우선순위 높음. 가장 아래(최우선)가 고정이면 해당 고정수수료 적용.
                </p>
                <Button
                  variant="ghost"
                  size="small"
                  onClick={() => onSwitchToEventMode(p.productCode)}
                  className={s.eventAddBtn}
                  aria-label="이벤트 추가"
                >
                  <Plus size={18} />
                </Button>
              </div>
              <FeeEventTable
                events={sortEventsByScope(productEvents)}
                scopeOverride={undefined}
                feeScopeForCompute={feeScopeForCompute}
                baseFeeRate={p.feeRate}
                showResultRow={isExpanded}
                eventConfig={feeEventConfig}
                onDeleteEvent={onDeleteEvent}
                onEditEvent={onEditEvent}
                editingEventId={editingEventId}
              />
            </>
          )}
        </div>
      );
    },
    [
      eventsByProduct,
      expandedProducts,
      feeScopeForCompute,
      sortEventsByScope,
      isEventApplicable,
      isEventInFilterScope,
      getEventScopeText,
      getEventFeeRateColor,
      formatEventFeeRate,
      computeFinalFeeForScope,
      onDeleteEvent,
      onSwitchToEventMode,
      onEditEvent,
      editingEventId,
    ],
  );

  return (
    <div className={tableWrapClassName}>
      <DataTable<ProductFee>
        columns={columns}
        data={filteredFees}
        getRowId={(row) => row.productCode}
        variant="plain"
        thClassName={s.thBase}
        getRowClassName={getRowClassName}
        onRowClick={
          rightPanelMode === 'event'
            ? (p, e) => e && onRowClickForEvent(p.productCode, e)
            : undefined
        }
        getTdProps={getTdPropsWithClick}
        renderExpandedRow={renderExpandedRow}
        expandedRowClassName={s.eventSubRow}
      />
    </div>
  );
}
