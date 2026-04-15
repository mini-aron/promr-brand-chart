'use client';

import { useState, type ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeStyleInjector } from '@/components/ThemeStyleInjector';
import { DemoPlayRehydrate } from '@/components/DemoPlayRehydrate';
import { MswProvider } from '@/shared/components/providers/MswProvider';
import { createQueryClient } from '@/api/queryClient';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <ThemeStyleInjector>
      <>
        {/* MSW 준비 전 MswProvider가 null이어도 토스트는 마운트 유지 */}
        <MswProvider>
          <QueryClientProvider client={queryClient}>
            <DemoPlayRehydrate>{children}</DemoPlayRehydrate>
          </QueryClientProvider>
        </MswProvider>
        <ToastContainer position="top-center" autoClose={3000} closeOnClick pauseOnHover />
      </>
    </ThemeStyleInjector>
  );
}
