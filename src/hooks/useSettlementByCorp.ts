import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Corporation, Hospital, SalesRow } from '@/types';

export interface SettlementDisplayRow {
  hospitalId: string;
  salespersonLabel: string;
  amount: number;
  inHouseItemCount: number;
  inHouseAmount: number;
  outHouseItemCount: number;
  outHouseAmount: number;
}

export interface SettlementTotals {
  totalInHouseItems: number;
  totalInHouseAmount: number;
  totalOutHouseItems: number;
  totalOutHouseAmount: number;
}

interface UseSettlementByCorpParams {
  corporations: Corporation[];
  hospitals: Hospital[];
  salesRows: SalesRow[];
}

export function useSettlementByCorp({ corporations, hospitals, salesRows }: UseSettlementByCorpParams) {
  const [selectedCorpId, setSelectedCorpId] = useState<string | null>(null);
  const [corpSearch, setCorpSearch] = useState('');
  const [salespersonSearch, setSalespersonSearch] = useState('');
  const [hospitalSearch, setHospitalSearch] = useState('');

  useEffect(() => {
    setSalespersonSearch('');
    setHospitalSearch('');
  }, [selectedCorpId]);

  const corporationsFiltered = useMemo(() => {
    const q = corpSearch.trim().toLowerCase();
    if (!q) return corporations;
    return corporations.filter((c) => c.name.toLowerCase().includes(q));
  }, [corporations, corpSearch]);

  const filtered = useMemo(() => {
    if (!selectedCorpId) return [];
    return salesRows.filter((r) => r.corporationId === selectedCorpId);
  }, [salesRows, selectedCorpId]);

  const settlementRows = useMemo(() => {
    const byHospital = new Map<string, { amount: number; itemCount: number }>();
    for (const r of filtered) {
      const cur = byHospital.get(r.hospitalId);
      const amount = (cur?.amount ?? 0) + r.amount;
      const itemCount = (cur?.itemCount ?? 0) + r.quantity;
      byHospital.set(r.hospitalId, { amount, itemCount });
    }
    return Array.from(byHospital.entries())
      .map(([hospitalId, agg]) => ({
        hospitalId,
        amount: agg.amount,
        inHouseItemCount: 0,
        inHouseAmount: 0,
        outHouseItemCount: agg.itemCount,
        outHouseAmount: agg.amount,
      }))
      .sort((a, b) => a.hospitalId.localeCompare(b.hospitalId));
  }, [filtered]);

  const dealerSettlementRows = useMemo(() => {
    const key = (h: string, s: string) => `${h}\t${s}`;
    const byKey = new Map<string, { amount: number; itemCount: number }>();
    for (const r of filtered) {
      const name = r.salespersonName ?? '-';
      const k = key(r.hospitalId, name);
      const cur = byKey.get(k);
      const amount = (cur?.amount ?? 0) + r.amount;
      const itemCount = (cur?.itemCount ?? 0) + r.quantity;
      byKey.set(k, { amount, itemCount });
    }
    return Array.from(byKey.entries())
      .map(([k, agg]) => {
        const [hospitalId, salespersonName] = k.split('\t');
        return {
          hospitalId,
          salespersonName,
          amount: agg.amount,
          inHouseItemCount: 0,
          inHouseAmount: 0,
          outHouseItemCount: agg.itemCount,
          outHouseAmount: agg.amount,
        };
      })
      .sort((a, b) =>
        a.hospitalId.localeCompare(b.hospitalId) || a.salespersonName.localeCompare(b.salespersonName)
      );
  }, [filtered]);

  const totals = useMemo(
    () => ({
      totalInHouseItems: settlementRows.reduce((s, r) => s + r.inHouseItemCount, 0),
      totalInHouseAmount: settlementRows.reduce((s, r) => s + r.inHouseAmount, 0),
      totalOutHouseItems: settlementRows.reduce((s, r) => s + r.outHouseItemCount, 0),
      totalOutHouseAmount: settlementRows.reduce((s, r) => s + r.outHouseAmount, 0),
    }),
    [settlementRows]
  );

  const dealerTotals = useMemo(
    () => ({
      totalInHouseItems: dealerSettlementRows.reduce((s, r) => s + r.inHouseItemCount, 0),
      totalInHouseAmount: dealerSettlementRows.reduce((s, r) => s + r.inHouseAmount, 0),
      totalOutHouseItems: dealerSettlementRows.reduce((s, r) => s + r.outHouseItemCount, 0),
      totalOutHouseAmount: dealerSettlementRows.reduce((s, r) => s + r.outHouseAmount, 0),
    }),
    [dealerSettlementRows]
  );

  const getHospital = useCallback((id: string) => hospitals.find((h) => h.id === id), [hospitals]);
  const selectedCorp = selectedCorpId ? corporations.find((c) => c.id === selectedCorpId) : null;

  const displayRows = useMemo((): SettlementDisplayRow[] => {
    if (!selectedCorp) return [];
    if (selectedCorp.isPromr) {
      return dealerSettlementRows.map((r) => ({ ...r, salespersonLabel: r.salespersonName }));
    }
    return settlementRows.map((r) => ({ ...r, salespersonLabel: selectedCorp.name }));
  }, [selectedCorp, dealerSettlementRows, settlementRows]);

  const filteredDisplayRows = useMemo(() => {
    let rows = displayRows;
    if (selectedCorp?.isPromr) {
      const q = salespersonSearch.trim().toLowerCase();
      if (q) rows = rows.filter((r) => r.salespersonLabel?.toLowerCase().includes(q));
    }
    const hq = hospitalSearch.trim().toLowerCase();
    if (hq) {
      rows = rows.filter((r) => {
        const name = getHospital(r.hospitalId)?.name ?? r.hospitalId;
        return name.toLowerCase().includes(hq);
      });
    }
    return rows;
  }, [selectedCorp?.isPromr, displayRows, salespersonSearch, hospitalSearch, getHospital]);

  const displayTotals = useMemo((): SettlementTotals => {
    const hasFilter = salespersonSearch.trim() || hospitalSearch.trim();
    if (!hasFilter && !selectedCorp?.isPromr) return totals;
    if (!hasFilter && selectedCorp?.isPromr) return dealerTotals;
    return {
      totalInHouseItems: filteredDisplayRows.reduce((s, r) => s + r.inHouseItemCount, 0),
      totalInHouseAmount: filteredDisplayRows.reduce((s, r) => s + r.inHouseAmount, 0),
      totalOutHouseItems: filteredDisplayRows.reduce((s, r) => s + r.outHouseItemCount, 0),
      totalOutHouseAmount: filteredDisplayRows.reduce((s, r) => s + r.outHouseAmount, 0),
    };
  }, [selectedCorp?.isPromr, totals, dealerTotals, salespersonSearch, hospitalSearch, filteredDisplayRows]);

  return {
    selectedCorpId,
    setSelectedCorpId,
    corpSearch,
    setCorpSearch,
    salespersonSearch,
    setSalespersonSearch,
    hospitalSearch,
    setHospitalSearch,
    corporationsFiltered,
    selectedCorp,
    filteredDisplayRows,
    displayTotals,
    getHospital,
  };
}
