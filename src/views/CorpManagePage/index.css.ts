import { style, globalStyle } from '@vanilla-extract/css';

export { page } from '@/style/PageStyles.css';

export const layoutWrap = style({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  gap: 16,
  alignItems: 'stretch',
});

export const leftCard = style({
  flex: 1,
  minWidth: 320,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-sm)',
});

export const listWrap = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  padding: 8,
  fontSize: 14,
});
globalStyle(`${listWrap} table`, { minWidth: 560 });
globalStyle(`${listWrap} th, ${listWrap} td`, { padding: 8, borderRight: 'none' });
globalStyle(`${listWrap} th`, { fontSize: 13 });

export const rightPanel = style({
  width: 440,
  flexShrink: 0,
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  padding: 16,
  boxShadow: 'var(--shadow-sm)',
  alignSelf: 'flex-start',
});

export const sectionTitle = style({ fontSize: 16, marginBottom: 8 });
export const sectionDesc = style({ fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 16 });
export const detailHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 12,
});
globalStyle(`${detailHeader} h3`, { marginBottom: 0 });
export const rowSelected = style({
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 14%, transparent)',
});
export const formField = style({ marginBottom: 12 });
globalStyle(`${formField} label`, {
  display: 'block',
  marginBottom: 4,
  fontSize: 13,
  fontWeight: 600,
});
globalStyle(`${formField} input, ${formField} select`, {
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  padding: '8px 10px',
  fontSize: 14,
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text)',
});
globalStyle(`${formField} input:focus, ${formField} select:focus`, {
  outline: 'none',
  borderColor: 'var(--color-primary)',
});
export const addButtonFull = style({ width: '100%' });

export const inviteCodeBox = style({
  padding: 12,
  backgroundColor: 'var(--color-background)',
  borderRadius: 'var(--radius-md)',
  marginBottom: 12,
});
export const inviteCodeLabel = style({ display: 'block', fontSize: 12, color: 'var(--color-text-muted)', marginBottom: 4 });
export const inviteCode = style({ flex: 1, fontSize: 16, fontWeight: 600, letterSpacing: 1 });
export const copyIconBtn = style({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 6,
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  background: 'transparent',
  color: 'var(--color-text-muted)',
  cursor: 'pointer',
});
globalStyle(`${copyIconBtn}:hover`, {
  backgroundColor: 'var(--color-background)',
  color: 'var(--color-primary)',
});

export const emailInput = style({
  flex: 1,
  minWidth: 0,
  padding: '8px 10px',
  fontSize: 14,
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--color-border)',
});
globalStyle(`${emailInput}:focus`, {
  outline: 'none',
  borderColor: 'var(--color-primary)',
});
export const mailButton = style({ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 });
export const removeEmailBtn = style({
  flexShrink: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 6,
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  background: 'transparent',
  color: 'var(--color-text-muted)',
  cursor: 'pointer',
});
globalStyle(`${removeEmailBtn}:hover`, {
  backgroundColor: 'var(--color-background)',
  color: 'var(--color-error, #dc2626)',
});
export const resetLink = style({ marginTop: 12, width: '100%' });

export const tieredFeeTableWrap = style({
  fontSize: 13,
});
globalStyle(`${tieredFeeTableWrap} table`, { tableLayout: 'fixed', width: '100%' });
globalStyle(`${tieredFeeTableWrap} th, ${tieredFeeTableWrap} td`, {
  padding: '6px 8px',
  verticalAlign: 'middle',
  whiteSpace: 'normal',
});
globalStyle(`${tieredFeeTableWrap} input`, {
  width: '100%',
  minWidth: 60,
  padding: '4px 6px',
  fontSize: 13,
});
export const tieredFeeAddBtn = style({ marginTop: 8 });

const statusBase = style({
  display: 'inline-block',
  padding: '4px 8px',
  fontSize: 12,
  fontWeight: 600,
  borderRadius: 'var(--radius-sm)',
});
export const statusPending = style([
  statusBase,
  {
    backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
    color: 'var(--color-primary)',
  },
]);
export const statusAccepted = style([
  statusBase,
  {
    backgroundColor: 'color-mix(in srgb, var(--color-success) 10%, transparent)',
    color: 'var(--color-success)',
  },
]);
