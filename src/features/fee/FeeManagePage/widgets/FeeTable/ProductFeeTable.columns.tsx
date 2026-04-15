import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';
import type { ProductFee, FeeEvent } from '@/types';
import type { ScopeForCompute } from '../../feeTypes';
import * as s from './ProductFeeTable.css';

export type { ScopeForCompute } from '../../feeTypes';

type ColumnMeta = {
  thStyle?: React.CSSProperties;
  tdStyle?: React.CSSProperties;
};

export type ProductFeeColumnsDeps = {
  eventsByProduct: Map<string, FeeEvent[]>;
  expandedProducts: Set<string>;
  showFinalFee: boolean;
  scopeOverride?: ScopeForCompute;
  getFinalFeeForRow: (p: ProductFee, scope?: ScopeForCompute) => number;
  onUpdateFeeRate: (productCode: string, feeRate: number) => void;
};

const columnHelper = createColumnHelper<ProductFee>();

export function createProductFeeColumns(deps: ProductFeeColumnsDeps) {
  const {
    eventsByProduct,
    expandedProducts,
    showFinalFee,
    scopeOverride,
    getFinalFeeForRow,
    onUpdateFeeRate,
  } = deps;

  const base: ColumnDef<ProductFee, any>[] = [
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
            <span className={s.expandCellCount}>{productEvents.length}</span>
          </>
        ) : null;
      },
    }),
    columnHelper.accessor('productCode', {
      header: '품목코드',
      size: 100,
      meta: {
        thStyle: { width: 100, minWidth: 100, maxWidth: 100 },
        tdStyle: { verticalAlign: 'middle' },
      } as ColumnMeta,
      cell: ({ row }) => {
        const p = row.original;
        return <span aria-label={`${p.productName} 품목코드`}>{p.productCode}</span>;
      },
    }),
    columnHelper.accessor('productName', {
      header: '품목명',
      size: 280,
      meta: {
        thStyle: { width: 280, minWidth: 200 },
        tdStyle: {},
      } as ColumnMeta,
    }),
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
        <span className={s.feeInputCell}>
          <input
            className={s.feeInputStyles}
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
          className: s.finalFeeDivider,
          thStyle: { textAlign: 'right', fontVariantNumeric: 'tabular-nums', paddingRight: 8 },
          tdStyle: { textAlign: 'right', fontVariantNumeric: 'tabular-nums', paddingRight: 8 },
        } as ColumnMeta,
        cell: ({ row }) => (
          <span className={s.feeInputCell}>{getFinalFeeForRow(row.original, scopeOverride)}%</span>
        ),
      }),
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
      meta: {
        ...metaColumnCss,
        thStyle: { ...metaColumnCss.thStyle, borderRight: 'none' },
        tdStyle: { ...metaColumnCss.tdStyle, borderRight: 'none' },
      },
      cell: (info) => info.getValue() ?? '-',
    }),
  );

  return base;
}
