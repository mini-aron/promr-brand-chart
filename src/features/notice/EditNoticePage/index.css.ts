import { style, globalStyle } from '@vanilla-extract/css';

export const card = style({
  alignSelf: 'stretch',
  width: '100%',
  marginTop: 24,
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-sm)',
  overflow: 'hidden',
});

export const headerSection = style({
  padding: '20px 24px',
  borderBottom: '1px solid var(--color-border)',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 4%, transparent)',
});

export const backButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  marginBottom: 16,
  padding: '6px 0',
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--color-primary)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  transition: 'opacity 0.15s',
  ':hover': { opacity: 0.85 },
});

export const metaRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  marginBottom: 16,
  fontSize: 13,
});

export const metaBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px 10px',
  borderRadius: 'var(--radius-sm)',
  fontSize: 12,
  fontWeight: 500,
  backgroundColor: 'color-mix(in srgb, var(--color-border) 50%, transparent)',
  color: 'var(--color-text-muted)',
});

export const titleInput = style({
  width: '100%',
  fontSize: 22,
  fontWeight: 700,
  lineHeight: 1.35,
  border: 'none',
  borderBottom: '2px solid var(--color-border)',
  borderRadius: 0,
  padding: '12px 0',
  marginBottom: 4,
  color: 'var(--color-text)',
  backgroundColor: 'transparent',
  transition: 'border-color 0.2s',
  ':focus': {
    outline: 'none',
    borderBottomColor: 'var(--color-primary)',
    boxShadow: 'none',
  },
  '::placeholder': {
    color: 'var(--color-text-muted)',
  },
});

export const titleDisplay = style({
  margin: 0,
  marginTop: 8,
  fontSize: 22,
  fontWeight: 700,
  lineHeight: 1.4,
  color: 'var(--color-text)',
});

/** 제목 아래: 작성자 | 작성일 space-between */
export const authorDateRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  marginTop: 10,
  flexWrap: 'wrap',
  rowGap: 8,
});

export const authorSide = style({
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--color-text-muted)',
});

export const dateSide = style({
  fontSize: 14,
  fontWeight: 500,
  color: 'var(--color-text-muted)',
  textAlign: 'right',
});

/** 수정 버튼 래퍼 — Button 기본 size보다 패딩·폰트 확대 */
export const editButtonWrap = style({});

globalStyle(`${editButtonWrap} button`, {
  padding: '10px 16px',
  fontSize: 14,
  minHeight: 40,
  gap: 8,
});

export const contentSection = style({
  padding: '24px 24px 32px',
});

export const contentArea = style({
  width: '100%',
  minHeight: 360,
  padding: '20px 0',
  fontSize: 15,
  lineHeight: 1.8,
  border: 'none',
  resize: 'vertical',
  fontFamily: 'inherit',
  color: 'var(--color-text)',
  backgroundColor: 'transparent',
  ':focus': {
    outline: 'none',
  },
  '::placeholder': {
    color: 'var(--color-text-muted)',
  },
});

/** 읽기 전용 본문 */
export const contentView = style({
  margin: 0,
  padding: 0,
  fontSize: 15,
  lineHeight: 1.8,
  fontFamily: 'inherit',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  color: 'var(--color-text)',
});

/** 수정 모드: 높이 자동, 크기 조절 비활성 */
export const contentAreaEdit = style({
  width: '100%',
  minHeight: 120,
  padding: '16px 0',
  fontSize: 15,
  lineHeight: 1.8,
  border: 'none',
  resize: 'none',
  overflow: 'hidden',
  fontFamily: 'inherit',
  color: 'var(--color-text)',
  backgroundColor: 'transparent',
  boxSizing: 'border-box',
  ':focus': {
    outline: 'none',
  },
  '::placeholder': {
    color: 'var(--color-text-muted)',
  },
});

globalStyle(`${contentSection} pre`, {
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  margin: 0,
});

export const actionRow = style({
  display: 'flex',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: 8,
  marginTop: 28,
  paddingTop: 20,
  borderTop: '1px solid var(--color-border)',
});
