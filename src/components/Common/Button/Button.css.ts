import { style } from '@vanilla-extract/css';

const base = style({
  border: 'none',
  cursor: 'pointer',
  fontWeight: 600,
  fontFamily: 'var(--font-family)',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  transition: 'background-color 0.15s, border-color 0.15s, box-shadow 0.15s, opacity 0.15s, transform 0.1s',
  selectors: {
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
    '&:focus-visible': {
      outline: '2px solid var(--color-primary)',
      outlineOffset: 2,
    },
  },
});

export const baseStyle = base;

export const variantPrimary = style({
  backgroundColor: 'var(--color-primary)',
  color: 'var(--color-button-text)',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: 'var(--color-primary-hover)',
      boxShadow: '0 2px 4px rgba(59, 130, 246, 0.25)',
    },
    '&:active:not(:disabled)': {
      transform: 'translateY(1px)',
      boxShadow: 'none',
    },
  },
});

export const variantSecondary = style({
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text)',
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: 'var(--color-background)',
      borderColor: 'var(--color-text-muted)',
    },
    '&:active:not(:disabled)': {
      backgroundColor: 'var(--color-border)',
    },
  },
});

export const variantGhost = style({
  backgroundColor: 'transparent',
  color: 'var(--color-text)',
  selectors: {
    '&:hover:not(:disabled)': { backgroundColor: 'var(--color-background)' },
    '&:active:not(:disabled)': { backgroundColor: 'var(--color-border)' },
  },
});

export const variantDanger = style({
  border: '1px solid var(--color-error)',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-error)',
  selectors: {
    '&:hover:not(:disabled)': {
      backgroundColor: 'color-mix(in srgb, var(--color-error) 10%, transparent)',
      borderColor: 'var(--color-error)',
    },
    '&:active:not(:disabled)': {
      backgroundColor: 'color-mix(in srgb, var(--color-error) 18%, transparent)',
    },
  },
});

export const variantMenu = style({
  background: 'none',
  color: 'var(--color-text)',
  width: '100%',
  textAlign: 'left',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderRadius: 'var(--radius-sm)',
  selectors: {
    '&:hover:not(:disabled)': { backgroundColor: 'var(--color-background)' },
    '&[data-active="true"]': {
      color: 'var(--color-primary)',
      backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
    },
  },
});

export const sizeDefault = style({
  padding: '8px 12px',
  fontSize: 13,
  borderRadius: 'var(--radius-sm)',
  minHeight: 36,
});

export const sizeSmall = style({
  padding: '2px 6px',
  fontSize: 11,
  fontWeight: 500,
  borderRadius: 'var(--radius-sm)',
});

export const sizeIcon = style({
  width: 28,
  height: 28,
  padding: 0,
  minHeight: 0,
  borderRadius: 'var(--radius-sm)',
  fontSize: 16,
  lineHeight: 1,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const sizeMenu = style({
  padding: '4px 8px',
  fontSize: 13,
  borderRadius: 'var(--radius-sm)',
  minHeight: 0,
});

export const variantStyles = {
  primary: variantPrimary,
  secondary: variantSecondary,
  ghost: variantGhost,
  danger: variantDanger,
  menu: variantMenu,
} as const;

export const sizeStyles = {
  default: sizeDefault,
  small: sizeSmall,
  icon: sizeIcon,
  menu: sizeMenu,
} as const;
