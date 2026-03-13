import { style } from '@vanilla-extract/css';

export const pageTitle = style({
  margin: 0,
  marginBottom: 8,
  fontSize: '1.25rem',
  fontWeight: 600,
  color: 'var(--color-text)',
});

export const title = style({
  fontSize: 24,
  fontWeight: 600,
  marginBottom: 8,
  color: 'var(--color-text)',
});

export const subtitle = style({
  fontSize: 16,
  fontWeight: 600,
  marginBottom: 8,
  color: 'var(--color-text)',
});

export const pageDesc = style({
  marginBottom: 16,
  color: 'var(--color-text-muted)',
});
