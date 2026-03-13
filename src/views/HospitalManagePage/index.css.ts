import { style, globalStyle } from '@vanilla-extract/css';

export const page = style({});

globalStyle(`${page} h1`, { marginBottom: 8 });
globalStyle(`${page} p`, { marginBottom: 16 });

export const headerRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: 16,
});

export const searchRow = style({
  marginBottom: 16,
});

globalStyle(`${searchRow} input`, {
  width: '100%',
  maxWidth: 320,
  minHeight: 48,
  padding: '0 12px',
  fontSize: 15,
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--color-border)',
  boxSizing: 'border-box',
});
globalStyle(`${searchRow} input:focus`, {
  outline: 'none',
  borderColor: 'var(--color-primary)',
  boxShadow: '0 0 0 3px color-mix(in srgb, var(--color-primary) 12%, transparent)',
});

export const modalOverlay = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'var(--color-overlay)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
});

export const modalBox = style({
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-md)',
  width: '100%',
  maxWidth: 480,
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

export const formSection = style({});

globalStyle(`${formSection} label`, {
  display: 'block',
  marginBottom: 4,
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--color-text)',
});
globalStyle(`${formSection} input`, {
  width: '100%',
  minHeight: 48,
  padding: '0 12px',
  fontSize: 14,
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--color-border)',
  marginBottom: 12,
  boxSizing: 'border-box',
});
globalStyle(`${formSection} input:focus`, {
  outline: 'none',
  borderColor: 'var(--color-primary)',
  boxShadow: '0 0 0 2px color-mix(in srgb, var(--color-primary) 12%, transparent)',
});

export const modalActions = style({
  display: 'flex',
  gap: 8,
  justifyContent: 'flex-end',
  marginTop: 16,
  paddingTop: 12,
  borderTop: '1px solid var(--color-border)',
});

export const infoBox = style({
  padding: 12,
  backgroundColor: 'var(--color-background)',
  borderRadius: 'var(--radius-md)',
  marginBottom: 12,
});

export const infoRow = style({
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: 4,
  fontSize: 14,
});
export const infoLabel = style({
  color: 'var(--color-text-muted)',
  fontWeight: 500,
});
export const infoValue = style({
  color: 'var(--color-text)',
  fontWeight: 600,
});

globalStyle(`${infoBox} > *:last-child`, { marginBottom: 0 });

export const errorBox = style({
  padding: 12,
  backgroundColor: 'color-mix(in srgb, var(--color-error) 8%, transparent)',
  color: 'var(--color-error)',
  borderRadius: 'var(--radius-md)',
  fontSize: 14,
  marginBottom: 12,
  lineHeight: 1.6,
});

export const accountCodeInput = style({
  width: '100%',
  maxWidth: 98,
  padding: '2px 4px',
  fontSize: 12,
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'var(--color-surface)',
  boxSizing: 'border-box',
});
globalStyle(`${accountCodeInput}:focus`, {
  outline: 'none',
  borderColor: 'var(--color-primary)',
});

export const saveBar = style({
  position: 'sticky',
  top: 0,
  zIndex: 10,
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 8,
  padding: 8,
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid color-mix(in srgb, var(--color-primary) 18%, transparent)',
  boxShadow: '0 2px 8px color-mix(in srgb, var(--color-text) 8%, transparent)',
});

export const saveBarText = style({
  fontSize: 14,
  color: 'var(--color-text)',
  fontWeight: 500,
});

export const emptyMessage = style({
  marginTop: 8,
  color: 'var(--color-text-muted)',
});

export const hospitalTableWrap = style({});

globalStyle(`${hospitalTableWrap} table`, { minWidth: 700 });
globalStyle(`${hospitalTableWrap} th:first-child, ${hospitalTableWrap} td:first-child`, {
  width: 110,
  maxWidth: 110,
});
