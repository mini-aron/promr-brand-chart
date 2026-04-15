'use client';

import { useEffect, useState } from 'react';
import { getAccessToken } from '@/utils/authCookies';

/**
 * 마운트 시 access 쿠키만 읽음. 로그인/로그아웃은 router 이동으로 다시 읽힘.
 */
export function useAuthSession() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setToken(getAccessToken());
    setIsLoading(false);
  }, []);

  return {
    isAuthenticated: !!token,
    isLoading,
  };
}
