/** NEXT_PUBLIC_IMAGE_SERVER_BASE_URL + 정적 경로(fileName)로 이미지 URL 구성 */
export function buildImageUrl(fileName: string): string {
  const isMswMode = process.env.NEXT_PUBLIC_MSW_ENABLED === 'true';
  if (isMswMode && fileName.startsWith('/')) return fileName;

  const base =
    process.env.NEXT_PUBLIC_IMAGE_SERVER_BASE_URL ?? process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? '';
  if (!base || !fileName) return '';
  const hasProtocol = base.startsWith('http://') || base.startsWith('https://');
  const normalizedBase = (hasProtocol ? base : `http://${base}`).replace(/\/$/, '');
  const normalizedFile = fileName.startsWith('/') ? fileName : `/${fileName}`;
  return `${normalizedBase}${normalizedFile}`;
}

export function isReceivedToday(iso: string): boolean {
  const d = new Date(iso);
  const n = new Date();
  return (
    d.getFullYear() === n.getFullYear() &&
    d.getMonth() === n.getMonth() &&
    d.getDate() === n.getDate()
  );
}

export function formatRelativeTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  if (ms < 0) return '방금';
  const min = Math.floor(ms / 60000);
  if (min < 1) return '방금';
  if (min < 60) return `${min}분 전`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}시간 전`;
  const days = Math.floor(h / 24);
  return `${days}일 전`;
}

export function formatRequestUrlForDisplay(url: string): string {
  if (typeof window === 'undefined') return url;
  if (url.startsWith('/')) return `${window.location.origin}${url}`;
  return url;
}
