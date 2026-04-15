import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { axiosBare } from '@/api/axiosBare';
import { clearAuthCookies, getAccessToken, setAccessToken } from '@/utils/authCookies';

type RefreshResponse = {
  accessToken: string;
};

let refreshPromise: Promise<RefreshResponse | null> | null = null;

function refreshSession(): Promise<RefreshResponse | null> {
  if (!refreshPromise) {
    refreshPromise = (async (): Promise<RefreshResponse | null> => {
      try {
        const { data } = await axiosBare.post<RefreshResponse>('/refresh');
        setAccessToken(data.accessToken);
        return data;
      } catch {
        return null;
      }
    })().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

function redirectToLogin(): void {
  clearAuthCookies();
  if (typeof window !== 'undefined') {
    window.location.assign('/login');
  }
}

export function setupInterceptors(instance: AxiosInstance): void {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const originalRequest = error.config as
        | (InternalAxiosRequestConfig & { _retry?: boolean })
        | undefined;

      if (status !== 401 || !originalRequest) {
        return Promise.reject(error);
      }

      const url = originalRequest.url ?? '';

      if (url.includes('/auth/login')) {
        return Promise.reject(error);
      }

      if (url.includes('/refresh') || originalRequest._retry) {
        redirectToLogin();
        return Promise.reject(error);
      }

      const tokens = await refreshSession();
      if (!tokens) {
        redirectToLogin();
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      return instance(originalRequest);
    },
  );
}
