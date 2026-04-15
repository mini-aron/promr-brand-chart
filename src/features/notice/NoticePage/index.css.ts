import { style, globalStyle } from '@vanilla-extract/css';

/** 검색 + 조회는 좁은 클러스터, 작성은 별도 액션 그룹(버튼이 작아 보이지 않게 분리) */
export const toolBarRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  rowGap: 14,
  marginBottom: 16,
  padding: '16px 18px',
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  boxShadow: 'var(--shadow-sm)',
});

/** 검색·제약사 필터와 함께 쓰일 때 좌측 묶음 */
export const toolBarLeft = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 14,
  rowGap: 10,
  flex: '1 1 auto',
  minWidth: 0,
});

/** 검색 입력 + 조회만 — 가로 과도 확장 방지 */
export const searchCluster = style({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  flex: '1 1 auto',
  minWidth: 0,
  maxWidth: 400,
});

export const pharmaToolbarField = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
  flexShrink: 0,
});

export const pharmaToolbarLabel = style({
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '0.03em',
  color: 'var(--color-text-muted)',
  whiteSpace: 'nowrap',
});

export const pharmaSelectWrap = style({
  width: 200,
  minWidth: 160,
  maxWidth: 'min(280px, 100vw)',
});

export const pharmaToolbarEmpty = style({
  margin: 0,
  fontSize: 12,
  lineHeight: 1.45,
  color: 'var(--color-text-muted)',
});

export const searchInputWrap = style({
  flex: '1 1 auto',
  minWidth: 0,
  maxWidth: 240,
  width: '100%',
});

export const actionGroup = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 10,
  flexShrink: 0,
});

export const mainColumn = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  gap: 0,
});

export const tabRow = style({
  display: 'flex',
  gap: 4,
  marginBottom: 12,
  padding: 4,
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'color-mix(in srgb, var(--color-border) 40%, transparent)',
});

export const tab = style({
  flex: 1,
  padding: '10px 14px',
  fontSize: 13,
  fontWeight: 600,
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
  color: 'var(--color-text-muted)',
  backgroundColor: 'transparent',
  transition: 'background-color 0.15s, color 0.15s',
  ':hover': {
    color: 'var(--color-text)',
  },
});

export const tabActive = style({
  color: 'var(--color-text)',
  backgroundColor: 'var(--color-surface)',
  boxShadow: 'var(--shadow-sm)',
});

export const noticeTableWrap = style({
  flex: 1,
  minHeight: 0,
  borderRadius: 'var(--radius-md)',
  overflow: 'hidden',
});

export const colNo = style({});
export const colTitle = style({});
export const colTitleText = style({
  fontWeight: 500,
  color: 'var(--color-text)',
});

export const colMuted = style({
  color: 'var(--color-text-muted)',
  fontSize: 12,
});

export const searchIcon = style({
  marginLeft: 6,
  verticalAlign: 'middle',
  flexShrink: 0,
});

globalStyle(`${noticeTableWrap} table`, {
  fontSize: 13,
});

globalStyle(`${noticeTableWrap} th, ${noticeTableWrap} td`, {
  padding: '12px 14px',
  verticalAlign: 'middle',
});

globalStyle(`${noticeTableWrap} thead th`, {
  fontSize: 12,
  letterSpacing: '0.02em',
  color: 'var(--color-text-muted)',
  textTransform: 'none',
  borderBottom: '1px solid var(--color-border)',
});

globalStyle(`${noticeTableWrap} tbody tr`, {
  transition: 'background-color 0.12s ease',
});

globalStyle(`${noticeTableWrap} tbody tr:last-child td`, {
  borderBottom: 'none',
});

globalStyle(`${noticeTableWrap} .${colNo}`, {
  width: 44,
  minWidth: 44,
  textAlign: 'center',
  fontVariantNumeric: 'tabular-nums',
  color: 'var(--color-text-muted)',
});

globalStyle(`${noticeTableWrap} .${colTitle}`, {
  textAlign: 'left',
});
