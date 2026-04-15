import { style, globalStyle } from '@vanilla-extract/css';

export { page } from '@/style/PageStyles.css';
export { filterSection, filterRow, filterField } from '@/style/FilterStyles.css';

export const filterFieldKeyword = style({
  flex: '1 1 260px',
  minWidth: 200,
  maxWidth: 420,
});

export const filterFieldHospital = style({
  flex: '1 1 240px',
  minWidth: 200,
  maxWidth: 320,
});

export const filterFieldAddress = style({
  flex: '1 1 220px',
  minWidth: 180,
  maxWidth: 400,
});

globalStyle(
  `${filterFieldKeyword} label, ${filterFieldHospital} label, ${filterFieldAddress} label`,
  {
    display: 'block',
    marginBottom: 4,
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--color-text)',
  },
);

export const layoutWrap = style({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  gap: 16,
  alignItems: 'stretch',
});

export const leftCardLayout = style({
  flex: 1,
  minWidth: 320,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  marginBottom: 0,
});

export const listWrap = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  padding: 8,
  fontSize: 14,
});
globalStyle(`${listWrap} table`, { minWidth: 742 });
globalStyle(`${listWrap} th:first-child, ${listWrap} td:first-child`, {
  width: 152,
  minWidth: 152,
  maxWidth: 152,
});
globalStyle(`${listWrap} th, ${listWrap} td`, { padding: 8, borderRight: 'none' });
globalStyle(`${listWrap} th`, { fontSize: 13 });

export const rightCardLayout = style({
  width: 360,
  flexShrink: 0,
  marginBottom: 0,
  overflow: 'auto',
});

export const formField = style({
  marginBottom: 12,
});
globalStyle(`${formField} label`, {
  display: 'block',
  marginBottom: 4,
  fontSize: 13,
  fontWeight: 500,
});
globalStyle(`${formField} textarea:focus`, {
  outline: 'none',
  borderColor: 'var(--color-primary)',
});

export const textarea = style({
  display: 'block',
  width: '100%',
  boxSizing: 'border-box',
  padding: '8px 10px',
  fontSize: 14,
  borderRadius: 'var(--radius-md)',
  border: '2px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text)',
  resize: 'vertical',
  minHeight: 72,
});

export const formActions = style({
  display: 'flex',
  gap: 8,
  marginTop: 16,
  paddingTop: 12,
  borderTop: '1px solid var(--color-border)',
});

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
  minWidth: 0,
  display: 'block',
  padding: '6px 8px',
  fontSize: 13,
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
