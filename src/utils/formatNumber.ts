export function formatNumber(value: number | string, options?: Intl.NumberFormatOptions): string {
  const n = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(n)) return '0';
  return new Intl.NumberFormat('ko-KR', options).format(n);
}

export function formatAmount(n: number): string {
  return formatNumber(n, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
