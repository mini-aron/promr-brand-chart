import { style, globalStyle } from '@vanilla-extract/css';

export const page = style({});
globalStyle(`${page} h1`, { marginBottom: 8 });
globalStyle(`${page} p`, { marginBottom: 16 });

export const searchRow = style({ marginBottom: 16 });
globalStyle(`${searchRow} input`, {
  width: '100%',
  maxWidth: 320,
  minHeight: 48,
  padding: '0 12px',
  fontSize: 15,
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--color-border)',
});
globalStyle(`${searchRow} input:focus`, {
  outline: 'none',
  borderColor: 'var(--color-primary)',
  boxShadow: '0 0 0 3px color-mix(in srgb, var(--color-primary) 12%, transparent)',
});

export const addFormSection = style({});
globalStyle(`${addFormSection} label`, {
  display: 'block',
  marginBottom: 8,
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--color-text)',
});
globalStyle(`${addFormSection} input, ${addFormSection} select`, {
  width: '100%',
  minHeight: 48,
  padding: '0 12px',
  fontSize: 14,
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--color-border)',
});
globalStyle(`${addFormSection} input:focus, ${addFormSection} select:focus`, {
  outline: 'none',
  borderColor: 'var(--color-primary)',
  boxShadow: '0 0 0 2px color-mix(in srgb, var(--color-primary) 12%, transparent)',
});
globalStyle(`${addFormSection} select`, {
  paddingRight: 40,
  appearance: 'none',
  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%2364748b\' d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  cursor: 'pointer',
});
globalStyle(`${addFormSection} button`, {
  padding: '8px 16px',
  fontSize: 14,
  fontWeight: 600,
  borderRadius: 'var(--radius-md)',
  border: 'none',
  backgroundColor: 'var(--color-primary)',
  color: 'var(--color-button-text)',
  cursor: 'pointer',
  minHeight: 48,
});
globalStyle(`${addFormSection} button:hover`, { backgroundColor: 'var(--color-primary-hover)' });

export const hospitalSearchRow = style({ marginBottom: 16 });
export const addFormGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(5, minmax(0, 1fr)) auto',
  gap: 12,
  alignItems: 'flex-end',
});

export const openAddButton = style({ marginBottom: 16 });
export const addFormFullWidth = style({ maxWidth: '100%', marginBottom: 8 });
export const addError = style({ marginTop: 8, fontSize: 14, color: 'var(--color-error)' });
export const emptyMessage = style({ marginTop: 8, color: 'var(--color-text-muted)' });

export const modalOverlay = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'var(--color-overlay)',
  zIndex: 1000,
});

export const modalBox = style({
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-md)',
  width: '100%',
  maxWidth: 640,
  maxHeight: '90vh',
  overflow: 'auto',
  padding: 16,
  position: 'relative',
});

export const modalHeaderWrap = style({ marginBottom: 16 });
globalStyle(`${modalHeaderWrap} h2`, { margin: 0, fontSize: 18, fontWeight: 600 });

export const modalActionsWrap = style({
  marginTop: 16,
  paddingTop: 12,
  borderTop: '1px solid var(--color-border)',
});

export const accountTableWrap = style({});

globalStyle(`${accountTableWrap} table`, { minWidth: 700 });
