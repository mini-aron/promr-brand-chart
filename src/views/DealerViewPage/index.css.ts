import { style, globalStyle } from '@vanilla-extract/css';

export { page } from '@/style/PageStyles.css';

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

export const promrBadge = style({
  display: 'inline-block',
  marginLeft: 4,
  padding: '2px 8px',
  fontSize: 11,
  fontWeight: 600,
  borderRadius: 12,
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
  color: 'var(--color-primary)',
});

export const contentWrap = style({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-sm)',
  overflow: 'hidden',
});

export const contentHeader = style({
  flexShrink: 0,
  padding: 12,
  borderBottom: '1px solid var(--color-border)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 8,
});
globalStyle(`${contentHeader} h2`, { margin: 0, fontSize: 18, fontWeight: 600 });
globalStyle(`${contentHeader} p`, { margin: '4px 0 0', fontSize: 13 });

export const linkStyles = style({
  color: 'var(--color-primary)',
  textDecoration: 'none',
});
globalStyle(`${linkStyles}:hover`, { textDecoration: 'underline' });

export const fileActionGroup = style({ display: 'flex', gap: 4, alignItems: 'center' });

export const linkButton = style({
  color: 'var(--color-primary)',
  background: 'none',
  border: 'none',
  padding: 0,
  fontSize: 'inherit',
  textDecoration: 'none',
  cursor: 'pointer',
});
globalStyle(`${linkButton}:hover`, { textDecoration: 'underline' });

export const separator = style({ color: 'var(--color-text-muted)' });

export const modalOverlay = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'var(--color-overlay)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
});

export const previewModalBox = style({
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-md)',
  width: '90vw',
  maxWidth: 1200,
  maxHeight: '90vh',
  overflow: 'auto',
  padding: 16,
  position: 'relative',
});

export const modalHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 16,
});
globalStyle(`${modalHeader} h2`, { margin: 0, fontSize: 18, fontWeight: 600 });

export const previewContent = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 400,
});
globalStyle(`${previewContent} img`, {
  maxWidth: '100%',
  maxHeight: '70vh',
  objectFit: 'contain',
});

export const emptyState = style({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--color-text-muted)',
  fontSize: 14,
});

export const buttonShrink = style({ flexShrink: 0 });
