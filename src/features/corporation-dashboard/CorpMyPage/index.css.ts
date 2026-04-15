import { style } from '@vanilla-extract/css';

export { page } from '@/style/PageStyles.css';

export const layout = style({
  maxWidth: 720,
  margin: '0 auto',
  width: '100%',
  paddingBottom: 24,
});

export const formStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
});

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

export const label = style({
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--color-text)',
});

export const readOnlyBox = style({
  padding: '12px 14px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  backgroundColor: 'color-mix(in srgb, var(--color-text) 3%, var(--color-surface))',
  fontSize: 15,
  fontWeight: 700,
  color: 'var(--color-text)',
  lineHeight: 1.35,
});

export const hint = style({
  margin: 0,
  fontSize: 12,
  lineHeight: 1.5,
  color: 'var(--color-text-muted)',
});

export const saveRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 12,
  marginTop: 24,
});
