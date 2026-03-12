import { style, globalStyle } from '@vanilla-extract/css';

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
});
globalStyle(`${page} .page-header`, {
  flexShrink: 0,
  display: 'flex',
  alignItems: 'baseline',
  gap: 8,
  marginBottom: 4,
});
globalStyle(`${page} .page-header h1`, { margin: 0, fontSize: '1.25rem', fontWeight: 600 });
globalStyle(`${page} .page-header p`, { margin: 0, fontSize: 13 });

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

export const corpListSidebar = style({
  width: 260,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-sm)',
});
globalStyle(`${corpListSidebar} .corp-search`, { flexShrink: 0, padding: 8 });
globalStyle(`${corpListSidebar} .corp-search input`, {
  width: '100%',
  minHeight: 44,
  padding: '0 8px',
  fontSize: 14,
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--color-border)',
});
globalStyle(`${corpListSidebar} .corp-search input:focus`, {
  outline: 'none',
  borderColor: 'var(--color-primary)',
  boxShadow: '0 0 0 2px color-mix(in srgb, var(--color-primary) 12%, transparent)',
});
globalStyle(`${corpListSidebar} .corp-search input::placeholder`, { color: 'var(--color-text-muted)' });
globalStyle(`${corpListSidebar} .corp-list`, {
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  padding: 8,
  paddingTop: 0,
});
globalStyle(`${corpListSidebar} button`, {
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
globalStyle(`${corpListSidebar} button:hover`, { backgroundColor: 'var(--color-background)' });
globalStyle(`${corpListSidebar} button[data-active="true"]`, {
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, transparent)',
  color: 'var(--color-primary)',
  fontWeight: 600,
});

export const promrBadge = style({
  display: 'inline-block',
  marginLeft: 4,
  padding: '2px 8px',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--color-primary)',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
  borderRadius: 'var(--radius-sm)',
});

export const sortIcon = style({ marginLeft: 4, opacity: 0.6, fontSize: 10 });

export const filterRowStyles = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  marginBottom: 8,
});

export const corpDesc = style({ marginBottom: 4, fontSize: 13, color: 'var(--color-text-muted)' });
export const corpDescStrong = style({ color: 'var(--color-text)' });
export const filterInputWrap = style({ maxWidth: 280, minWidth: 140 });
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
