'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';

export default function RootPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      router.replace('/home');
    } else {
      router.replace('/promotion');
    }
  }, [isAuthenticated, isLoading, router]);

  return null;
}
