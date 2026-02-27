import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { getStorage } from '@/utils/storage';

const AUTH_TOKEN_KEY = 'auth_token';

export function setupInterceptors(instance: AxiosInstance): void {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = getStorage<string>(AUTH_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
      // 전역 에러 로깅/토스트
      return Promise.reject(error);
    }
  );
}
