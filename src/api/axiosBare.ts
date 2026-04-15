import axios, { type AxiosInstance } from 'axios';

/** 인터셉터 없음 — refresh 전용 등 순환 방지 */
export const axiosBare: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  timeout: 15000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});
