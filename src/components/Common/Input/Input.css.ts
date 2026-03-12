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
    padding: '8px 10px',
    fontSize: 14,
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
