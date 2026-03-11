import { style } from '@vanilla-extract/css';

/** 필터 영역 input/select와 동일한 크기 (Select size="large"와 맞춤) */
export const filterFieldInput = style({
  boxSizing: 'border-box',
  display: 'block',
  width: '100%',
  minHeight: 48,
  padding: '0 12px',
  fontSize: 15,
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text)',
  selectors: {
    '&::placeholder': { color: 'var(--color-text-muted)' },
    '&:hover': { borderColor: 'var(--color-primary)' },
    '&:focus': {
      outline: 'none',
      borderColor: 'var(--color-primary)',
      boxShadow: '0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent)',
    },
  },
});
