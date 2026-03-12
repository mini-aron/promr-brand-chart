import { style } from '@vanilla-extract/css';

export const aside = style({
  width: 220,
  minWidth: 220,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  backgroundColor: 'var(--color-surface)',
  borderRight: '1px solid var(--color-border)',
  padding: 12,
  boxShadow: 'var(--shadow-sm)',
  borderRadius: 'var(--radius-lg)',
});

export const logo = style({
  display: 'block',
  textDecoration: 'none',
  marginBottom: 8,
});

export const logoImg = style({
  display: 'block',
  height: 48,
  width: 'auto',
});

export const navLinks = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});

export const navLink = style({
  color: 'var(--color-text)',
  textDecoration: 'none',
  fontWeight: 600,
  padding: '8px 8px',
  borderRadius: 'var(--radius-md)',
  selectors: {
    '&:hover': { backgroundColor: 'var(--color-background)' },
  },
});

export const activeLink = style({
  color: 'var(--color-primary) !important',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
});

export const subNavWrap = style({
  paddingLeft: 8,
  marginTop: 2,
  borderLeft: '2px solid var(--color-border)',
  marginLeft: 4,
});

export const subNavLink = style({
  padding: '4px 8px',
  fontSize: 14,
  color: 'var(--color-text)',
  textDecoration: 'none',
  fontWeight: 600,
  borderRadius: 'var(--radius-md)',
  selectors: {
    '&:hover': { backgroundColor: 'var(--color-background)' },
  },
});

export const chevron = style({
  fontSize: 12,
  transition: 'transform 0.2s',
});

export const chevronOpen = style([
  chevron,
  { transform: 'rotate(90deg)' },
]);

export const chevronClosed = style([
  chevron,
  { transform: 'rotate(0)' },
]);

export const themeToggle = style({
  fontSize: 13,
  padding: '4px 8px',
});

export const bottomBlock = style({
  marginTop: 'auto',
  paddingTop: 8,
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
});
