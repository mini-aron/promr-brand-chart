/**
 * 색상·그림자는 CSS 변수로 관리되며, 전역 스타일에서 라이트/다크 테마 값이 정의됩니다.
 * 테마 전환 시 documentElement에 data-theme="dark" | "light" 설정.
 */
export const theme = {
  fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  colors: {
    primary: 'var(--color-primary)',
    primaryHover: 'var(--color-primary-hover)',
    secondary: 'var(--color-secondary)',
    background: 'var(--color-background)',
    surface: 'var(--color-surface)',
    border: 'var(--color-border)',
    text: 'var(--color-text)',
    textMuted: 'var(--color-text-muted)',
    success: 'var(--color-success)',
    error: 'var(--color-error)',
    overlay: 'var(--color-overlay)',
    overlayStrong: 'var(--color-overlay-strong)',
    buttonText: 'var(--color-button-text)',
  },
  spacing: (n: number) => n * 4,
  radius: { sm: 4, md: 8, lg: 12 },
  shadow: {
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
  },
  buttonPadding: { y: 12, x: 24 },
} as const;

export type Theme = typeof theme;

export type ThemeMode = 'light' | 'dark';
