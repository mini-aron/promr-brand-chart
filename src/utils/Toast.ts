/**
 * 토스트 알림 (실제 구현 시 react-hot-toast 등 연동)
 */
export function toast(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
  console.warn('[Toast]', type, message);
}
