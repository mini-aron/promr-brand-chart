import { style, globalStyle } from '@vanilla-extract/css';

export { page } from '@/style/PageStyles.css';

export const backLink = style({
  color: 'var(--color-primary)',
  fontWeight: 600,
});

export const selectCard = style({
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  padding: 16,
  marginBottom: 16,
  boxShadow: 'var(--shadow-sm)',
});

export const selectRow = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: 16,
  alignItems: 'flex-start',
});

export const field = style({});

globalStyle(`${field} label`, {
  display: 'block',
  marginBottom: 8,
  fontWeight: 600,
  fontSize: 15,
  color: 'var(--color-text)',
});
globalStyle(`${field} select`, {
  display: 'block',
  width: '100%',
  minHeight: 48,
  padding: '0 12px',
  fontSize: 15,
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text)',
  cursor: 'pointer',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 12px center',
  paddingRight: 36,
});
globalStyle(`${field} select:hover`, { borderColor: 'var(--color-primary)' });
globalStyle(`${field} select:focus`, {
  outline: 'none',
  borderColor: 'var(--color-primary)',
  boxShadow: '0 0 0 3px color-mix(in srgb, var(--color-primary) 12%, transparent)',
});
globalStyle(`${field} .field-hint`, {
  marginTop: 4,
  fontSize: 13,
  color: 'var(--color-text-muted)',
});

export const dropzoneBase = style({
  border: '2px dashed var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  padding: 24,
  textAlign: 'center',
  backgroundColor: 'var(--color-surface)',
  transition: 'background-color 0.2s, border-color 0.2s',
  cursor: 'pointer',
  selectors: { '&:hover': { borderColor: 'var(--color-primary)', backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, transparent)' } },
});

export const dropzoneDrag = style({
  border: '2px dashed var(--color-primary)',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, transparent)',
});

export const dropzoneDisabled = style({
  border: '2px dashed var(--color-border)',
  backgroundColor: 'var(--color-background)',
  cursor: 'not-allowed',
  opacity: 0.7,
});

export const sectionTitle = style({
  fontSize: 16,
  fontWeight: 600,
  marginBottom: 12,
  color: 'var(--color-text)',
});

export const sectionTitle2 = style({
  fontSize: 16,
  fontWeight: 600,
  marginBottom: 8,
  color: 'var(--color-text)',
});

export const targetCount = style({
  marginTop: 8,
  fontSize: 14,
  color: 'var(--color-text-muted)',
});
export const targetCountStrong = style({ color: 'var(--color-text)' });

export const uploadLabel = style({
  display: 'block',
  marginBottom: 4,
  fontSize: 15,
  color: 'var(--color-text-muted)',
});

export const fileInputHidden = style({ display: 'none' });

export const sectionWrap = style({ marginBottom: 16 });

export const previewGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
  gap: 8,
  marginTop: 8,
});

globalStyle(`${previewGrid} img`, { width: '100%', height: 120, objectFit: 'cover', borderRadius: 'var(--radius-sm)' });

export const previewItemWrap = style({ position: 'relative' });

globalStyle(`${previewItemWrap} img`, { display: 'block', width: '100%', height: 120, objectFit: 'cover', borderRadius: 'var(--radius-sm)' });

export const removeImageBtn = style({
  position: 'absolute',
  top: 4,
  right: 4,
  width: 24,
  height: 24,
  padding: 0,
  border: 'none',
  borderRadius: '50%',
  backgroundColor: 'var(--color-overlay-strong)',
  color: 'var(--color-button-text)',
  fontSize: 16,
  lineHeight: 1,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  selectors: {
    '&:hover': { backgroundColor: 'var(--color-error)' },
    '&:focus': { outline: 'none' },
  },
});

export const buttonWrap = style({ marginTop: 12 });
export const success = style({
  marginTop: 8,
  padding: 8,
  backgroundColor: 'color-mix(in srgb, var(--color-success) 8%, transparent)',
  color: 'var(--color-success)',
  borderRadius: 'var(--radius-md)',
});
