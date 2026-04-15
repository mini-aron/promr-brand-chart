import { style, globalStyle } from '@vanilla-extract/css';

export const corpListSidebarLayout = style({
  width: 260,
  flexShrink: 0,
  marginBottom: 0,
  overflow: 'hidden',
});

export const corpListSidebar = style({
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

globalStyle(`${sidebarSearchWrap} input`, {
  width: '100%',
  boxSizing: 'border-box',
});

export const corpList = style({
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

export const dealerCountBadge = style({
  display: 'inline-block',
  marginLeft: 4,
  padding: '2px 8px',
  fontSize: 11,
  fontWeight: 600,
  borderRadius: 12,
  backgroundColor: 'var(--color-background)',
  color: 'var(--color-text-muted)',
});

export const reentrustBadge = style({
  display: 'inline-block',
  marginLeft: 4,
  padding: '2px 8px',
  fontSize: 11,
  fontWeight: 700,
  borderRadius: 12,
});

export const reentrustBadgeYes = style([
  reentrustBadge,
  {
    backgroundColor: 'color-mix(in srgb, #f59e0b 18%, transparent)',
    color: '#d97706',
  },
]);

export const reentrustBadgeNo = style([
  reentrustBadge,
  {
    backgroundColor: 'var(--color-background)',
    color: 'var(--color-text-muted)',
  },
]);
