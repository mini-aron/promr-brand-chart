import { style, globalStyle } from '@vanilla-extract/css';

export const page = style({});
globalStyle(`${page} h1`, { marginBottom: 8 });
globalStyle(`${page} p`, { marginBottom: 16 });

export const headerRowWrap = style({ marginBottom: 16 });

export const modalOverlay = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'var(--color-overlay)',
  zIndex: 1000,
});

export const modalHeaderWrap = style({ marginBottom: 16 });

globalStyle(`${modalHeaderWrap} h2`, { margin: 0, fontSize: 18, fontWeight: 600 });

export const modalActionsWrap = style({
  marginTop: 16,
  paddingTop: 12,
  borderTop: '1px solid var(--color-border)',
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

export const formSection = style({});
globalStyle(`${formSection} label`, {
  display: 'block',
  marginBottom: 4,
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--color-text)',
});
globalStyle(`${formSection} input[type="text"], ${formSection} input[type="tel"], ${formSection} input[type="email"]`, {
  width: '100%',
  minHeight: 48,
  padding: '0 12px',
  fontSize: 14,
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--color-border)',
  marginBottom: 12,
});
globalStyle(`${formSection} input[type="text"]:focus, ${formSection} input[type="tel"]:focus, ${formSection} input[type="email"]:focus`, {
  outline: 'none',
  borderColor: 'var(--color-primary)',
  boxShadow: '0 0 0 2px color-mix(in srgb, var(--color-primary) 12%, transparent)',
});

export const fileInputWrapper = style({ marginBottom: 12 });
export const fileInputLabel = style({
  display: 'block',
  marginBottom: 4,
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--color-text)',
});
export const fileInput = style({
  display: 'block',
  width: '100%',
  fontSize: 14,
  padding: 8,
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  cursor: 'pointer',
});
globalStyle(`${fileInput}:hover`, { borderColor: 'var(--color-primary)' });
globalStyle(`${fileInput}::file-selector-button`, {
  padding: '4px 8px',
  marginRight: 8,
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'var(--color-primary)',
  color: 'var(--color-button-text)',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
});
globalStyle(`${fileInput}::file-selector-button:hover`, { backgroundColor: 'var(--color-primary-hover)' });

export const fileNameDisplay = style({ fontSize: 13, color: 'var(--color-text-muted)', marginTop: 2 });

export const linkStyles = style({
  color: 'var(--color-primary)',
  textDecoration: 'none',
});
globalStyle(`${linkStyles}:hover`, { textDecoration: 'underline' });

export const fileActionGroup = style({ display: 'flex', gap: 4, alignItems: 'center' });
export const separator = style({ color: 'var(--color-text-muted)' });

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
globalStyle(`${previewContent} iframe`, {
  width: '100%',
  height: '70vh',
  border: 'none',
  borderRadius: 'var(--radius-md)',
});

export const confirmModalBox = style({
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-md)',
  width: '100%',
  maxWidth: 480,
  padding: 16,
  position: 'relative',
});

export const addError = style({ marginTop: 8, fontSize: 14, color: 'var(--color-error)' });
export const deleteConfirmText = style({ marginBottom: 12, color: 'var(--color-text)' });
export const deleteConfirmTextMuted = style({ fontSize: 14, color: 'var(--color-text-muted)', marginBottom: 16 });
export const emptyMessage = style({ marginTop: 8, color: 'var(--color-text-muted)' });

export const dealerTableWrap = style({});
globalStyle(`${dealerTableWrap} table`, { minWidth: 900 });
