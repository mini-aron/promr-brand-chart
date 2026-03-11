import { style, globalStyle } from '@vanilla-extract/css';

export const feeTableWrapOverrides = style({
  overflow: 'visible',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
});

globalStyle(`${feeTableWrapOverrides} table`, { minWidth: 400 });
globalStyle(`${feeTableWrapOverrides} th, ${feeTableWrapOverrides} td`, {
  padding: 6,
  fontSize: 13,
});

export const selectedRow = style({
  outline: '2px solid var(--color-primary)',
  boxShadow: '0 0 12px 2px color-mix(in srgb, var(--color-primary) 30%, transparent)',
});
