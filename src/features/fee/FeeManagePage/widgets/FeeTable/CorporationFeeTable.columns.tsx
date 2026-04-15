import { ChevronDown, ChevronRight } from 'lucide-react';
import { createColumnHelper } from '@tanstack/react-table';
import type { Corporation, Hospital, CorpHospitalFee } from '@/types';
import { Input } from '@/shared/components/ui/Input';

/** Flat row type: either a corporation parent row or a hospital child row */
export type CorpFeeRow =
  | { type: 'corp'; id: string; corp: Corporation; hospitalCount: number }
  | { type: 'hospital'; id: string; corp: Corporation; hospital: Hospital };
import * as s from './ProductFeeTable.css';
import * as feeStyles from '../../index.css';

export type CorpFeeColumnsDeps = {
  expandedCorps: Set<string>;
  getCorpHospitalFee: (corporationId: string, hospitalId: string) => CorpHospitalFee | undefined;
  onUpdateHospitalFee: (
    corporationId: string,
    hospitalId: string,
    patch: Partial<Pick<CorpHospitalFee, 'isFixedFee' | 'feeRate'>>,
  ) => void;
};

const columnHelper = createColumnHelper<CorpFeeRow>();

export function createCorpFeeColumns(deps: CorpFeeColumnsDeps) {
  const { expandedCorps, getCorpHospitalFee, onUpdateHospitalFee } = deps;

  return [
    columnHelper.display({
      id: 'expand',
      size: 40,
      header: () => null,
      cell: ({ row }) => {
        const r = row.original;
        if (r.type !== 'corp') return null;
        const isExpanded = expandedCorps.has(r.corp.id);
        return r.hospitalCount > 0 ? (
          isExpanded ? (
            <ChevronDown size={18} />
          ) : (
            <ChevronRight size={18} />
          )
        ) : null;
      },
    }),
    columnHelper.display({
      id: 'hospitalCode',
      size: 90,
      header: '병원코드',
      cell: ({ row }) => {
        const r = row.original;
        if (r.type === 'corp') return null;
        return (
          <span
            style={{ paddingLeft: 24, fontSize: 13, textAlign: 'center', verticalAlign: 'middle' }}
          >
            {r.hospital.accountCode ?? '-'}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: 'name',
      size: 200,
      header: '병원명',
      cell: ({ row }) => {
        const r = row.original;
        if (r.type === 'corp') {
          return (
            <>
              <strong>{r.corp.name}</strong>
              {r.hospitalCount > 0 && (
                <span className={s.expandCellCount} style={{ marginLeft: 4 }}>
                  ({r.hospitalCount}개 병원)
                </span>
              )}
            </>
          );
        }
        return <span style={{ fontSize: 13, verticalAlign: 'middle' }}>{r.hospital.name}</span>;
      },
    }),
    columnHelper.display({
      id: 'address',
      size: 180,
      header: '주소',
      cell: ({ row }) => {
        const r = row.original;
        if (r.type === 'corp') return null;
        return (
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)', verticalAlign: 'middle' }}>
            {r.hospital.address ?? '-'}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: 'feeRate',
      size: 100,
      header: () => <span style={{ textAlign: 'right' }}>추가수수료(%)</span>,
      cell: ({ row }) => {
        const r = row.original;
        if (r.type === 'corp') {
          return (
            <span style={{ textAlign: 'right', color: 'var(--color-text-muted)', fontSize: 12 }}>
              {r.corp.additionalFeeRate != null ? `${r.corp.additionalFeeRate}%` : '-'}
            </span>
          );
        }
        const fee = getCorpHospitalFee(r.corp.id, r.hospital.id);
        return (
          <Input
            type="number"
            placeholder="-"
            size="compact"
            min={-100}
            max={100}
            step={0.1}
            className={feeStyles.feeInputStyles}
            value={fee?.feeRate != null ? String(fee.feeRate) : '0'}
            onChange={(e) =>
              onUpdateHospitalFee(r.corp.id, r.hospital.id, {
                feeRate: Number(e.target.value) || 0,
                isFixedFee: false,
              })
            }
            onClick={(e) => e.stopPropagation()}
          />
        );
      },
    }),
    columnHelper.display({
      id: 'tieredFee',
      size: 100,
      header: '구간수수료',
      cell: ({ row }) => {
        const r = row.original;
        if (r.type !== 'corp') return null;
        const tierSummary =
          (r.corp.tieredFeeTiers?.length ?? 0) > 0
            ? `${r.corp.tieredFeeTiers!.length}개 구간`
            : '-';
        return (
          <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>{tierSummary}</span>
        );
      },
    }),
  ];
}
