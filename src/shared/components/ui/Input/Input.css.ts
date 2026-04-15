import { style } from '@vanilla-extract/css';

const base = style({
  boxSizing: 'border-box',
  display: 'block',
  width: '100%',
  fontFamily: 'inherit',
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text)',
  selectors: {
    '&::placeholder': { color: 'var(--color-text-muted)' },
    '&:focus': {
      outline: 'none',
      borderColor: 'var(--color-primary)',
    },
    '&:disabled': {
      opacity: 0.6,
      cursor: 'not-allowed',
    },
  },
});

export const sizeDefault = style([
  base,
  {
    minHeight: 32,
    padding: '4px 8px',
    fontSize: 13,
  },
]);

export const sizeCompact = style([
  base,
  {
    padding: '6px 8px',
    fontSize: 13,
    width: 'auto',
    minWidth: 60,
  },
]);

/** 필터 영역용. Select size="large"와 동일한 높이 */
export const sizeLarge = style([
  base,
  {
    minHeight: 48,
    padding: '0 12px',
    fontSize: 15,
    selectors: {
      '&:hover': { borderColor: 'var(--color-primary)' },
      '&:focus': {
        boxShadow: '0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent)',
      },
    },
  },
]);
