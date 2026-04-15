import { useMemo } from 'react';
import type { Corporation, Hospital, SalesRow } from '@/types';

export const REGION_NAMES: Record<string, string> = {
  'KR-11': '서울',
  'KR-26': '부산',
  'KR-27': '대구',
  'KR-28': '인천',
  'KR-29': '광주',
  'KR-30': '대전',
  'KR-31': '울산',
  'KR-41': '경기',
  'KR-42': '강원',
  'KR-43': '충북',
  'KR-44': '충남',
  'KR-45': '전북',
  'KR-46': '전남',
  'KR-47': '경북',
  'KR-48': '경남',
  'KR-49': '제주',
  'KR-50': '세종',
};

const ADDRESS_TO_REGION: Record<string, string> = {
  서울특별시: 'KR-11',
  경기도: 'KR-41',
  인천광역시: 'KR-28',
  부산광역시: 'KR-26',
  대구광역시: 'KR-27',
  광주광역시: 'KR-29',
  대전광역시: 'KR-30',
  울산광역시: 'KR-31',
  세종시: 'KR-50',
  강원도: 'KR-42',
  충청북도: 'KR-43',
  충청남도: 'KR-44',
  전라북도: 'KR-45',
  전라남도: 'KR-46',
  경상북도: 'KR-47',
  경상남도: 'KR-48',
  제주특별자치도: 'KR-49',
};

export interface RegionStat {
  regionCode: string;
  regionName: string;
  amount: number;
  quantity: number;
}

export interface RegionCorpRatio {
  corporationId: string;
  corporationName: string;
  amount: number;
  ratio: number;
}

export interface RegionHospitalSale {
  hospitalId: string;
  hospitalName: string;
  quantity: number;
  amount: number;
}

function addressToRegionCode(address: string): string {
  for (const [prefix, code] of Object.entries(ADDRESS_TO_REGION)) {
    if (address.startsWith(prefix)) return code;
  }
  return 'KR-41';
}

export function useSettlementByRegion(
  hospitals: Hospital[],
  salesRows: SalesRow[],
  corporations: Corporation[],
) {
  const corpMap = useMemo(() => new Map(corporations.map((c) => [c.id, c])), [corporations]);

  const regionStats = useMemo(() => {
    const byRegion = new Map<string, { amount: number; quantity: number }>();
    const hospitalRegion = new Map<string, string>();

    for (const h of hospitals) {
      const code = addressToRegionCode(h.address ?? '');
      hospitalRegion.set(h.id, code);
    }

    for (const row of salesRows) {
      const code = hospitalRegion.get(row.hospitalId) ?? 'KR-41';
      const cur = byRegion.get(code) ?? { amount: 0, quantity: 0 };
      cur.amount += row.amount;
      cur.quantity += row.quantity;
      byRegion.set(code, cur);
    }

    return Array.from(byRegion.entries()).map(([regionCode, agg]) => ({
      regionCode,
      regionName: REGION_NAMES[regionCode] ?? regionCode,
      amount: agg.amount,
      quantity: agg.quantity,
    }));
  }, [hospitals, salesRows]);

  const regionCorpRatios = useMemo(() => {
    return (regionCode: string): RegionCorpRatio[] => {
      const hospitalRegion = new Map<string, string>();
      for (const h of hospitals) {
        hospitalRegion.set(h.id, addressToRegionCode(h.address ?? ''));
      }

      const byCorp = new Map<string, number>();
      let total = 0;

      for (const row of salesRows) {
        const code = hospitalRegion.get(row.hospitalId) ?? 'KR-41';
        if (code !== regionCode) continue;
        const cur = byCorp.get(row.corporationId) ?? 0;
        byCorp.set(row.corporationId, cur + row.amount);
        total += row.amount;
      }

      if (total === 0) return [];

      return Array.from(byCorp.entries())
        .map(([corporationId, amount]) => ({
          corporationId,
          corporationName: corpMap.get(corporationId)?.name ?? corporationId,
          amount,
          ratio: Math.round((amount / total) * 1000) / 10,
        }))
        .sort((a, b) => b.amount - a.amount);
    };
  }, [hospitals, salesRows, corpMap]);

  const getRegionByCode = useMemo(
    () => (code: string) => regionStats.find((r) => r.regionCode === code),
    [regionStats],
  );

  const getRegionHospitalSales = useMemo(() => {
    const hospitalRegion = new Map<string, string>();
    const hospitalMap = new Map(hospitals.map((h) => [h.id, h]));

    for (const h of hospitals) {
      hospitalRegion.set(h.id, addressToRegionCode(h.address ?? ''));
    }

    return (regionCode: string): RegionHospitalSale[] => {
      const byHospital = new Map<string, { quantity: number; amount: number }>();

      for (const row of salesRows) {
        const code = hospitalRegion.get(row.hospitalId) ?? 'KR-41';
        if (code !== regionCode) continue;

        const cur = byHospital.get(row.hospitalId) ?? { quantity: 0, amount: 0 };
        cur.quantity += row.quantity;
        cur.amount += row.amount;
        byHospital.set(row.hospitalId, cur);
      }

      return Array.from(byHospital.entries())
        .map(([hospitalId, agg]) => ({
          hospitalId,
          hospitalName: hospitalMap.get(hospitalId)?.name ?? hospitalId,
          quantity: agg.quantity,
          amount: agg.amount,
        }))
        .sort((a, b) => b.amount - a.amount);
    };
  }, [hospitals, salesRows]);

  const getRegionSalesRows = useMemo(() => {
    const hospitalRegion = new Map<string, string>();
    for (const h of hospitals) {
      hospitalRegion.set(h.id, addressToRegionCode(h.address ?? ''));
    }
    return (regionCode: string): SalesRow[] =>
      salesRows
        .filter((row) => (hospitalRegion.get(row.hospitalId) ?? 'KR-41') === regionCode)
        .sort((a, b) => b.amount - a.amount);
  }, [hospitals, salesRows]);

  return {
    regionStats,
    regionCorpRatios,
    getRegionByCode,
    getRegionHospitalSales,
    getRegionSalesRows,
    REGION_NAMES,
  };
}
