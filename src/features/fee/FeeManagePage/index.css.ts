import { style, globalStyle } from '@vanilla-extract/css';

export { page } from '@/style/PageStyles.css';
export { filterSection, filterRow, filterField } from '@/style/FilterStyles.css';

export const layoutWrap = style({
  display: 'flex',
  gap: 16,
  alignItems: 'stretch',
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  overflow: 'hidden',
});

export const leftCardLayout = style({
  flex: 1,
  minWidth: 320,
  minHeight: 0,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  marginBottom: 0,
});

export const leftCardWide = style({
  minWidth: 420,
});

export const feeFilterSection = style({
  padding: 12,
  margin: 8,
  marginBottom: 12,
  backgroundColor: 'var(--color-background)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
});

export const filterRowRight = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  marginLeft: 'auto',
});

export const filterRowInner = style({ display: 'flex', alignItems: 'center', gap: 4 });

export const tableWrap = style({
  flex: 1,
  minHeight: 0,
  padding: 8,
  paddingBottom: 16,
  overflow: 'auto',
});

export const rightPanelLayout = style({
  width: 360,
  flexShrink: 0,
  alignSelf: 'flex-start',
  minWidth: 0,
  overflow: 'hidden',
  boxSizing: 'border-box',
  marginBottom: 0,
});

export const rightPanelWide = style({
  width: 480,
});

export const rightPanelNarrow = style({
  width: 300,
});

export const tableTypeButtons = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  marginBottom: 12,
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

export const formField = style({
  marginBottom: 12,
  minWidth: 0,
  maxWidth: '100%',
});
globalStyle(`${formField} label`, {
  display: 'block',
  marginBottom: 4,
  fontWeight: 600,
  fontSize: 13,
});
globalStyle(`${formField} input, ${formField} select, ${formField} textarea`, {
  width: '100%',
  maxWidth: '100%',
  minWidth: 0,
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
globalStyle(`${excelUploadZone} .upload-hint`, {
  fontSize: 11,
  color: 'var(--color-text-muted)',
  opacity: 0.8,
});
globalStyle(`${excelUploadZone}[data-has-file="true"]`, {
  borderColor: 'var(--color-primary)',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 5%, transparent)',
});
globalStyle(`${excelUploadZone}[data-has-file="true"] .upload-icon`, {
  color: 'var(--color-primary)',
});
globalStyle(`${excelUploadZone}[data-has-file="true"] .upload-text`, {
  color: 'var(--color-text)',
});

export const productSearchInput = style({
  minHeight: 36,
  width: 160,
  fontSize: 13,
  padding: '0 8px',
});
export const sectionTitle = style({ fontSize: 16, marginBottom: 12 });
export const feePercent = style({ fontSize: 14, color: 'var(--color-text-muted)' });

export const fixedFeeToggleBadge = style({
  display: 'inline-block',
  minWidth: 44,
  padding: '4px 10px',
  fontSize: 12,
  fontWeight: 600,
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text-muted)',
  textAlign: 'center',
  transition: 'background-color 0.15s, border-color 0.15s, color 0.15s',
});
export const fixedFeeToggleBadgeClickable = style({
  selectors: {
    'td:hover &': {
      backgroundColor: 'var(--color-background)',
      borderColor: 'var(--color-primary)',
      color: 'var(--color-primary)',
    },
  },
});
export const fixedFeeToggleBadgeActive = style({
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
  borderColor: 'var(--color-primary)',
  color: 'var(--color-primary)',
  selectors: {
    'td:hover &': {
      backgroundColor: 'color-mix(in srgb, var(--color-primary) 18%, transparent)',
    },
  },
});

export const addButtonFull = style({ width: '100%', maxWidth: '100%', minWidth: 0 });
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

export const detailHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 12,
});
globalStyle(`${detailHeader} h3`, { marginBottom: 0 });

export const tieredFeeTableWrap = style({ fontSize: 13 });
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

export const hospitalFeeTableWrap = style({
  width: '100%',
  minHeight: 80,
  maxHeight: 220,
  overflowY: 'auto',
  fontSize: 13,
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
});

export const hospitalFeeTableWrapCompact = style({
  fontSize: 12,
});
const hospitalFeeTableBase = `.${hospitalFeeTableWrap}, .${hospitalFeeTableWrapCompact}`;
globalStyle(`${hospitalFeeTableBase} table`, { tableLayout: 'fixed', width: '100%' });
globalStyle(`${hospitalFeeTableBase} th, ${hospitalFeeTableBase} td`, {
  padding: '6px 8px',
  verticalAlign: 'middle',
  borderBottom: '1px solid var(--color-border)',
});
globalStyle(`.${hospitalFeeTableWrap} td:nth-of-type(4)`, { whiteSpace: 'normal', maxWidth: 140 });
globalStyle(`.${hospitalFeeTableWrapCompact} td:nth-of-type(4)`, {
  whiteSpace: 'normal',
  maxWidth: 'none',
});
globalStyle(`${hospitalFeeTableBase} th`, {
  backgroundColor: 'var(--color-background)',
  fontWeight: 600,
  fontSize: 12,
  position: 'sticky',
  top: 0,
  zIndex: 1,
});
globalStyle(`${hospitalFeeTableBase} input`, {
  width: '100%',
  minWidth: 50,
  padding: '4px 6px',
  fontSize: 12,
});
globalStyle(`.${hospitalFeeTableWrapCompact} th, .${hospitalFeeTableWrapCompact} td`, {
  padding: '3px 6px',
  fontSize: 12,
});
globalStyle(`.${hospitalFeeTableWrapCompact} th`, { fontSize: 11 });
globalStyle(`.${hospitalFeeTableWrapCompact} input`, { padding: '2px 4px', fontSize: 11 });
