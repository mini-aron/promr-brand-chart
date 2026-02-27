/**
 * API/전역 에러 로깅 (외부 서비스 연동 시 구현)
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  console.error('[ErrorLogging]', error, context);
}
