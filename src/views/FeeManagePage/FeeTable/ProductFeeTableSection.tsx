import React, { useMemo } from 'react';
import { clsx } from 'clsx';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { ProductFee, FeeEvent } from '@/types';
import { Button } from '@/components/Common/Button';
import { FeeEventTable } from './FeeEventTable';
import * as s from './ProductFeeTable.css';

type ScopeForCompute =
  | { type: 'item' }
  | { type: 'corporation'; corporationId: string }
  | { type: 'corporation_hospital'; corporationId: string; hospitalId: string };

type ColumnMeta = {
  thStyle?: React.CSSProperties;
  tdStyle?: React.CSSProperties;
};

export interface ProductFeeTableSectionProps {
  data: ProductFee[];
  scopeOverride?: ScopeForCompute;
  currentFees: ProductFee[];
  eventsByProduct: Map<string, FeeEvent[]>;
  expandedProducts: Set<string>;
  rightPanelMode: 'event' | 'product';
  getFinalFeeForRow: (p: ProductFee, scope?: ScopeForCompute) => number;
  getRowClassName?: (p: ProductFee) => string | undefined;
  isEventApplicable: (e: FeeEvent) => boolean;
  isEventInFilterScope: (e: FeeEvent, scope?: ScopeForCompute) => boolean;
  getEventScopeText: (e: FeeEvent) => string;
  getEventFeeRateColor: (e: FeeEvent) => string;
  formatEventFeeRate: (e: FeeEvent) => string;
  sortEventsByScope: (events: FeeEvent[]) => FeeEvent[];
  computeFinalFeeForScope: (
    baseRate: number,
    events: FeeEvent[],
    scope: ScopeForCompute
  ) => number;
  feeScopeForCompute: ScopeForCompute;
  showFinalFee: boolean;
  colCount: number;
  onToggleExpand: (productCode: string) => void;
  onUpdateFeeRate: (productCode: string, feeRate: number) => void;
  onUpdateProductCode: (index: number, newCode: string) => void;
  onRowClickForEvent: (productCode: string, e: React.MouseEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onSwitchToEventMode: (productCode: string) => void;
  tableWrapClassName: string;
  finalFeeDivider: string;
  expandCell: string;
  expandCellCount: string;
  feeInputStyles: string;
  productCodeInputStyles: string;
  feeInputCell: string;
  thBase: string;
  eventSubRow: string;
  eventSubRowCollapsed: string;
  eventExpandWrap: string;
  eventExpandWrapCollapsed: string;
  eventTableWrap: string;
  eventFeeRateBadgeBase: string;
  finalFeeResultWrap: string;
  finalFeeResultRow: string;
}

export function ProductFeeTableSection({
  data,
  scopeOverride,
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
  eventSubRowCollapsed,
  eventExpandWrap,
  eventExpandWrapCollapsed,
  eventTableWrap,
  eventFeeRateBadgeBase,
  finalFeeResultWrap,
  finalFeeResultRow,
}: ProductFeeTableSectionProps) {
  const columnHelper = createColumnHelper<ProductFee>();

  const columns = useMemo<ReturnType<typeof columnHelper.group>['columns']>(() => {
    const base: ReturnType<typeof columnHelper.group>['columns'] = [
      columnHelper.display({
        id: 'expand',
        size: 36,
        meta: { thStyle: { textAlign: 'center', width: 36 }, tdStyle: {} } as ColumnMeta,
        header: () => null,
        cell: ({ row }) => {
          const p = row.original;
          const productEvents = eventsByProduct.get(p.productCode) ?? [];
          const hasEvents = productEvents.length > 0;
          const isExpanded = expandedProducts.has(p.productCode);
          return hasEvents ? (
            <>
              {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
              <span className={expandCellCount}>{productEvents.length}</span>
            </>
          ) : null;
        },
      }),
      columnHelper.accessor('productCode', {
        header: '품목코드',
        size: 220,
        meta: {
          thStyle: { width: 220, minWidth: 220, maxWidth: 220 },
          tdStyle: { padding: 0, verticalAlign: 'middle' },
        } as ColumnMeta,
        cell: ({ row }) => {
          const p = row.original;
          const originalIdx = currentFees.findIndex((x) => x.productCode === p.productCode);
          return (
            <input
              type="text"
              className={productCodeInputStyles}
              value={p.productCode}
              onChange={(e) => onUpdateProductCode(originalIdx, e.target.value)}
              aria-label={`${p.productName} 품목코드`}
            />
          );
        },
      }),
      columnHelper.accessor('productName', { header: '품목명' }),
      columnHelper.accessor('ediCode', {
        header: 'EDI코드',
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('feeRate', {
        header: '기본 수수료 (%)',
        size: 100,
        meta: {
          thStyle: { textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
          tdStyle: { textAlign: 'right', fontVariantNumeric: 'tabular-nums' },
        } as ColumnMeta,
        cell: ({ row }) => (
          <span className={feeInputCell}>
            <input
              className={feeInputStyles}
              type="number"
              min={0}
              max={100}
              step={0.1}
              value={row.original.feeRate}
              onChange={(e) => onUpdateFeeRate(row.original.productCode, Number(e.target.value) || 0)}
              aria-label={`${row.original.productName} 기본 수수료`}
            />
            <span className="fee-suffix">%</span>
          </span>
        ),
      }),
    ];

    if (showFinalFee) {
      base.push(
        columnHelper.display({
          id: 'finalFee',
          header: '최종수수료 (%)',
          size: 100,
          meta: {
            thStyle: { textAlign: 'right', fontVariantNumeric: 'tabular-nums', paddingRight: 8 },
            tdStyle: { textAlign: 'right', fontVariantNumeric: 'tabular-nums', paddingRight: 8 },
          } as ColumnMeta,
          cell: ({ row }) => (
            <span className={feeInputCell}>
              {getFinalFeeForRow(row.original, scopeOverride)}%
            </span>
          ),
        })
      );
    }

    const metaColumnCss: ColumnMeta = {
      thStyle: { textAlign: 'center', fontSize: 12 },
      tdStyle: { textAlign: 'center' },
    };
    base.push(
      columnHelper.accessor('createdAt', {
        header: '등록일',
        size: 130,
        meta: metaColumnCss,
        cell: (info) => (info.getValue() ? String(info.getValue()).slice(0, 10) : '-'),
      }),
      columnHelper.accessor('updatedAt', {
        header: '업데이트',
        size: 130,
        meta: metaColumnCss,
        cell: (info) => (info.getValue() ? String(info.getValue()).slice(0, 10) : '-'),
      }),
      columnHelper.accessor('createdBy', {
        header: '생성자',
        size: 80,
        meta: metaColumnCss,
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('updatedBy', {
        header: '업데이트',
        size: 80,
        meta: { ...metaColumnCss, thStyle: { ...metaColumnCss.thStyle, borderRight: 'none' }, tdStyle: { ...metaColumnCss.tdStyle, borderRight: 'none' } },
        cell: (info) => info.getValue() ?? '-',
      })
    );

    return base;
  }, [
    columnHelper,
    currentFees,
    eventsByProduct,
    expandedProducts,
    showFinalFee,
    scopeOverride,
    getFinalFeeForRow,
    onToggleExpand,
    onUpdateProductCode,
    onUpdateFeeRate,
  ]);

  const table = useReactTable({
    data,
    columns: columns ?? [],
    getRowId: (row) => row.productCode,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
  });

  const leafColumns = table.getAllLeafColumns();

  return (
    <div className={tableWrapClassName}>
      <table>
        <colgroup>
          {leafColumns.map((col) => (
            <col key={col.id} style={{ width: col.getSize() }} />
          ))}
        </colgroup>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => {
                const meta = h.column.columnDef.meta as ColumnMeta | undefined;
                return (
                  <th
                    key={h.id}
                    className={clsx(thBase, h.id === 'finalFee' && finalFeeDivider)}
                    style={meta?.thStyle}
                  >
                    {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            const p = row.original;
            const productEvents = eventsByProduct.get(p.productCode) ?? [];
            const hasEvents = productEvents.length > 0;
            const isExpanded = expandedProducts.has(p.productCode);

            return (
              <React.Fragment key={row.id}>
                <tr
                  className={getRowClassName?.(p)}
                  onClick={(e) => onRowClickForEvent(p.productCode, e)}
                  role={rightPanelMode === 'event' ? 'button' : undefined}
                  style={rightPanelMode === 'event' ? { cursor: 'pointer' } : undefined}
                >
                  {row.getVisibleCells().map((cell) => {
                    if (cell.column.id === 'expand') {
                      return (
                        <td
                          key={cell.id}
                          className={clsx(expandCell, s.cellBorder)}
                          onClick={(e) => {
                            e.stopPropagation();
                            hasEvents && onToggleExpand(p.productCode);
                          }}
                          role={hasEvents ? 'button' : undefined}
                          aria-label={hasEvents ? (isExpanded ? '이벤트 접기' : `이벤트 펼치기 (${productEvents.length}건)`) : undefined}
                        >
                          {hasEvents ? (
                            <>
                              {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                              <span className={expandCellCount}>{productEvents.length}</span>
                            </>
                          ) : null}
                        </td>
                      );
                    }
                    const meta = cell.column.columnDef.meta as ColumnMeta | undefined;
                    const isMeta = ['createdAt', 'updatedAt', 'createdBy', 'updatedBy'].includes(cell.column.id);
                    return (
                      <td
                        key={cell.id}
                        className={clsx(
                          !(cell.column.id === 'productCode') && s.cellBorder,
                          isMeta && s.metaCell
                        )}
                        style={meta?.tdStyle}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    );
                  })}
                </tr>
                {hasEvents && (
                  <tr className={isExpanded ? eventSubRow : eventSubRowCollapsed}>
                    <td colSpan={colCount}>
                      <div className={isExpanded ? eventExpandWrap : eventExpandWrapCollapsed}>
                        {isExpanded && productEvents.length > 0 && (
                          <>
                            <div className={s.eventHeaderRow}>
                              <p style={{ margin: 0, fontSize: 11, color: 'var(--color-text-muted)' }}>
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
                              scopeOverride={scopeOverride}
                              feeScopeForCompute={feeScopeForCompute}
                              baseFeeRate={p.feeRate}
                              showResultRow={isExpanded}
                              isEventApplicable={isEventApplicable}
                              isEventInFilterScope={isEventInFilterScope}
                              getEventScopeText={getEventScopeText}
                              getEventFeeRateColor={getEventFeeRateColor}
                              formatEventFeeRate={formatEventFeeRate}
                              computeFinalFeeForScope={computeFinalFeeForScope}
                              onDeleteEvent={onDeleteEvent}
                              eventTableWrap={eventTableWrap}
                              eventFeeRateBadgeBase={eventFeeRateBadgeBase}
                              finalFeeResultWrap={finalFeeResultWrap}
                              finalFeeResultRow={finalFeeResultRow}
                            />
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
