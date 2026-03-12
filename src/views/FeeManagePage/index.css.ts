import { style, globalStyle } from '@vanilla-extract/css';

export const page = style({});
globalStyle(`${page} h1`, { marginBottom: 8 });
globalStyle(`${page} p`, { marginBottom: 16 });

export const layoutWrap = style({
  display: 'flex',
  gap: 16,
  alignItems: 'flex-start',
  flexWrap: 'wrap',
});

export const leftCard = style({
  flex: 1,
  minWidth: 320,
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  overflow: 'hidden',
  boxShadow: 'var(--shadow-sm)',
});

export const filterRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: 8,
  flexWrap: 'wrap',
  backgroundColor: 'var(--color-background)',
  borderBottom: '1px solid var(--color-border)',
});

export const tableWrap = style({
  flex: 1,
  minHeight: 0,
  padding: 8,
  overflow: 'auto',
});

export const rightPanel = style({
  width: 360,
  flexShrink: 0,
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  padding: 16,
  boxShadow: 'var(--shadow-sm)',
  position: 'sticky',
  top: 16,
});

export const feeInputStyles = style({
  width: 72,
  minHeight: 28,
  padding: '0 6px',
  fontSize: 13,
  fontWeight: 500,
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text)',
  textAlign: 'right',
});
globalStyle(`${feeInputStyles}:focus`, {
  outline: 'none',
  borderColor: 'var(--color-primary)',
  boxShadow: '0 0 0 3px color-mix(in srgb, var(--color-primary) 12%, transparent)',
});
globalStyle(`${feeInputStyles}::placeholder`, { color: 'var(--color-text-muted)' });

export const formField = style({ marginBottom: 12 });
globalStyle(`${formField} label`, {
  display: 'block',
  marginBottom: 4,
  fontWeight: 600,
  fontSize: 13,
});
globalStyle(`${formField} input, ${formField} select, ${formField} textarea`, {
  width: '100%',
  minHeight: 40,
  padding: '0 8px',
  fontSize: 14,
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--color-border)',
  boxSizing: 'border-box',
});
globalStyle(`${formField} input:focus, ${formField} select:focus, ${formField} textarea:focus`, {
  outline: 'none',
  borderColor: 'var(--color-primary)',
});
globalStyle(`${formField} textarea`, { minHeight: 72, padding: 8, resize: 'vertical' });

export const excelUploadZone = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  minHeight: 88,
  padding: 8,
  border: '2px dashed var(--color-border)',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--color-background)',
  cursor: 'pointer',
  transition: 'border-color 0.2s, background-color 0.2s',
});
globalStyle(`${excelUploadZone}:hover`, {
  borderColor: 'var(--color-primary)',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 3%, transparent)',
});
globalStyle(`${excelUploadZone} input[type="file"]`, {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  opacity: 0,
  cursor: 'pointer',
});
globalStyle(`${excelUploadZone} .upload-icon`, { color: 'var(--color-text-muted)' });
globalStyle(`${excelUploadZone} .upload-text`, { fontSize: 13, color: 'var(--color-text-muted)' });
globalStyle(`${excelUploadZone} .upload-hint`, { fontSize: 11, color: 'var(--color-text-muted)', opacity: 0.8 });
globalStyle(`${excelUploadZone}[data-has-file="true"]`, {
  borderColor: 'var(--color-primary)',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 5%, transparent)',
});
globalStyle(`${excelUploadZone}[data-has-file="true"] .upload-icon`, { color: 'var(--color-primary)' });
globalStyle(`${excelUploadZone}[data-has-file="true"] .upload-text`, { color: 'var(--color-text)' });

export const filterLabel = style({
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--color-text-muted)',
  whiteSpace: 'nowrap' as const,
});
export const filterRowInner = style({ display: 'flex', alignItems: 'center', gap: 4 });
export const filterRowRight = style({ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' });
export const productSearchInput = style({ minHeight: 36, width: 160, fontSize: 13, padding: '0 8px' });
export const sectionTitle = style({ fontSize: 16, marginBottom: 12 });
export const feePercent = style({ fontSize: 14, color: 'var(--color-text-muted)' });
export const addButtonFull = style({ width: '100%' });
export const excelDownloadBtn = style({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 4,
});
export const addError = style({ marginTop: 8, fontSize: 13, color: 'var(--color-error)' });
export const eventProductBox = style({
  padding: 6,
  backgroundColor: 'var(--color-background)',
  borderRadius: 'var(--radius-md)',
  fontSize: 14,
});
export const eventProductMuted = style({ color: 'var(--color-text-muted)', fontSize: 13 });
export const eventProductHint = style({ color: 'var(--color-text-muted)' });
export const formFieldFlex = style({ flex: 1 });
export const dateRow = style({ display: 'flex', gap: 8, marginBottom: 12 });
export const eventActionsRow = style({ display: 'flex', gap: 8, marginTop: 4 });
export const addEventBtnFlex = style({ flex: 1 });
