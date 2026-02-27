export function getKST(date: Date = new Date()): Date {
  const kst = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
  return kst;
}

export function getPrevMonthYYYYMM(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function generateMonthList(count: number): string[] {
  const list: string[] = [];
  const d = new Date();
  for (let i = 0; i < count; i++) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    list.push(`${y}-${m}`);
    d.setMonth(d.getMonth() - 1);
  }
  return list;
}
