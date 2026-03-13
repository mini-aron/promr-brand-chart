import { style, globalStyle } from '@vanilla-extract/css';

export { page } from '@/style/PageStyles.css';

export const backLink = style({
  color: 'var(--color-primary)',
  fontWeight: 600,
});

export const monthSelectWrap = style({});
globalStyle(`${monthSelectWrap} label`, {
  display: 'block',
  marginBottom: 4,
  fontSize: 13,
  fontWeight: 600,
});

export const sectionTitle1 = style({
  fontSize: 16,
  marginBottom: 8,
  color: 'var(--color-text)',
});

export const dropzoneBase = style({
  border: '2px dashed var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  padding: 32,
  textAlign: 'center',
  backgroundColor: 'var(--color-surface)',
  cursor: 'pointer',
  transition: 'background-color 0.2s, border-color 0.2s',
});
globalStyle(`${dropzoneBase}:hover`, {
  borderColor: 'var(--color-primary)',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 3%, transparent)',
});

export const dropzoneDrag = style({
  borderColor: 'var(--color-primary)',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 3%, transparent)',
});

export const fileInputHidden = style({ display: 'none' });

export const uploadedFilesLabel = style({
  fontSize: 13,
  color: 'var(--color-text-muted)',
  marginRight: 4,
});

export const successMsg = style({
  marginTop: 8,
  padding: 8,
  backgroundColor: 'color-mix(in srgb, var(--color-success) 8%, transparent)',
  color: 'var(--color-success)',
  borderRadius: 'var(--radius-md)',
});

export const errorMsg = style({
  marginTop: 8,
  padding: 8,
  backgroundColor: 'color-mix(in srgb, var(--color-error) 8%, transparent)',
  color: 'var(--color-error)',
  borderRadius: 'var(--radius-md)',
});

export const previewSection = style({
  marginTop: 16,
  padding: 16,
  backgroundColor: 'var(--color-surface)',
  border: '2px solid color-mix(in srgb, var(--color-primary) 18%, transparent)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-md)',
});

export const previewSectionTitle = style({
  fontSize: 18,
  marginBottom: 4,
  color: 'var(--color-text)',
});

export const previewSectionDesc = style({
  color: 'var(--color-text-muted)',
  marginBottom: 12,
  fontSize: 14,
});

export const invalidWarning = style({
  padding: 8,
  marginBottom: 12,
  backgroundColor: 'color-mix(in srgb, var(--color-error) 8%, transparent)',
  color: 'var(--color-error)',
  borderRadius: 'var(--radius-md)',
  fontSize: 14,
  fontWeight: 500,
});

export const separatorRow = style({});
globalStyle(`${separatorRow} td`, {
  borderBottom: '2px solid var(--color-border)',
  padding: 4,
  backgroundColor: 'var(--color-background)',
});

export const fileSumRow = style({});
globalStyle(`${fileSumRow} td`, {
  borderBottom: '2px solid var(--color-border)',
  padding: 8,
  backgroundColor: 'var(--color-background)',
  fontWeight: 600,
  fontSize: 13,
});
globalStyle(`${fileSumRow} .col-num`, { textAlign: 'right' });

export const totalCountText = style({
  fontSize: 14,
  color: 'var(--color-text-muted)',
});

export const confirmModalBox = style({
  backgroundColor: 'var(--color-surface)',
  padding: 16,
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-md)',
  minWidth: 320,
});

export const confirmModalTitle = style({
  marginBottom: 12,
  fontWeight: 600,
  color: 'var(--color-text)',
});

export const indexCell = style({
  display: 'block',
  textAlign: 'center',
  color: 'var(--color-text-muted)',
  fontSize: 11,
});

export const rowMarginBottom = style({ marginBottom: 16 });
export const rowMarginTop = style({ marginTop: 16 });

export const confirmModalOverlay = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'var(--color-overlay)',
  zIndex: 1000,
});

export const downloadRowWrap = style({ marginBottom: 16 });

globalStyle(`${downloadRowWrap} button`, {
  padding: '8px 16px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--color-surface)',
  cursor: 'pointer',
  fontWeight: 500,
});
globalStyle(`${downloadRowWrap} button:hover`, { backgroundColor: 'var(--color-background)' });

export const uploadedFilesWrap = style({ marginTop: 8 });

globalStyle(`${uploadedFilesWrap} .file-chip`, {
  padding: '4px 8px',
  fontSize: 13,
  backgroundColor: 'var(--color-background)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  maxWidth: 220,
});
globalStyle(`${uploadedFilesWrap} .file-chip .name`, { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' });
globalStyle(`${uploadedFilesWrap} .file-chip button`, {
  flexShrink: 0,
  width: 22,
  height: 22,
  padding: 0,
  border: 'none',
  borderRadius: '50%',
  backgroundColor: 'var(--color-border)',
  color: 'var(--color-text)',
  cursor: 'pointer',
  fontSize: 14,
  lineHeight: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});
globalStyle(`${uploadedFilesWrap} .file-chip button:hover`, { backgroundColor: 'var(--color-error)', color: 'var(--color-button-text)' });

export const salesTableWrap = style({
  marginTop: 16,
});

globalStyle(`${salesTableWrap} .col-num`, { textAlign: 'right' });
globalStyle(`${salesTableWrap} tfoot tr`, {
  fontWeight: 700,
  borderTop: '2px solid var(--color-border)',
  backgroundColor: 'var(--color-background)',
});
globalStyle(`${salesTableWrap} tfoot td`, { padding: 8 });
globalStyle(`${salesTableWrap} td input, ${salesTableWrap} td select`, {
  padding: '4px 6px',
  fontSize: 12,
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'var(--color-surface)',
  boxSizing: 'border-box',
});
globalStyle(`${salesTableWrap} td input:focus, ${salesTableWrap} td select:focus`, {
  outline: 'none',
  borderColor: 'var(--color-primary)',
});
globalStyle(`${salesTableWrap} td input[type="text"]`, { width: '100%', minWidth: 80 });
globalStyle(`${salesTableWrap} td select`, {
  width: '100%',
  minWidth: 120,
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 12 12\'%3E%3Cpath fill=\'%2364748b\' d=\'M6 8L1 3h10z\'/%3E%3C/svg%3E")',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 8px center',
  paddingRight: 28,
});
globalStyle(`${salesTableWrap} td input[type="number"]`, {
  width: 56,
  minWidth: 56,
  textAlign: 'right',
});
globalStyle(`${salesTableWrap} td[data-invalid="true"]`, {
  outline: '2px solid var(--color-error)',
  outlineOffset: -2,
  backgroundColor: 'color-mix(in srgb, var(--color-error) 14%, transparent)',
});
