/** 수수료 계산 범위 - item(전체), corporation(법인), corporation_hospital(법인+병원) */
export type ScopeForCompute =
  | { type: 'item' }
  | { type: 'corporation'; corporationId: string }
  | { type: 'corporation_hospital'; corporationId: string; hospitalId: string };
