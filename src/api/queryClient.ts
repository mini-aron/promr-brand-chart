/**
 * TanStack Query 클라이언트.
 * 사용 시: npm install @tanstack/react-query
 * 그 후 main.tsx에서 QueryClientProvider로 감싸기.
 */
export const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
};

// TanStack Query 미설치 시 빈 객체로 두고, 설치 후 아래처럼 export
// import { QueryClient } from '@tanstack/react-query';
// export const queryClient = new QueryClient(queryClientConfig);
