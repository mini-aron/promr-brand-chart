export function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

export function setCookie(name: string, value: string, maxAgeSeconds?: number): void {
  let cookie = `${name}=${encodeURIComponent(value)}; path=/`;
  if (maxAgeSeconds != null) cookie += `; max-age=${maxAgeSeconds}`;
  document.cookie = cookie;
}
