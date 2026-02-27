export function formatDate(d: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const date = typeof d === 'string' ? new Date(d) : d;
  return date.toLocaleDateString('ko-KR', options ?? { year: 'numeric', month: '2-digit', day: '2-digit' });
}
