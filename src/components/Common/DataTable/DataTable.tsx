import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
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
  columns: ColumnDef<T, any>[];
  data: T[];
  getRowId: (row: T) => string;
  variant?: TableVariant;
  className?: string;
  getRowClassName?: (row: T) => string | undefined;
  onRowClick?: (row: T) => void;
  renderFooter?: () => React.ReactNode;
  emptyMessage?: React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  getRowId,
  variant = 'default',
  className,
  getRowClassName,
  onRowClick,
  renderFooter,
  emptyMessage,
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
  });

  const leafColumns = table.getAllLeafColumns();

  return (
    <div className={clsx(variantMap[variant], onRowClick && s.rowsClickable, className)}>
      <table>
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
                  colSpan={h.colSpan > 1 ? h.colSpan : undefined}
                  rowSpan={h.rowSpan > 1 ? h.rowSpan : undefined}
                  className={(h.column.columnDef.meta as { className?: string })?.className}
                >
                  {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                </th>
              ))}
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
            table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={getRowClassName?.(row.original)}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                role={onRowClick ? 'button' : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onKeyDown={
                  onRowClick
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onRowClick(row.original);
                        }
                      }
                    : undefined
                }
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className={(cell.column.columnDef.meta as { className?: string })?.className}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
        {renderFooter && (
          <tfoot>
            {renderFooter()}
          </tfoot>
        )}
      </table>
    </div>
  );
}
