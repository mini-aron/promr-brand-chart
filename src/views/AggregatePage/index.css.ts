import { style, globalStyle } from '@vanilla-extract/css';

export { page } from '@/style/PageStyles.css';

export const filterCard = style({
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  padding: 16,
  marginBottom: 16,
  boxShadow: 'var(--shadow-sm)',
});

export const filterRow = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: 16,
  alignItems: 'flex-end',
});

globalStyle(`${filterRow} label`, {
  display: 'block',
  marginBottom: 8,
  fontSize: 15,
  fontWeight: 600,
  color: 'var(--color-text)',
});
globalStyle(`${filterRow} select`, {
  display: 'block',
  width: '100%',
  minHeight: 48,
  padding: '0 12px',
  paddingRight: 40,
  fontSize: 15,
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text)',
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
});
globalStyle(`${filterRow} select:hover`, { borderColor: 'var(--color-primary)' });
globalStyle(`${filterRow} select:focus`, {
  outline: 'none',
  borderColor: 'var(--color-primary)',
  boxShadow: '0 0 0 3px color-mix(in srgb, var(--color-primary) 12%, transparent)',
});
globalStyle(`${filterRow} select:disabled`, { opacity: 0.8, cursor: 'not-allowed' });

export const sortIcon = style({ marginLeft: 4, opacity: 0.6, fontSize: 10 });

export const productSearchInput = style({
  minHeight: 32,
  padding: '4px 8px',
  fontSize: 13,
  borderRadius: 'var(--radius-sm)',
});

export const emptyMessage = style({
  marginTop: 8,
  color: 'var(--color-text-muted)',
});

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
