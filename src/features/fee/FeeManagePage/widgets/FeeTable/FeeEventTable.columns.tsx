import { createColumnHelper } from '@tanstack/react-table';
import type { FeeEvent } from '@/types';
import { theme } from '@/theme';
import { Button } from '@/shared/components/ui/Button';
import * as s from './ProductFeeTable.css';
import type { ScopeForCompute } from '../../feeTypes';

export type { ScopeForCompute } from '../../feeTypes';

export type FeeEventColumnsDeps = {
  scopeOverride?: ScopeForCompute;
  isEventApplicable: (e: FeeEvent) => boolean;
  isEventInFilterScope: (e: FeeEvent, scope?: ScopeForCompute) => boolean;
  getEventScopeText: (e: FeeEvent) => string;
  getEventFeeRateColor: (e: FeeEvent) => string;
  formatEventFeeRate: (e: FeeEvent) => string;
  onDeleteEvent: (eventId: string) => void;
  editingEventId?: string | null;
};

const columnHelper = createColumnHelper<FeeEvent>();

export function createFeeEventColumns(deps: FeeEventColumnsDeps) {
  const {
    scopeOverride,
    isEventApplicable,
    isEventInFilterScope,
    getEventScopeText,
    getEventFeeRateColor,
    formatEventFeeRate,
    onDeleteEvent,
    editingEventId,
  } = deps;

  return [
    columnHelper.display({
      id: 'delete',
      size: 52,
      header: () => null,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteEvent(row.original.id);
          }}
        >
          삭제
        </Button>
      ),
    }),
    columnHelper.accessor('name', {
      header: '제목',
      cell: ({ row }) => {
        const e = row.original;
        const applicable = isEventApplicable(e);
        const isEditing = editingEventId != null && e.id === editingEventId;
        return (
          <div className={s.filterRowInner}>
            <strong style={isEditing ? { textDecoration: 'underline' } : undefined}>
              {e.name}
            </strong>
            <span
              style={{
                fontSize: 11,
                color: applicable ? theme.colors.success : theme.colors.textMuted,
              }}
            >
              {applicable ? '적용 가능' : '적용 불가'}
            </span>
          </div>
        );
      },
    }),
    columnHelper.display({
      id: 'scope',
      header: '적용범위',
      cell: ({ row }) => getEventScopeText(row.original),
    }),
    columnHelper.accessor('note', {
      header: '비고',
      cell: (info) => (
        <span style={{ color: theme.colors.textMuted }}>{info.getValue() ?? '-'}</span>
      ),
    }),
    columnHelper.display({
      id: 'feeRate',
      size: 100,
      header: '수수료',
      cell: ({ row }) => {
        const e = row.original;
        const applicable = isEventApplicable(e);
        const inScope = isEventInFilterScope(e, scopeOverride);
        return (
          <span
            className={s.eventFeeRateBadgeBase}
            style={{
              color: applicable ? getEventFeeRateColor(e) : theme.colors.textMuted,
              opacity: applicable ? (inScope ? 1 : 0.5) : 0.6,
            }}
          >
            {formatEventFeeRate(e)}
          </span>
        );
      },
    }),
    columnHelper.accessor('startDate', { header: '시작날짜', size: 110 }),
    columnHelper.accessor('endDate', { header: '끝 날짜', size: 110 }),
    columnHelper.accessor('createdBy', {
      header: '생성자',
      size: 80,
      cell: (info) => info.getValue() ?? '-',
    }),
    columnHelper.accessor('updatedBy', {
      header: '업데이트',
      size: 80,
      cell: (info) => info.getValue() ?? '-',
    }),
  ];
}
