import { style } from '@vanilla-extract/css';

export const item = style({
  padding: '6px 0',
  borderBottom: '1px solid var(--color-border)',
  minWidth: 0,
  width: '100%',
});

export const topRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  width: '100%',
});

export const checkboxWrap = style({
  flex: 1,
  minWidth: 0,
});

export const badge = style({
  display: 'inline-flex',
  alignItems: 'center',
  marginLeft: 6,
  padding: '1px 6px',
  borderRadius: 2,
  fontSize: 10,
  fontWeight: 700,
});

export const badgeRequired = style([
  badge,
  {
    backgroundColor: 'var(--color-primary-muted, rgba(59, 130, 246, 0.12))',
    color: 'var(--color-primary)',
  },
]);

export const badgeOptional = style([
  badge,
  {
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-text-muted)',
    border: '1px solid var(--color-border)',
  },
]);

export const labelWithBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: 0,
});

export const toggle = style({
  flexShrink: 0,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 2,
  minHeight: 32,
  padding: '4px 8px',
  margin: '-4px -8px -4px 0',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--color-primary)',
  background: 'transparent',
  border: 'none',
  borderRadius: 4,
  cursor: 'pointer',
  WebkitTapHighlightColor: 'transparent',
});

export const chevron = style({
  transition: 'transform 0.2s ease',
});

export const chevronOpen = style({
  transform: 'rotate(180deg)',
});

export const panel = style({
  marginTop: 10,
  padding: '12px 12px 14px',
  borderRadius: 4,
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  minWidth: 0,
  maxWidth: '100%',
  boxSizing: 'border-box',
  overflowWrap: 'break-word',
});
