import { useCallback, useMemo, useState } from 'react';
import { clsx } from 'clsx';
import type { Row } from '@tanstack/react-table';
import type { Corporation, Hospital, CorpHospitalFee } from '@/types';
import { DataTable } from '@/shared/components/ui/DataTable';
import * as s from './ProductFeeTable.css';
import { createCorpFeeColumns, type CorpFeeRow } from './CorporationFeeTable.columns';

export type { CorpFeeRow } from './CorporationFeeTable.columns';

export interface CorporationFeeTableProps {
  corporations: Corporation[];
  hospitals: Hospital[];
  corpHospitalFees: CorpHospitalFee[];
  selectedCorporationId: string | null;
  onCorporationSelect: (corporationId: string | null) => void;
  onUpdateHospitalFee: (
    corporationId: string,
    hospitalId: string,
    patch: Partial<Pick<CorpHospitalFee, 'isFixedFee' | 'feeRate'>>,
  ) => void;
}

function getCorpHospitalFee(
  corpHospitalFees: CorpHospitalFee[],
  corporationId: string,
  hospitalId: string,
): CorpHospitalFee | undefined {
  return corpHospitalFees.find(
    (f) => f.corporationId === corporationId && f.hospitalId === hospitalId,
  );
}

export function CorporationFeeTable({
  corporations,
  hospitals,
  corpHospitalFees,
  selectedCorporationId,
  onCorporationSelect,
  onUpdateHospitalFee,
}: CorporationFeeTableProps) {
  const [expandedCorps, setExpandedCorps] = useState<Set<string>>(() => new Set());

  const toggleExpand = useCallback((corpId: string) => {
    setExpandedCorps((prev) => {
      const next = new Set(prev);
      if (next.has(corpId)) next.delete(corpId);
      else next.add(corpId);
      return next;
    });
  }, []);

  const hospitalsByCorp = useMemo(() => {
    const map = new Map<string, Hospital[]>();
    for (const h of hospitals) {
      const list = map.get(h.corporationId) ?? [];
      list.push(h);
      map.set(h.corporationId, list);
    }
    return map;
  }, [hospitals]);

  const flatData = useMemo<CorpFeeRow[]>(() => {
    const rows: CorpFeeRow[] = [];
    for (const corp of corporations) {
      const corpHospitals = hospitalsByCorp.get(corp.id) ?? [];
      rows.push({ type: 'corp', id: `corp-${corp.id}`, corp, hospitalCount: corpHospitals.length });
      if (expandedCorps.has(corp.id)) {
        for (const hosp of corpHospitals) {
          rows.push({ type: 'hospital', id: `hosp-${corp.id}-${hosp.id}`, corp, hospital: hosp });
        }
      }
    }
    return rows;
  }, [corporations, hospitalsByCorp, expandedCorps]);

  const getFee = useCallback(
    (corpId: string, hospId: string) => getCorpHospitalFee(corpHospitalFees, corpId, hospId),
    [corpHospitalFees],
  );

  const columns = useMemo(
    () =>
      createCorpFeeColumns({
        expandedCorps,
        getCorpHospitalFee: getFee,
        onUpdateHospitalFee,
      }),
    [expandedCorps, getFee, onUpdateHospitalFee],
  );

  const getRowClassName = useCallback(
    (r: CorpFeeRow) => {
      const isCorp = r.type === 'corp';
      const isSelected = isCorp && selectedCorporationId === r.corp.id;
      return clsx(isCorp && isSelected && s.selectedRow, !isCorp && s.eventSubRow);
    },
    [selectedCorporationId],
  );

  const onRowClick = useCallback(
    (r: CorpFeeRow) => {
      if (r.type === 'corp') {
        onCorporationSelect(r.corp.id);
      }
    },
    [onCorporationSelect],
  );

  const getTdProps = useCallback(
    (cell: { column: { id: string } }, row: Row<CorpFeeRow>) => {
      const r = row.original;
      const corpId = r.corp.id;

      if (cell.column.id === 'expand' && r.type === 'corp') {
        return {
          className: s.expandCell,
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            r.hospitalCount > 0 && toggleExpand(corpId);
          },
          role: r.hospitalCount > 0 ? ('button' as const) : undefined,
          'aria-label':
            r.hospitalCount > 0 ? (expandedCorps.has(corpId) ? '접기' : '펼치기') : undefined,
        };
      }

      const isLast = cell.column.id === 'tieredFee';
      const isFeeRate = cell.column.id === 'feeRate' && r.type === 'hospital';

      return {
        className: s.cellBorder,
        style: {
          ...(isLast && { borderRight: 'none' }),
          ...(isFeeRate && { textAlign: 'right' as const }),
        },
        onClick:
          cell.column.id === 'feeRate' && r.type === 'hospital'
            ? (e: React.MouseEvent) => e.stopPropagation()
            : undefined,
      };
    },
    [toggleExpand, expandedCorps],
  );

  return (
    <DataTable<CorpFeeRow>
      columns={columns}
      data={flatData}
      getRowId={(row) => row.id}
      variant="plain"
      className={s.feeTableWrapOverrides}
      getRowClassName={getRowClassName}
      onRowClick={onRowClick}
      getTdProps={getTdProps}
    />
  );
}
