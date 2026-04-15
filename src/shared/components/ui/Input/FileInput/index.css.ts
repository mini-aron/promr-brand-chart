import { style, globalStyle } from '@vanilla-extract/css';

export const input = style({
  display: 'block',
  width: '100%',
  fontSize: 14,
  padding: 8,
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  cursor: 'pointer',
  boxSizing: 'border-box',
});

globalStyle(`${input}:hover`, { borderColor: 'var(--color-primary)' });
globalStyle(`${input}::file-selector-button`, {
  padding: '4px 8px',
  marginRight: 8,
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'var(--color-primary)',
  color: 'var(--color-button-text)',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
});
globalStyle(`${input}::file-selector-button:hover`, {
  backgroundColor: 'var(--color-primary-hover)',
});
