import { style, globalStyle } from '@vanilla-extract/css';

export { page } from '@/style/PageStyles.css';
export { filterSection, filterRow, filterField } from '@/style/FilterStyles.css';

/** 병의원 관리(pharma/hospitals) 법인명 필드와 동일 flex */
export const filterFieldCorpName = style({
  flex: '1 1 240px',
  minWidth: 200,
  maxWidth: 320,
});

globalStyle(`${filterFieldCorpName} label`, {
  display: 'block',
  marginBottom: 4,
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--color-text)',
});

export const headerActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  alignItems: 'center',
  marginBottom: 16,
});

export const headerActionBtn = style({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
});

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

export const listToolbar = style({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: 8,
  paddingBottom: 8,
  marginBottom: 4,
  position: 'sticky',
  top: 0,
  zIndex: 2,
  backgroundColor: 'var(--color-surface)',
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
globalStyle(`${listWrap} th:first-child, ${listWrap} td:first-child`, {
  width: 160,
  maxWidth: 160,
});

export const rightPanelLayout = style({
  width: 440,
  flexShrink: 0,
  marginBottom: 0,
  alignSelf: 'flex-start',
});
export const sectionDesc = style({
  fontSize: 13,
  color: 'var(--color-text-muted)',
  marginBottom: 16,
});
export const detailHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  marginBottom: 12,
});

export const detailSection = style({ marginBottom: 16 });
export const detailLabel = style({
  display: 'block',
  fontSize: 12,
  color: 'var(--color-text-muted)',
  marginBottom: 4,
});
export const detailValue = style({ fontSize: 14, fontWeight: 500 });

export const feeManageLink = style({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  marginTop: 8,
  padding: '10px 12px',
  fontSize: 14,
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-primary)',
  textDecoration: 'none',
  transition: 'background-color 0.2s',
});
globalStyle(`${feeManageLink}:hover`, {
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
});

export const rowSelected = style({
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 14%, transparent)',
});

/** 법인 매핑코드가 저장값과 다를 때 행 배경 */
export const rowInviteCodeDirty = style({
  backgroundColor: 'color-mix(in srgb, var(--color-warning, #f59e0b) 18%, var(--color-surface))',
});

/** 선택됨 + 매핑코드 수정 중: 선택 배경 유지 + 왼쪽 강조 */
export const rowSelectedWithDirtyInvite = style([
  rowSelected,
  {
    boxShadow: 'inset 4px 0 0 var(--color-warning, #f59e0b)',
  },
]);
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
export const inviteCodeLabel = style({
  display: 'block',
  fontSize: 12,
  color: 'var(--color-text-muted)',
  marginBottom: 4,
});
export const inviteLink = style({
  flex: 1,
  fontSize: 14,
  color: 'var(--color-primary)',
  textDecoration: 'underline',
  wordBreak: 'break-all',
});
globalStyle(`${inviteLink}:hover`, {
  textDecoration: 'underline',
  color: 'color-mix(in srgb, var(--color-primary) 80%, black)',
});
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

export const emailSectionLabel = style({
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--color-text)',
  marginBottom: 4,
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

export const inviteCodeTableInput = style({
  width: '100%',
  minWidth: 0,
  padding: '4px 6px',
  fontSize: 12,
});

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
