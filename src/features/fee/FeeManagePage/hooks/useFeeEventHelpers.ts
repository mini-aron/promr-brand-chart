import { useCallback, useMemo } from 'react';
import type { Corporation, FeeEvent, Hospital } from '@/types';
import { theme } from '@/theme';
import type { ScopeForCompute } from '../feeTypes';

export type FeeScopeInput = { type: 'item' } | { corporationId: string; hospitalId?: string };

export interface UseFeeEventHelpersParams {
  feeScope: FeeScopeInput;
  corporations: Corporation[];
  hospitals: Hospital[];
}

export function useFeeEventHelpers({
  feeScope,
  corporations,
  hospitals,
}: UseFeeEventHelpersParams) {
  const feeScopeForCompute = useMemo((): ScopeForCompute => {
    if (!('corporationId' in feeScope)) return { type: 'item' };
    const { corporationId, hospitalId } = feeScope;
    if (hospitalId) return { type: 'corporation_hospital', corporationId, hospitalId };
    const firstHospital = hospitals.find((h) => h.corporationId === corporationId);
    if (firstHospital)
      return {
        type: 'corporation_hospital',
        corporationId,
        hospitalId: firstHospital.id,
      };
    return { type: 'corporation', corporationId };
  }, [feeScope, hospitals]);

  const todayStr = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  const isEventApplicable = useCallback(
    (e: FeeEvent) => todayStr >= e.startDate && todayStr <= e.endDate,
    [todayStr],
  );

  const formatEventFeeRate = useCallback((e: FeeEvent) => {
    if (e.isFixedFee) return `[고정]${e.fixedFeeRate ?? 0}%`;
    const rate = e.additionalFeeRate ?? 0;
    return rate >= 0 ? `+${rate}%` : `${rate}%`;
  }, []);

  const getEventFeeRateColor = useCallback((e: FeeEvent) => {
    if (e.isFixedFee) return theme.colors.text;
    const rate = e.additionalFeeRate ?? 0;
    return rate < 0 ? theme.colors.error : theme.colors.primary;
  }, []);

  const getEventScopeText = useCallback(
    (e: FeeEvent) => {
      if (e.type === 'item') return '전체';
      const corp = corporations.find((c) => c.id === e.corporationId)?.name ?? '';
      if (e.type === 'corporation') return corp || '-';
      const hosp = hospitals.find((h) => h.id === e.hospitalId)?.name ?? '';
      return corp && hosp ? `${corp}/${hosp}` : corp || hosp || '-';
    },
    [corporations, hospitals],
  );

  const sortEventsByScope = useCallback((events: FeeEvent[]): FeeEvent[] => {
    const key = (e: FeeEvent) => {
      if (e.type === 'item') return '0';
      if (e.type === 'corporation') return `1_${e.corporationId ?? ''}_0`;
      return `1_${e.corporationId ?? ''}_1_${e.hospitalId ?? ''}`;
    };
    return [...events].sort((a, b) => key(a).localeCompare(key(b)));
  }, []);

  const computeFinalFeeForScope = useCallback(
    (baseRate: number, events: FeeEvent[], scope: ScopeForCompute): number => {
      const matches = events.filter((e) => {
        if (e.type === 'item') return true;
        if (e.type === 'corporation')
          return scope.type !== 'item' && e.corporationId === scope.corporationId;
        if (e.type === 'corporation_hospital')
          return (
            scope.type === 'corporation_hospital' &&
            e.corporationId === scope.corporationId &&
            e.hospitalId === scope.hospitalId
          );
        return false;
      });
      const sorted = [...matches].sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
      let result = baseRate;
      for (const e of sorted) {
        if (e.isFixedFee) return e.fixedFeeRate ?? 0;
        result += e.additionalFeeRate ?? 0;
      }
      return Math.max(0, Math.min(100, result));
    },
    [],
  );

  const isEventInFilterScope = useCallback(
    (e: FeeEvent, scopeOverride?: ScopeForCompute): boolean => {
      const scope = scopeOverride ?? feeScopeForCompute;
      if (!scope) return e.type === 'item';
      if (scope.type === 'item') return e.type === 'item';
      if (e.type === 'item') return true;
      if (e.type === 'corporation') return e.corporationId === scope.corporationId;
      if (e.type === 'corporation_hospital')
        return (
          scope.type === 'corporation_hospital' &&
          e.corporationId === scope.corporationId &&
          e.hospitalId === scope.hospitalId
        );
      return false;
    },
    [feeScopeForCompute],
  );

  return {
    isEventApplicable,
    formatEventFeeRate,
    getEventScopeText,
    getEventFeeRateColor,
    sortEventsByScope,
    computeFinalFeeForScope,
    isEventInFilterScope,
    feeScopeForCompute,
  };
}
