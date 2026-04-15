import { style, globalStyle } from '@vanilla-extract/css';

export { page } from '@/style/PageStyles.css';
export { filterSection, filterRow, filterField } from '@/style/FilterStyles.css';

export const mappingNoInput = style({
  width: '100%',
  minWidth: 100,
  maxWidth: 140,
  padding: '6px 10px',
  fontSize: 14,
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'var(--color-surface)',
  boxSizing: 'border-box',
});
globalStyle(`${mappingNoInput}:focus`, {
  outline: 'none',
  borderColor: 'var(--color-primary)',
});

export const content = style({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  padding: '0 24px',
  overflow: 'hidden',
});

export const tableWrap = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  backgroundColor: 'var(--color-surface)',
});
