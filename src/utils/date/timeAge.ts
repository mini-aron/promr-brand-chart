export function timeAge(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const sec = Math.floor((Date.now() - d.getTime()) / 1000);
  if (sec < 60) return '방금 전';
  if (sec < 3600) return `${Math.floor(sec / 60)}분 전`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}시간 전`;
  if (sec < 2592000) return `${Math.floor(sec / 86400)}일 전`;
  return d.toLocaleDateString('ko-KR');
}
