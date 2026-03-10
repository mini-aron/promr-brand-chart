/** @jsxImportSource @emotion/react */
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { css, type SerializedStyles } from '@emotion/react';
import {
  tableWrap,
  tableWrapPlain,
  tableWrapCompact,
  tableWrapSticky,
} from '@/style/TableStyles';

type TableVariant = 'default' | 'plain' | 'compact' | 'sticky';

const variantMap = {
  default: tableWrap,
  plain: tableWrapPlain,
  compact: tableWrapCompact,
  sticky: tableWrapSticky,
} as const;

export interface DataTableProps<T> {
  columns: ColumnDef<T, any>[];
  data: T[];
  getRowId: (row: T) => string;
  variant?: TableVariant;
  tableCss?: SerializedStyles;
  getRowCss?: (row: T) => SerializedStyles | undefined;
  renderFooter?: () => React.ReactNode;
  emptyMessage?: React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  getRowId,
  variant = 'default',
  tableCss,
  getRowCss,
  renderFooter,
  emptyMessage,
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getRowId,
    getCoreRowModel: getCoreRowModel(),
  });

  const wrapCss = css([variantMap[variant], tableCss ?? css({})]);

  const leafColumns = table.getAllLeafColumns();

  return (
    <div css={wrapCss}>
      <table>
        <colgroup>
          {leafColumns.map((col) => (
            <col key={col.id} style={{ width: col.getSize() }}/>
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
                <td colSpan={table.getAllLeafColumns().length} css={css({ padding: 16, textAlign: 'center' })}>
                  {emptyMessage}
                </td>
              </tr>
            ) : null
          ) : (
            table.getRowModel().rows.map((row) => (
              <tr key={row.id} css={getRowCss?.(row.original)}>
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
