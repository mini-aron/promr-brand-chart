export function parseLink(url: string): { pathname: string; search: string } {
  try {
    const u = new URL(url, window.location.origin);
    return { pathname: u.pathname, search: u.search };
  } catch {
    return { pathname: url, search: '' };
  }
}
