import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

export function setupInterceptors(instance: AxiosInstance): void {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 토큰 등 공통 헤더 추가
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
