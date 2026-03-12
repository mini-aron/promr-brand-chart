import { style, globalStyle, styleVariants } from '@vanilla-extract/css';

export const page = style({
  width: '100%',
  minWidth: 0,
});

globalStyle(`${page} h1`, { marginBottom: 8 });
globalStyle(`${page} p`, { marginBottom: 16 });

export const twoColLayout = style({
  display: 'grid',
  gridTemplateColumns: '1fr 400px',
  gap: 16,
  alignItems: 'start',
  '@media': { '(max-width: 900px)': { gridTemplateColumns: '1fr' } },
});

export const card = style({
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  padding: 16,
  marginBottom: 16,
  boxShadow: 'var(--shadow-sm)',
});

export const sectionTitle = style({
  fontSize: 16,
  fontWeight: 600,
  marginBottom: 12,
  color: 'var(--color-text)',
});

export const field = style({
  marginBottom: 12,
});

globalStyle(`${field} label`, {
  display: 'block',
  marginBottom: 4,
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--color-text)',
});
globalStyle(`${field} input`, {
  width: '100%',
  minHeight: 44,
  padding: '0 8px',
  fontSize: 14,
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  boxSizing: 'border-box',
});
globalStyle(`${field} input:focus`, {
  outline: 'none',
  borderColor: 'var(--color-primary)',
  boxShadow: '0 0 0 2px color-mix(in srgb, var(--color-primary) 12%, transparent)',
});
globalStyle(`${field} input::placeholder`, { color: 'var(--color-text-muted)' });
globalStyle(`${field} textarea`, {
  width: '100%',
  minHeight: 88,
  padding: 8,
  fontSize: 14,
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  boxSizing: 'border-box',
  resize: 'vertical',
});
globalStyle(`${field} textarea:focus`, {
  outline: 'none',
  borderColor: 'var(--color-primary)',
  boxShadow: '0 0 0 2px color-mix(in srgb, var(--color-primary) 12%, transparent)',
});
globalStyle(`${field} textarea::placeholder`, { color: 'var(--color-text-muted)' });

export const hospitalList = style({
  maxHeight: 240,
  overflow: 'auto',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  marginBottom: 12,
});

globalStyle(`${hospitalList} button`, {
  display: 'block',
  width: '100%',
  padding: 8,
  textAlign: 'left',
  border: 'none',
  borderBottom: '1px solid var(--color-border)',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  fontSize: 14,
  color: 'var(--color-text)',
});
globalStyle(`${hospitalList} button:hover`, { backgroundColor: 'var(--color-background)' });
globalStyle(`${hospitalList} button:last-of-type`, { borderBottom: 'none' });
globalStyle(`${hospitalList} button[data-selected="true"]`, {
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, transparent)',
  color: 'var(--color-primary)',
  fontWeight: 600,
});

export const hospitalName = style({ display: 'block' });
export const hospitalAccountCode = style({ marginLeft: 8, fontSize: 13, color: 'var(--color-text-muted)' });
export const hospitalAddress = style({ display: 'block', marginTop: 4, fontSize: 12, color: 'var(--color-text-muted)' });

export const hospitalListEmpty = style({ padding: 8 });
globalStyle(`${hospitalListEmpty} p`, {
  color: 'var(--color-text-muted)',
  fontSize: 14,
  marginBottom: 8,
});

export const successMsg = style({
  marginTop: 8,
  padding: 8,
  backgroundColor: 'color-mix(in srgb, var(--color-success) 8%, transparent)',
  color: 'var(--color-success)',
  borderRadius: 'var(--radius-md)',
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

export const modalContent = style({
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  padding: 16,
  maxWidth: 440,
  width: '100%',
  maxHeight: '90vh',
  overflow: 'auto',
  boxShadow: 'var(--shadow-md)',
});

export const modalTitle = style({
  margin: 0,
  marginBottom: 12,
  fontSize: 18,
  fontWeight: 600,
  color: 'var(--color-text)',
});

export const modalActions = style({
  display: 'flex',
  gap: 8,
  justifyContent: 'flex-end',
  marginTop: 12,
});

export const filterRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  marginBottom: 12,
});

globalStyle(`${filterRow} > *`, { minWidth: 140 });

export const filterInputMaxWidth = style({ maxWidth: 200 });
export const filterPharmaWidth = style({ width: 180 });
export const filterStatusWidth = style({ width: 130 });

export const statusBadge = styleVariants({
  pending: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
    backgroundColor: 'color-mix(in srgb, var(--color-primary) 6%, transparent)',
    color: 'var(--color-primary)',
  },
  approved: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
    backgroundColor: 'color-mix(in srgb, var(--color-success) 6%, transparent)',
    color: 'var(--color-success)',
  },
  rejected: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
    backgroundColor: 'color-mix(in srgb, var(--color-error) 6%, transparent)',
    color: 'var(--color-error)',
  },
});

export const filterRequestTableWrap = style({
  fontSize: 14,
});

globalStyle(`${filterRequestTableWrap} th, ${filterRequestTableWrap} td`, {
  padding: 8,
  borderRight: 'none',
});
