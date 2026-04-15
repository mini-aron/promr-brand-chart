/**
 * TanStack Query 쿼리 키 상수
 */
export const queryKeys = {
  auth: ['auth'] as const,
  user: ['user'] as const,
  dashboard: ['dashboard'] as const,
  agreement: {
    list: ['agreement', 'list'] as const,
  },
  contract: {
    requestList: () => ['contract', 'request', 'list'] as const,
    requestDetail: (id: number) => ['contract', 'request', 'detail', id] as const,
    reEntrustList: () => ['contract', 'reentrust', 'list'] as const,
    reEntrustDetail: (id: number) => ['contract', 'reentrust', 'detail', id] as const,
  },
} as const;
