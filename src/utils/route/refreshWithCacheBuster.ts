export function refreshWithCacheBuster(): void {
  window.location.href = window.location.pathname + '?t=' + Date.now();
}
