import { keyframes, style } from '@vanilla-extract/css';

const refreshSpinOnce = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

export const refreshIconSpin = style({
  display: 'block',
  animation: `${refreshSpinOnce} 0.55s ease-in-out`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});

export const visuallyHidden = style({
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
});

export const overlay = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'var(--color-overlay)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1300,
  padding: 16,
});

/** 뷰포트에 맞추되, 내용량과 무관하게 항상 동일한 높이(작은 화면에서는 뷰포트에 맞춤) */
export const box = style({
  width: 'min(1000px, calc(100vw - 40px))',
  height: 'min(620px, calc(100vh - 40px))',
  flexShrink: 0,
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-md)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const toolbar = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 14,
  padding: '12px 16px',
  borderBottom: '1px solid color-mix(in srgb, var(--color-border) 92%, transparent)',
  backgroundColor: 'color-mix(in srgb, var(--color-background) 65%, var(--color-surface))',
  flexShrink: 0,
});

export const toolbarMain = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 12,
  flex: 1,
  minWidth: 0,
});

/** 필터 탭을 담는 세그먼트 트랙 */
export const filterTabsTrack = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'stretch',
  gap: 3,
  padding: 4,
  borderRadius: 12,
  backgroundColor: 'color-mix(in srgb, var(--color-text) 4.5%, var(--color-background))',
  border: '1px solid color-mix(in srgb, var(--color-border) 88%, transparent)',
  boxShadow: 'inset 0 1px 1px color-mix(in srgb, var(--color-text) 4%, transparent)',
});

export const filterTab = style({
  padding: '7px 12px',
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '-0.02em',
  lineHeight: 1.35,
  borderRadius: 9,
  border: 'none',
  backgroundColor: 'transparent',
  color: 'var(--color-text-muted)',
  cursor: 'pointer',
  transition: 'background-color 0.16s ease, color 0.16s ease, box-shadow 0.16s ease',
  selectors: {
    '&:hover': {
      color: 'var(--color-text)',
      backgroundColor: 'color-mix(in srgb, var(--color-surface) 55%, transparent)',
    },
    '&:focus-visible': {
      outline: '2px solid var(--color-primary)',
      outlineOffset: 1,
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      transition: 'none',
    },
  },
});

export const filterTabActive = style({
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-primary)',
  boxShadow:
    '0 1px 3px color-mix(in srgb, var(--color-text) 12%, transparent), 0 0 0 1px color-mix(in srgb, var(--color-primary) 22%, transparent)',
  selectors: {
    '&:hover': {
      color: 'var(--color-primary)',
      backgroundColor: 'var(--color-surface)',
      filter: 'none',
      boxShadow:
        '0 2px 6px color-mix(in srgb, var(--color-text) 14%, transparent), 0 0 0 1px color-mix(in srgb, var(--color-primary) 28%, transparent)',
    },
  },
});

export const body = style({
  display: 'flex',
  minHeight: 0,
  flex: 1,
});

export const listCol = style({
  width: 'min(300px, 32%)',
  minWidth: 240,
  maxWidth: 320,
  borderRight: '1px solid var(--color-border)',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  backgroundColor: 'var(--color-background)',
});

export const listColHeader = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 12px 8px',
  flexShrink: 0,
});

export const listColTitle = style({
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--color-text)',
});

export const listColBadge = style({
  minWidth: 22,
  height: 20,
  padding: '0 7px',
  borderRadius: 10,
  fontSize: 11,
  fontWeight: 700,
  lineHeight: '20px',
  textAlign: 'center',
  color: '#fff',
  backgroundColor: 'var(--color-primary)',
});

/** 공통 `Input`만 사용 — 좌측 열 패딩만 유지 */
export const listSearchSlot = style({
  flexShrink: 0,
  padding: '0 12px 10px',
  width: '100%',
  boxSizing: 'border-box',
});

export const listScroll = style({
  margin: 0,
  padding: '0 10px 10px',
  listStyle: 'none',
  overflowY: 'auto',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

export const listNoResults = style({
  padding: '24px 12px',
  fontSize: 11,
  color: 'color-mix(in srgb, var(--color-text-muted) 85%, transparent)',
  textAlign: 'center',
  lineHeight: 1.45,
});

export const cardBtn = style({
  display: 'block',
  width: '100%',
  padding: '10px 10px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--color-surface)',
  textAlign: 'left',
  cursor: 'pointer',
  boxShadow: '0 1px 2px color-mix(in srgb, var(--color-text) 4%, transparent)',
  selectors: {
    '&:hover': {
      borderColor: 'color-mix(in srgb, var(--color-primary) 35%, var(--color-border))',
    },
  },
});

export const cardBtnSelected = style({
  borderColor: 'var(--color-primary)',
  boxShadow: `0 0 0 1px var(--color-primary), 0 2px 8px color-mix(in srgb, var(--color-primary) 18%, transparent)`,
});

export const cardBtnUnread = style({
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 5%, var(--color-surface))',
});

export const cardTop = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 6,
  marginBottom: 6,
});

export const cardTag = style({
  display: 'inline-block',
  padding: '2px 6px',
  borderRadius: 'var(--radius-sm)',
  fontSize: 10,
  fontWeight: 700,
  color: '#fff',
  backgroundColor: 'var(--color-primary)',
  lineHeight: 1.3,
});

export const cardRelTime = style({
  fontSize: 10,
  color: 'color-mix(in srgb, var(--color-text-muted) 88%, transparent)',
  flexShrink: 0,
});

export const cardTitle = style({
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--color-text)',
  marginBottom: 4,
  lineHeight: 1.35,
});

export const cardPreview = style({
  fontSize: 11,
  color: 'color-mix(in srgb, var(--color-text-muted) 92%, transparent)',
  lineHeight: 1.4,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

export const detailCol = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  backgroundColor: 'var(--color-surface)',
});

export const detailScroll = style({
  padding: '28px 32px',
  overflowY: 'auto',
  flex: 1,
});

export const detailMeta = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 12,
});

export const detailTag = style({
  display: 'inline-block',
  padding: '3px 8px',
  borderRadius: 'var(--radius-sm)',
  fontSize: 11,
  fontWeight: 700,
  color: '#fff',
  backgroundColor: 'var(--color-primary)',
});

export const detailRelTime = style({
  fontSize: 11,
  color: 'color-mix(in srgb, var(--color-text-muted) 90%, transparent)',
});

export const detailTitle = style({
  margin: '0 0 16px',
  fontSize: 20,
  fontWeight: 700,
  color: 'var(--color-text)',
  lineHeight: 1.35,
});

export const detailBody = style({
  margin: 0,
  fontSize: 15,
  color: 'var(--color-text)',
  lineHeight: 1.65,
  whiteSpace: 'pre-wrap',
});

export const detailFooter = style({
  padding: '16px 32px',
  borderTop: '1px solid var(--color-border)',
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10,
  flexShrink: 0,
});

export const detailPlaceholder = style({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 32,
  minHeight: 200,
});

export const detailEmpty = style({
  margin: 0,
  fontSize: 13,
  color: 'color-mix(in srgb, var(--color-text-muted) 88%, transparent)',
  textAlign: 'center',
  lineHeight: 1.5,
});

export const empty = style({
  margin: 0,
  padding: '48px 24px',
  fontSize: 13,
  color: 'color-mix(in srgb, var(--color-text-muted) 88%, transparent)',
  textAlign: 'center',
});
