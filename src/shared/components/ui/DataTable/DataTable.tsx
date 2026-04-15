/**
 * DataTable - TanStack Table 기반 공통 테이블 컴포넌트
 *
 * ## 기본 사용 (단순 목록)
 * columns, data, getRowId만 있으면 동작. 정렬은 columnDef에 enableSorting: true 추가 시 활성화.
 *
 * @example
 * <DataTable<User>
 *   columns={columns}
 *   data={users}
 *   getRowId={(row) => row.id}
 *   emptyMessage="데이터가 없습니다."
 * />
 *
 * ## 선택적 props 가이드
 *
 * - variant: 'default' | 'plain' | 'compact' | 'sticky' - 테이블 스타일. plain은 카드 내부용.
 * - onRowClick: 행 클릭 시 콜백. (row, e?) 시그니처.
 * - getRowClassName: 선택/수정 행 강조 등. (row) => string | undefined
 * - emptyMessage: 데이터 없을 때 표시할 노드
 *
 * ## 셀/헤더 커스텀 (고급)
 *
 * - getTdProps: 셀별 onClick, className, style 등. cell 클릭이 있으면 onRowClick 무시.
 * - thClassName: 모든 th에 공통 className
 * - tableClassName: table 요소에 직접 className (eventTableWrap 등)
 * - column meta: { className?, thStyle?, tdStyle? } - 컬럼별 스타일
 *
 * ## 확장 행 / 푸터
 *
 * - renderExpandedRow: (row) => ReactNode - 행 아래 확장 영역. null 반환 시 미표시.
 * - expandedRowClassName: 확장 행 tr의 className
 * - renderFooter: () => <tr>...</tr> - tfoot 내용
 * - tfootClassName: tfoot 요소 className
 */
import React, { useMemo, useState } from 'react';
import {
  type Cell,
  type ColumnDef,
  type Row,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { clsx } from 'clsx';
import * as tableStyles from '@/style/TableStyles.css';
import * as s from './DataTable.css';

type TableVariant = 'default' | 'plain' | 'compact' | 'sticky';

const variantMap = {
  default: tableStyles.tableWrap,
  plain: tableStyles.tableWrapPlain,
  compact: tableStyles.tableWrapCompact,
  sticky: tableStyles.tableWrapSticky,
} as const;

export interface DataTableProps<T> {
  /** 필수. TanStack createColumnHelper로 정의 */
  columns: ColumnDef<T, any>[];
  /** 필수 */
  data: T[];
  /** 필수. 행 고유 ID */
  getRowId: (row: T) => string;
  /** default | plain | compact | sticky */
  variant?: TableVariant;
  /** 래퍼 div에 적용 */
  className?: string;
  /** table 요소에 직접 적용 (eventTableWrap 등) */
  tableClassName?: string;
  /** tfoot에 적용 */
  tfootClassName?: string;
  /** 모든 th에 공통 적용 */
  thClassName?: string;
  /** 선택/수정 행 강조용 */
  getRowClassName?: (row: T) => string | undefined;
  /** 셀별 onClick, className, style. cell 클릭 시 onRowClick 무시 */
  getTdProps?: (
    cell: Cell<T, unknown>,
    row: Row<T>,
  ) => Partial<React.TdHTMLAttributes<HTMLTableCellElement>>;
  /** 행 클릭. getTdProps 사용 시 tr에는 미적용, td별로 처리 */
  onRowClick?: (row: T, e?: React.MouseEvent) => void;
  /** tfoot 내용. () => <tr>...</tr> 반환 */
  renderFooter?: () => React.ReactNode;
  /** 행 아래 확장 영역. null 반환 시 미표시 */
  renderExpandedRow?: (row: T) => React.ReactNode;
  /** 확장 행 tr의 className */
  expandedRowClassName?: string;
  /** 데이터 없을 때 표시 */
  emptyMessage?: React.ReactNode;
}

function applySortableFromColumns<T>(cols: ColumnDef<T, any>[]): ColumnDef<T, any>[] {
  return cols.map((col) => {
    const def = col as ColumnDef<T, any> & {
      enableSorting?: boolean;
      columns?: ColumnDef<T, any>[];
    };
    if (def.columns) {
      return { ...col, columns: applySortableFromColumns(def.columns) };
    }
    return { ...col, enableSorting: def.enableSorting === true };
  });
}

export function DataTable<T>({
  columns,
  data,
  getRowId,
  variant = 'default',
  className,
  tableClassName,
  tfootClassName,
  thClassName,
  getRowClassName,
  getTdProps,
  onRowClick,
  renderFooter,
  renderExpandedRow,
  expandedRowClassName,
  emptyMessage,
}: DataTableProps<T>) {
  const [sorting, setSorting] = useState<{ id: string; desc: boolean }[]>([]);

  const resolvedColumns = useMemo(() => applySortableFromColumns(columns), [columns]);

  const table = useReactTable({
    data,
    columns: resolvedColumns,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: (updater) => {
      const next = typeof updater === 'function' ? updater(sorting) : updater;
      setSorting(next);
    },
  });

  const leafColumns = table.getAllLeafColumns();

  return (
    <div className={clsx(variantMap[variant], onRowClick && s.rowsClickable, className)}>
      <table className={tableClassName}>
        <colgroup>
          {leafColumns.map((col) => (
            <col key={col.id} style={{ width: col.getSize() }} />
          ))}
        </colgroup>
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((h) => {
                const canSort = h.column.getCanSort();
                const sortDir = h.column.getIsSorted();
                const meta = h.column.columnDef.meta as
                  | { className?: string; thStyle?: React.CSSProperties }
                  | undefined;
                return (
                  <th
                    key={h.id}
                    colSpan={h.colSpan > 1 ? h.colSpan : undefined}
                    rowSpan={h.rowSpan > 1 ? h.rowSpan : undefined}
                    className={clsx(thClassName, meta?.className)}
                    style={
                      canSort
                        ? { cursor: 'pointer', userSelect: 'none', ...meta?.thStyle }
                        : meta?.thStyle
                    }
                    onClick={canSort ? h.column.getToggleSortingHandler() : undefined}
                  >
                    {h.isPlaceholder ? null : (
                      <>
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        {canSort && (
                          <span className={s.sortIcon}>
                            {sortDir === 'asc' ? (
                              <ChevronUp size={12} aria-hidden />
                            ) : sortDir === 'desc' ? (
                              <ChevronDown size={12} aria-hidden />
                            ) : (
                              <ChevronDown size={12} aria-hidden style={{ opacity: 0.3 }} />
                            )}
                          </span>
                        )}
                      </>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.length === 0 ? (
            emptyMessage ? (
              <tr>
                <td colSpan={table.getAllLeafColumns().length} className={s.emptyCell}>
                  {emptyMessage}
                </td>
              </tr>
            ) : null
          ) : (
            table.getRowModel().rows.map((row) => {
              const expandedContent = renderExpandedRow?.(row.original);
              return (
                <React.Fragment key={row.id}>
                  <tr
                    className={getRowClassName?.(row.original)}
                    onClick={
                      getTdProps
                        ? undefined
                        : onRowClick
                          ? (e) => onRowClick(row.original, e)
                          : undefined
                    }
                    role={getTdProps ? undefined : onRowClick ? 'button' : undefined}
                    tabIndex={getTdProps ? undefined : onRowClick ? 0 : undefined}
                    onKeyDown={
                      getTdProps
                        ? undefined
                        : onRowClick
                          ? (e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onRowClick(row.original);
                              }
                            }
                          : undefined
                    }
                  >
                    {row.getVisibleCells().map((cell) => {
                      const tdProps = getTdProps?.(cell, row) ?? {};
                      const hasCellClick = typeof tdProps.onClick === 'function';
                      const meta = cell.column.columnDef.meta as
                        | { className?: string; tdStyle?: React.CSSProperties }
                        | undefined;
                      return (
                        <td
                          key={cell.id}
                          {...tdProps}
                          className={clsx(meta?.className, tdProps.className)}
                          style={{ ...meta?.tdStyle, ...tdProps.style }}
                          onClick={
                            hasCellClick
                              ? tdProps.onClick
                              : onRowClick
                                ? (e) => onRowClick(row.original, e)
                                : undefined
                          }
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                  {expandedContent && (
                    <tr className={expandedRowClassName}>
                      <td colSpan={leafColumns.length}>{expandedContent}</td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
        {renderFooter && <tfoot className={tfootClassName}>{renderFooter()}</tfoot>}
      </table>
    </div>
  );
}
