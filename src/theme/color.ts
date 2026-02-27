/**
 * 테마 색상·간격·그림자.
 * CSS 변수는 index.css에서 정의되며, data-theme="dark" | "light" 로 전환.
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
  buttonPadding: { y: 8, x: 16 },
} as const;

export type Theme = typeof theme;
export type ThemeMode = 'light' | 'dark';
