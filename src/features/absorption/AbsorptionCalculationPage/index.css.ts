import { style, globalStyle } from '@vanilla-extract/css';

export { page } from '@/style/PageStyles.css';
export { filterSection, filterRow, filterField } from '@/style/FilterStyles.css';

export const tableTypeButtons = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  marginBottom: 16,
});

export const layoutWrap = style({
  display: 'flex',
  gap: 16,
  flex: 1,
  minHeight: 0,
  alignItems: 'stretch',
});

export const tableCard = style({
  flex: 1,
  minWidth: 320,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  marginBottom: 0,
});

export const tableWrap = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  padding: 8,
  fontSize: 14,
});
globalStyle(`${tableWrap} table`, { minWidth: 400 });
globalStyle(`${tableWrap} th, ${tableWrap} td`, { padding: 8, borderRight: 'none' });
globalStyle(`${tableWrap} th`, { fontSize: 13 });

export const hospitalSidebarLayout = style({
  width: 200,
  flexShrink: 0,
  minHeight: 0,
  marginBottom: 0,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

export const hospitalSidebar = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  flex: 1,
});

export const sidebarSearchWrap = style({
  flexShrink: 0,
  padding: 8,
});
globalStyle(`${sidebarSearchWrap} label`, {
  display: 'block',
  marginBottom: 4,
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--color-text)',
});

export const hospitalList = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  padding: 8,
  paddingTop: 0,
});
globalStyle(`${hospitalList} button`, {
  display: 'block',
  width: '100%',
  padding: 8,
  marginBottom: 4,
  textAlign: 'left',
  border: 'none',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--color-text)',
});
globalStyle(`${hospitalList} button:hover`, {
  backgroundColor: 'var(--color-background)',
});
globalStyle(`${hospitalList} button[data-active="true"]`, {
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, transparent)',
  color: 'var(--color-primary)',
  fontWeight: 600,
});

export const emptyHint = style({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--color-text-muted)',
  fontSize: 14,
  padding: 24,
});
