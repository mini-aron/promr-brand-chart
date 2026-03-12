import { style, globalStyle } from '@vanilla-extract/css';

export const corpSectionWrap = style({ display: 'flex', flexDirection: 'column', gap: 12 });
export const emptyMessage = style({ padding: 16, textAlign: 'center', color: 'var(--color-text-muted)' });
export const corpSectionHeader = style({
  padding: 8,
  paddingBottom: 4,
  fontSize: 15,
  fontWeight: 700,
  color: 'var(--color-text)',
  borderBottom: '2px solid var(--color-border)',
  marginBottom: 0,
});

export const finalFeeDivider = style({ borderRight: '2px solid var(--color-text) !important' });
export const expandCell = style({
  width: 36,
  minWidth: 36,
  height: 28,
  minHeight: 28,
  padding: 2,
  verticalAlign: 'middle',
  cursor: 'pointer',
  textAlign: 'center',
  lineHeight: 1,
});
globalStyle(`${expandCell}:hover`, { backgroundColor: 'color-mix(in srgb, var(--color-primary) 3%, transparent)' });
export const expandCellCount = style({
  display: 'inline-block',
  minWidth: '1.5em',
  fontSize: 10,
  fontVariantNumeric: 'tabular-nums',
  textAlign: 'center',
  color: 'var(--color-text-muted)',
  marginTop: 1,
});
export const feeInputStyles = style({
  width: 72,
  minHeight: 28,
  padding: '0 6px',
  fontSize: 13,
  fontWeight: 500,
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text)',
  textAlign: 'right',
});
globalStyle(`${feeInputStyles}:focus`, {
  outline: 'none',
  borderColor: 'var(--color-primary)',
  boxShadow: '0 0 0 3px color-mix(in srgb, var(--color-primary) 12%, transparent)',
});
globalStyle(`${feeInputStyles}::placeholder`, { color: 'var(--color-text-muted)' });
export const productCodeInputStyles = style({
  width: '100%',
  minHeight: 28,
  padding: 6,
  fontSize: 13,
  borderRadius: 0,
  border: 'none',
  backgroundColor: 'transparent',
  color: 'var(--color-text)',
  boxSizing: 'border-box',
  display: 'block',
});
globalStyle(`${productCodeInputStyles}:focus`, {
  outline: 'none',
  boxShadow: 'inset 0 0 0 2px var(--color-primary)',
});
export const feeInputCell = style({});
globalStyle(`${feeInputCell} .fee-suffix`, { marginLeft: 4, fontSize: 13, color: 'var(--color-text-muted)' });

export const eventSubRow = style({
  backgroundColor: 'var(--color-background)',
});
globalStyle(`${eventSubRow} td`, {
  padding: 0,
  borderBottom: '1px solid var(--color-border)',
  borderTop: 'none',
  verticalAlign: 'top',
  overflow: 'visible',
});
export const eventExpandWrap = style({
  overflow: 'visible',
  maxHeight: 1500,
  opacity: 1,
  transition: 'max-height 0.35s ease-out, opacity 0.25s ease-out',
  padding: 6,
  paddingTop: 4,
});

export const eventTableWrap = style({
  width: '100%',
  tableLayout: 'fixed',
  borderCollapse: 'collapse',
  fontSize: 12,
});
globalStyle(`${eventTableWrap} th, ${eventTableWrap} td`, {
  padding: 4,
  paddingLeft: 6,
  textAlign: 'left',
  borderBottom: '1px solid var(--color-border)',
  verticalAlign: 'middle',
});
globalStyle(`${eventTableWrap} th:nth-of-type(3), ${eventTableWrap} td:nth-of-type(3), ${eventTableWrap} th:nth-of-type(6), ${eventTableWrap} td:nth-of-type(6), ${eventTableWrap} th:nth-of-type(7), ${eventTableWrap} td:nth-of-type(7), ${eventTableWrap} th:nth-of-type(8), ${eventTableWrap} td:nth-of-type(8), ${eventTableWrap} th:nth-of-type(9), ${eventTableWrap} td:nth-of-type(9)`, {
  textAlign: 'center',
});
globalStyle(`${eventTableWrap} th:nth-of-type(5), ${eventTableWrap} td:nth-of-type(5)`, {
  textAlign: 'right',
  fontVariantNumeric: 'tabular-nums',
  borderRight: '2px solid var(--color-text)',
});
globalStyle(`${eventTableWrap} th`, {
  backgroundColor: 'var(--color-background)',
  fontWeight: 600,
  color: 'var(--color-text-muted)',
  fontSize: 11,
});
globalStyle(`${eventTableWrap} tbody tr:last-child td`, { borderBottom: 'none' });

export const eventFeeRateBadgeBase = style({ fontSize: 12, fontWeight: 600 });
export const finalFeeResultWrap = style({ backgroundColor: 'var(--color-surface)' });
globalStyle(`${finalFeeResultWrap} tr td`, { borderTop: '1px solid var(--color-border)' });
export const finalFeeResultRow = style({
  fontSize: 13,
});
globalStyle(`${finalFeeResultRow} td`, { borderBottom: 'none' });
globalStyle(`${finalFeeResultRow} .final-fee-title`, { fontWeight: 600 });
globalStyle(`${finalFeeResultRow} .final-fee-rate`, { fontWeight: 600, fontVariantNumeric: 'tabular-nums', fontSize: 14 });

export const cellBorder = style({
  padding: 6,
  borderBottom: '1px solid var(--color-border)',
  borderRight: '1px solid var(--color-border)',
});
export const metaCell = style([
  cellBorder,
  { fontSize: 12, color: 'var(--color-text-muted)' },
]);
export const metaCellCenter = style([
  cellBorder,
  { fontSize: 12, color: 'var(--color-text-muted)', textAlign: 'center' },
]);
export const feeEventDeleteTh = style({ width: 52, minWidth: 52 });
export const feeEventDeleteTd = style({ padding: 2, width: 52 });
export const cellBorderLast = style({ borderRight: 'none' });
export const filterRowInner = style({ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' });
export const eventHeaderRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 4,
  paddingLeft: 6,
  paddingRight: 6,
});
export const eventAddBtn = style({
  padding: 2,
  minHeight: 0,
  backgroundColor: 'var(--color-border)',
  borderRadius: 'var(--radius-sm)',
});
globalStyle(`${eventAddBtn}:hover`, { backgroundColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)' });

export const thBase = style({
  padding: 6,
  borderBottom: '1px solid var(--color-border)',
  borderRight: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-background)',
  fontWeight: 600,
});

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
