import { style, styleVariants } from '@vanilla-extract/css';

export const cardWrapper = style({
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  marginBottom: 16,
  overflow: 'hidden',
});

/** 그리드·플렉스 안에서 간격은 부모 `gap`으로만 줄 때 */
export const cardWrapperFlush = style({
  marginBottom: 0,
});

export const cardWrapperFill = style({
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  marginBottom: 0,
});

export const contentFill = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
});

export const header = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '12px 16px',
  borderBottom: '1px solid var(--color-border)',
});

export const title = style({
  margin: 0,
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--color-text-muted)',
  minWidth: 0,
});

export const headerRight = style({
  flexShrink: 0,
});

export const content = styleVariants({
  8: { padding: 8 },
  16: { padding: 16 },
  0: { padding: 0 },
});

export const footer = style({
  padding: '12px 16px',
  borderTop: '1px solid var(--color-border)',
});

export type CardWrapperPadding = keyof typeof content;
