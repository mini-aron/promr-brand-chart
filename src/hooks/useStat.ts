/**
 * 통계/집계 데이터 훅 (API 연동 시 사용)
 */
export function useStat(_key: string) {
  return { data: null, isLoading: false, error: null };
}
