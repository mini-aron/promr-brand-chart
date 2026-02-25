export const theme = {
  fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  colors: {
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    secondary: '#64748b',
    background: '#f8fafc',
    surface: '#ffffff',
    border: '#e2e8f0',
    text: '#0f172a',
    textMuted: '#64748b',
    success: '#16a34a',
    error: '#dc2626',
  },
  spacing: (n: number) => n * 4,
  radius: { sm: 4, md: 8, lg: 12 },
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',
  },
  /** 버튼 공통 패딩 (세로, 가로) */
  buttonPadding: { y: 12, x: 24 },
} as const;

export type Theme = typeof theme;
