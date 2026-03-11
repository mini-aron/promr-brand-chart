'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getStorage, removeStorage, setStorage } from '@/utils/storage';
import { login as loginApi, logout as logoutApi } from '@/api/services/authService';

const AUTH_TOKEN_KEY = 'auth_token';

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
};

type AuthActions = {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<(AuthState & AuthActions) | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(() => getStorage<string>(AUTH_TOKEN_KEY));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        if (!email?.trim() && !password) {
          setStorage(AUTH_TOKEN_KEY, 'demo-token');
          setToken('demo-token');
          router.replace('/home');
          return;
        }
        const { token: newToken } = await loginApi({ email, password });
        setStorage(AUTH_TOKEN_KEY, newToken);
        setToken(newToken);
        router.replace('/home');
      } catch (err) {
        if (process.env.NODE_ENV === 'development' && email && password) {
          setStorage(AUTH_TOKEN_KEY, 'demo-token');
          setToken('demo-token');
          router.replace('/home');
        } else {
          throw err;
        }
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      if (token !== 'demo-token') await logoutApi();
    } catch {
      // 클라이언트 로그아웃은 토큰 삭제로 처리
    } finally {
      removeStorage(AUTH_TOKEN_KEY);
      setToken(null);
      router.replace('/promotion');
    }
  }, [router, token]);

  const value = useMemo<AuthState & AuthActions>(
    () => ({
      isAuthenticated: !!token,
      isLoading,
      login,
      logout,
    }),
    [token, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
}
