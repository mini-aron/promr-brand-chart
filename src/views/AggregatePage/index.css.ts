import { style, globalStyle } from '@vanilla-extract/css';

export const aggregateTableWrap = style({
  maxHeight: 'calc(100vh - 280px)',
  minHeight: 320,
});

globalStyle(`${aggregateTableWrap} table`, { minWidth: 1000, tableLayout: 'fixed' });
globalStyle(`${aggregateTableWrap} th, ${aggregateTableWrap} td`, { whiteSpace: 'nowrap' });
globalStyle(`${aggregateTableWrap} thead tr:first-of-type th`, {
  borderBottom: '1px solid var(--color-border)',
});
globalStyle(`${aggregateTableWrap} .col-amount, ${aggregateTableWrap} .col-inout`, {
  textAlign: 'right',
});
globalStyle(`${aggregateTableWrap} tfoot tr`, {
  position: 'sticky',
  bottom: 0,
  zIndex: 1,
  fontWeight: 700,
  borderTop: '2px solid var(--color-border)',
  boxShadow: '0 -2px 8px color-mix(in srgb, var(--color-border) 40%, transparent)',
});
globalStyle(`${aggregateTableWrap} tfoot td`, {
  backgroundColor: 'var(--color-background)',
  paddingTop: 8,
  paddingBottom: 8,
  fontSize: 13,
  fontWeight: 700,
});
globalStyle(`${aggregateTableWrap} tfoot .col-amount, ${aggregateTableWrap} tfoot .col-inout`, {
  textAlign: 'right',
});
