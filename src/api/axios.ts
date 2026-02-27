import axios, { type AxiosInstance } from 'axios';
import { setupInterceptors } from '@/api/interceptors';

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

setupInterceptors(instance);
export default instance;
