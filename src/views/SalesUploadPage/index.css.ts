import { style, globalStyle } from '@vanilla-extract/css';

export const salesTableWrap = style({
  marginTop: 16,
});

globalStyle(`${salesTableWrap} .col-num`, { textAlign: 'right' });
globalStyle(`${salesTableWrap} tfoot tr`, {
  fontWeight: 700,
  borderTop: '2px solid var(--color-border)',
  backgroundColor: 'var(--color-background)',
});
globalStyle(`${salesTableWrap} tfoot td`, { padding: 8 });
globalStyle(`${salesTableWrap} td input, ${salesTableWrap} td select`, {
  padding: '4px 6px',
  fontSize: 12,
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'var(--color-surface)',
  boxSizing: 'border-box',
});
globalStyle(`${salesTableWrap} td input:focus, ${salesTableWrap} td select:focus`, {
  outline: 'none',
  borderColor: 'var(--color-primary)',
});
globalStyle(`${salesTableWrap} td input[type="text"]`, { width: '100%', minWidth: 80 });
globalStyle(`${salesTableWrap} td select`, {
  width: '100%',
  minWidth: 120,
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%2364748b\' d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 8px center',
  paddingRight: 28,
});
globalStyle(`${salesTableWrap} td input[type="number"]`, {
  width: 56,
  minWidth: 56,
  textAlign: 'right',
});
globalStyle(`${salesTableWrap} td[data-invalid="true"]`, {
  outline: '2px solid var(--color-error)',
  outlineOffset: -2,
  backgroundColor: 'color-mix(in srgb, var(--color-error) 14%, transparent)',
});
