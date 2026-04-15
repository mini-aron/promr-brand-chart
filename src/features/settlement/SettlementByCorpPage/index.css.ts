import { style, globalStyle } from '@vanilla-extract/css';

export { page } from '@/style/PageStyles.css';
export { filterSection, filterRow, filterField } from '@/style/FilterStyles.css';

export const layoutWrap = style({
  display: 'flex',
  gap: 16,
  flex: 1,
  minHeight: 0,
  alignItems: 'stretch',
});

export const mainArea = style({
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const sortIcon = style({ marginLeft: 4, opacity: 0.6, fontSize: 10 });

export const corpDesc = style({ marginBottom: 4, fontSize: 13, color: 'var(--color-text-muted)' });
export const corpDescStrong = style({ color: 'var(--color-text)' });
export const emptyMessage = style({ marginTop: 8, color: 'var(--color-text-muted)' });
export const selectCorpHint = style({ color: 'var(--color-text-muted)', padding: 16 });

export const settlementTableWrap = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
});

globalStyle(`${settlementTableWrap} table`, { minWidth: 720 });
globalStyle(`${settlementTableWrap} th, ${settlementTableWrap} td`, {
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});
globalStyle(`${settlementTableWrap} .col-no`, {
  width: 40,
  minWidth: 40,
  maxWidth: 40,
  textAlign: 'center',
});
globalStyle(`${settlementTableWrap} .col-amount, ${settlementTableWrap} .col-inout`, {
  textAlign: 'right',
});
globalStyle(`${settlementTableWrap} tfoot tr`, {
  position: 'sticky',
  bottom: 0,
  zIndex: 1,
  fontWeight: 700,
  borderTop: '2px solid var(--color-border)',
  boxShadow: '0 -2px 8px color-mix(in srgb, var(--color-border) 40%, transparent)',
});
globalStyle(`${settlementTableWrap} tfoot td`, {
  backgroundColor: 'var(--color-background)',
  paddingTop: 4,
  paddingBottom: 4,
  fontSize: 12,
  fontWeight: 700,
});
globalStyle(`${settlementTableWrap} tfoot .col-amount, ${settlementTableWrap} tfoot .col-inout`, {
  textAlign: 'right',
});
