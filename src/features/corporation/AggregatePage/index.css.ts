import { style, globalStyle } from '@vanilla-extract/css';

export { page } from '@/style/PageStyles.css';
import { filterSection as filterSectionBase } from '@/style/FilterStyles.css';
export { filterSection, filterRow, filterField } from '@/style/FilterStyles.css';

export const aggregateFilterSection = style([filterSectionBase]);
globalStyle(`${aggregateFilterSection} select`, {
  display: 'block',
  width: '100%',
  minHeight: 44,
  padding: '0 12px',
  paddingRight: 40,
  fontSize: 14,
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
globalStyle(`${aggregateFilterSection} select:hover`, { borderColor: 'var(--color-primary)' });
globalStyle(`${aggregateFilterSection} select:focus`, {
  outline: 'none',
  borderColor: 'var(--color-primary)',
  boxShadow: '0 0 0 2px color-mix(in srgb, var(--color-primary) 12%, transparent)',
});
globalStyle(`${aggregateFilterSection} select:disabled`, { opacity: 0.8, cursor: 'not-allowed' });

export const sortIcon = style({ marginLeft: 4, opacity: 0.6, fontSize: 10 });

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
