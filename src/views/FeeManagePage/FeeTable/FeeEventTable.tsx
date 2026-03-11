/** @jsxImportSource @emotion/react */
import { useMemo } from 'react';
import { css } from '@emotion/react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import type { FeeEvent } from '@/types';
import { theme } from '@/theme';
import { Button } from '@/components/Common/Button';

export type ScopeForCompute =
  | { type: 'item' }
  | { type: 'corporation'; corporationId: string }
  | { type: 'corporation_hospital'; corporationId: string; hospitalId: string };

export interface FeeEventTableProps {
  events: FeeEvent[];
  scopeOverride?: ScopeForCompute;
  feeScopeForCompute: ScopeForCompute;
  baseFeeRate: number;
  showResultRow: boolean;
  isEventApplicable: (e: FeeEvent) => boolean;
  isEventInFilterScope: (e: FeeEvent, scope?: ScopeForCompute) => boolean;
  getEventScopeText: (e: FeeEvent) => string;
  getEventFeeRateColor: (e: FeeEvent) => string;
  formatEventFeeRate: (e: FeeEvent) => string;
  computeFinalFeeForScope: (
    baseRate: number,
    events: FeeEvent[],
    scope: ScopeForCompute
  ) => number;
  onDeleteEvent: (eventId: string) => void;
  eventTableWrap: ReturnType<typeof css>;
  eventFeeRateBadgeBase: ReturnType<typeof css>;
  finalFeeResultWrap: ReturnType<typeof css>;
  finalFeeResultRow: ReturnType<typeof css>;
}

const cellBorder = css({
  padding: theme.spacing(0.75),
  borderBottom: `1px solid ${theme.colors.border}`,
  borderRight: `1px solid ${theme.colors.border}`,
});

const metaCell = css([
  cellBorder,
  { fontSize: 12, color: theme.colors.textMuted, textAlign: 'center' },
]);

export function FeeEventTable({
  events,
  scopeOverride,
  feeScopeForCompute,
  baseFeeRate,
  showResultRow,
  isEventApplicable,
  isEventInFilterScope,
  getEventScopeText,
  getEventFeeRateColor,
  formatEventFeeRate,
  computeFinalFeeForScope,
  onDeleteEvent,
  eventTableWrap,
  eventFeeRateBadgeBase,
  finalFeeResultWrap,
  finalFeeResultRow,
}: FeeEventTableProps) {
  const columnHelper = createColumnHelper<FeeEvent>();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: 'delete',
        size: 52,
        header: () => null,
        cell: ({ row }) => (
          <Button variant="ghost" size="small" onClick={() => onDeleteEvent(row.original.id)}>
            삭제
          </Button>
        ),
      }),
      columnHelper.accessor('name', {
        header: '제목',
        cell: ({ row }) => {
          const e = row.original;
          const applicable = isEventApplicable(e);
          return (
            <div css={css({ display: 'flex', alignItems: 'center', gap: theme.spacing(1), flexWrap: 'wrap' })}>
              <strong>{e.name}</strong>
              <span style={{ fontSize: 11, color: applicable ? theme.colors.success : theme.colors.textMuted }}>
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
              css={[
                eventFeeRateBadgeBase,
                css({
                  color: applicable ? getEventFeeRateColor(e) : theme.colors.textMuted,
                  opacity: applicable ? 1 : 0.6,
                }),
              ]}
              style={!inScope ? { opacity: 0.5 } : undefined}
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
    ],
    [
      columnHelper,
      isEventApplicable,
      isEventInFilterScope,
      getEventScopeText,
      getEventFeeRateColor,
      formatEventFeeRate,
      onDeleteEvent,
      eventFeeRateBadgeBase,
      scopeOverride,
    ]
  );

  const table = useReactTable({
    data: events,
    columns,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
  });

  const leafColumns = table.getAllLeafColumns();
  const scope = scopeOverride ?? feeScopeForCompute ?? { type: 'item' as const };

  return (
    <table css={eventTableWrap}>
      <colgroup>
        {leafColumns.map((col) => (
          <col key={col.id} style={{ width: col.getSize() }} />
        ))}
      </colgroup>
      <thead>
        {table.getHeaderGroups().map((hg) => (
          <tr key={hg.id}>
            {hg.headers.map((h) => (
              <th
                key={h.id}
                css={[
                  cellBorder,
                  css({ fontWeight: 600, fontSize: 11 }),
                  h.id === 'delete' && css({ width: 52, minWidth: 52 }),
                  ['생성자', '업데이트'].includes(String(h.column.columnDef.header)) && css({
                    textAlign: 'center' as const,
                  }),
                ]}
              >
                {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map((row) => {
          const e = row.original;
          const applicable = isEventApplicable(e);
          return (
            <tr key={row.id} style={!applicable ? { opacity: 0.5 } : undefined}>
              {row.getVisibleCells().map((cell) => {
                const isMeta = ['createdBy', 'updatedBy'].includes(cell.column.id);
                const isLast = cell.column.id === 'updatedBy';
                return (
                  <td
                    key={cell.id}
                    css={[
                      cell.column.id === 'delete' && css({ padding: theme.spacing(0.5), width: 52 }),
                      cell.column.id !== 'delete' && cellBorder,
                      isMeta && metaCell,
                      isLast && css({ borderRight: 'none' }),
                    ]}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
      {showResultRow && (
        <tbody css={finalFeeResultWrap}>
          <tr css={finalFeeResultRow}>
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
            <td style={{ padding: theme.spacing(0.5), paddingRight: theme.spacing(2), verticalAlign: 'middle', textAlign: 'right' }}>
              <span className="final-fee-rate" css={[eventFeeRateBadgeBase, css({ color: theme.colors.text })]}>
                {computeFinalFeeForScope(baseFeeRate, events, scope)}%
              </span>
            </td>
            <td />
            <td />
            <td />
            <td />
          </tr>
        </tbody>
      )}
    </table>
  );
}
