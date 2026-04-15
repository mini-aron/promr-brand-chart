import axios, { InternalAxiosRequestConfig, type AxiosInstance } from 'axios';
import { setupInterceptors } from '@/api/interceptors';

const instance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  timeout: 15000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export function formDataConfig(): Pick<
  InternalAxiosRequestConfig,
  'transformRequest' | 'maxBodyLength' | 'maxContentLength'
> {
  return {
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    transformRequest: [
      (data, headers) => {
        if (data instanceof FormData && headers) {
          if (typeof headers.delete === 'function') {
            headers.delete('Content-Type');
          } else {
            delete (headers as Record<string, unknown>)['Content-Type'];
          }
        }
        return data;
      },
    ],
  };
}

setupInterceptors(instance);
export default instance;
