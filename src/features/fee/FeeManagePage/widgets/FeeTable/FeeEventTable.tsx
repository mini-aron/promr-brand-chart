import { useMemo } from 'react';
import { clsx } from 'clsx';
import type { FeeEvent } from '@/types';
import { theme } from '@/theme';
import { DataTable } from '@/shared/components/ui/DataTable';
import * as s from './ProductFeeTable.css';
import { createFeeEventColumns } from './FeeEventTable.columns';
import type { ScopeForCompute } from '../../feeTypes';

export type { ScopeForCompute } from '../../feeTypes';

export type FeeEventConfig = {
  isEventApplicable: (e: FeeEvent) => boolean;
  isEventInFilterScope: (e: FeeEvent, scope?: ScopeForCompute) => boolean;
  getEventScopeText: (e: FeeEvent) => string;
  getEventFeeRateColor: (e: FeeEvent) => string;
  formatEventFeeRate: (e: FeeEvent) => string;
  computeFinalFeeForScope: (baseRate: number, events: FeeEvent[], scope: ScopeForCompute) => number;
};

export interface FeeEventTableProps {
  events: FeeEvent[];
  scopeOverride?: ScopeForCompute;
  feeScopeForCompute: ScopeForCompute;
  baseFeeRate: number;
  showResultRow: boolean;
  eventConfig: FeeEventConfig;
  onDeleteEvent: (eventId: string) => void;
  /** 이벤트 행 클릭 시 우측 폼으로 불러와 수정 */
  onEditEvent?: (event: FeeEvent) => void;
  editingEventId?: string | null;
}

export function FeeEventTable({
  events,
  scopeOverride,
  feeScopeForCompute,
  baseFeeRate,
  showResultRow,
  eventConfig,
  onDeleteEvent,
  onEditEvent,
  editingEventId,
}: FeeEventTableProps) {
  const {
    isEventApplicable,
    isEventInFilterScope,
    getEventScopeText,
    getEventFeeRateColor,
    formatEventFeeRate,
    computeFinalFeeForScope,
  } = eventConfig;

  const columns = useMemo(
    () =>
      createFeeEventColumns({
        scopeOverride,
        isEventApplicable,
        isEventInFilterScope,
        getEventScopeText,
        getEventFeeRateColor,
        formatEventFeeRate,
        onDeleteEvent,
        editingEventId,
      }),
    [
      scopeOverride,
      isEventApplicable,
      isEventInFilterScope,
      getEventScopeText,
      getEventFeeRateColor,
      formatEventFeeRate,
      onDeleteEvent,
      editingEventId,
    ],
  );

  const scope = scopeOverride ?? feeScopeForCompute ?? { type: 'item' as const };

  const getRowClassName = useMemo(
    () => (row: FeeEvent) => (!isEventApplicable(row) ? s.eventRowInapplicable : undefined),
    [isEventApplicable],
  );

  const getTdProps = useMemo(
    () => (cell: { column: { id: string } }) => {
      const isMeta = ['createdBy', 'updatedBy'].includes(cell.column.id);
      const isLast = cell.column.id === 'updatedBy';
      return {
        className: clsx(
          cell.column.id === 'delete' && s.feeEventDeleteTd,
          cell.column.id !== 'delete' && s.cellBorder,
          isMeta && s.metaCellCenter,
          isLast && s.cellBorderLast,
        ),
      };
    },
    [],
  );

  const renderFooter = useMemo(
    () =>
      showResultRow
        ? () => (
            <tr className={s.finalFeeResultRow}>
              <td />
              <td
                style={{
                  padding: theme.spacing(0.5),
                  paddingLeft: theme.spacing(1.5),
                  verticalAlign: 'middle',
                }}
              >
                <span className="final-fee-title">위 이벤트 수수료 적용 결과</span>
              </td>
              <td />
              <td />
              <td
                style={{
                  padding: theme.spacing(0.5),
                  paddingRight: theme.spacing(2),
                  verticalAlign: 'middle',
                  textAlign: 'right',
                }}
              >
                <span
                  className={clsx('final-fee-rate', s.eventFeeRateBadgeBase)}
                  style={{ color: theme.colors.text }}
                >
                  {computeFinalFeeForScope(baseFeeRate, events, scope)}%
                </span>
              </td>
              <td />
              <td />
              <td />
              <td />
            </tr>
          )
        : undefined,
    [showResultRow, baseFeeRate, events, scope, computeFinalFeeForScope],
  );

  return (
    <DataTable<FeeEvent>
      columns={columns}
      data={events}
      getRowId={(row) => row.id}
      variant="plain"
      tableClassName={s.eventTableWrap}
      tfootClassName={showResultRow ? s.finalFeeResultWrap : undefined}
      getRowClassName={getRowClassName}
      getTdProps={getTdProps}
      renderFooter={renderFooter}
      onRowClick={
        onEditEvent
          ? (row, e) => {
              if ((e?.target as HTMLElement)?.closest('button')) return;
              onEditEvent(row);
            }
          : undefined
      }
    />
  );
}
