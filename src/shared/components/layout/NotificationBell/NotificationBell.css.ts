import { keyframes, style } from '@vanilla-extract/css';

/** 안 읽은 알림 있을 때 종 흔들림(한 사이클 앞부분만 움직임) */
const bellWiggle = keyframes({
  '0%, 100%': { transform: 'rotate(0deg)' },
  '5%': { transform: 'rotate(14deg)' },
  '10%': { transform: 'rotate(-12deg)' },
  '15%': { transform: 'rotate(10deg)' },
  '20%': { transform: 'rotate(-8deg)' },
  '25%': { transform: 'rotate(4deg)' },
  '30%': { transform: 'rotate(0deg)' },
});

/** 종과 동기: 배경 붉기 맥동 + 아주 약한 소프트 글로우 */
const redGlowPulse = keyframes({
  '0%, 100%': {
    boxShadow: '0 0 5px color-mix(in srgb, var(--color-error) 6%, transparent)',
    backgroundColor: 'color-mix(in srgb, var(--color-error) 8%, transparent)',
  },
  '25%': {
    boxShadow: '0 0 10px 1px color-mix(in srgb, var(--color-error) 12%, transparent)',
    backgroundColor: 'color-mix(in srgb, var(--color-error) 22%, transparent)',
  },
  '50%': {
    boxShadow: '0 0 7px color-mix(in srgb, var(--color-error) 9%, transparent)',
    backgroundColor: 'color-mix(in srgb, var(--color-error) 16%, transparent)',
  },
});

export const wrap = style({
  position: 'relative',
  flexShrink: 0,
});

export const trigger = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  padding: 0,
  border: 'none',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'transparent',
  color: 'var(--color-text)',
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      backgroundColor: 'var(--color-background)',
    },
    '&[data-unread="true"]': {
      animation: `${redGlowPulse} 2.8s ease-in-out infinite`,
    },
    '&[data-unread="true"]:hover': {
      backgroundColor: 'color-mix(in srgb, var(--color-error) 26%, transparent)',
    },
    '&:focus-visible': {
      outline: '2px solid var(--color-primary)',
      outlineOffset: 2,
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      selectors: {
        '&[data-unread="true"]': {
          animation: 'none',
          backgroundColor: 'color-mix(in srgb, var(--color-error) 14%, transparent)',
          boxShadow: 'none',
        },
      },
    },
  },
});

export const bellIcon = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transformOrigin: 'top center',
});

export const bellIconWiggle = style({
  animation: `${bellWiggle} 2.8s ease-in-out infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': {
      animation: 'none',
    },
  },
});

export const badge = style({
  position: 'absolute',
  top: 2,
  right: 2,
  minWidth: 18,
  height: 18,
  padding: '0 5px',
  borderRadius: 9,
  fontSize: 11,
  fontWeight: 700,
  lineHeight: '18px',
  textAlign: 'center',
  color: '#fff',
  backgroundColor: 'var(--color-error)',
  pointerEvents: 'none',
});

/** 종 버튼 우측에 붙는 알림 패널(메인 영역 위로 겹침) */
export const panel = style({
  position: 'absolute',
  left: '100%',
  top: 0,
  zIndex: 200,
  marginLeft: 8,
  width: 300,
  maxHeight: 360,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  boxShadow: 'var(--shadow-md)',
  overflow: 'hidden',
});

export const panelActions = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  padding: '8px 12px',
  borderBottom: '1px solid var(--color-border)',
});

export const panelActionsSpacer = style({
  flex: 1,
  minWidth: 0,
});

export const markAllBtn = style({
  padding: '4px 8px',
  fontSize: 12,
  fontWeight: 600,
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'transparent',
  color: 'var(--color-primary)',
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
    },
  },
});

export const list = style({
  margin: 0,
  padding: 0,
  listStyle: 'none',
  overflowY: 'auto',
  flex: 1,
  minHeight: 0,
});

export const item = style({
  display: 'block',
  width: '100%',
  padding: '10px 12px',
  border: 'none',
  borderBottom: '1px solid var(--color-border)',
  backgroundColor: 'transparent',
  textAlign: 'left',
  cursor: 'pointer',
  selectors: {
    '&:last-child': { borderBottom: 'none' },
    '&:hover': {
      backgroundColor: 'var(--color-background)',
    },
  },
});

export const itemUnread = style({
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 6%, transparent)',
});

export const itemTitle = style({
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--color-text)',
  marginBottom: 4,
});

export const itemBody = style({
  fontSize: 12,
  color: 'var(--color-text-muted)',
  lineHeight: 1.45,
  marginBottom: 6,
});

export const itemTime = style({
  fontSize: 11,
  color: 'var(--color-text-muted)',
});

export const viewAllBtn = style({
  padding: '6px 10px',
  fontSize: 12,
  fontWeight: 600,
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'transparent',
  color: 'var(--color-primary)',
  cursor: 'pointer',
  selectors: {
    '&:hover': {
      backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
    },
  },
});

export const empty = style({
  padding: '24px 16px',
  fontSize: 13,
  color: 'var(--color-text-muted)',
  textAlign: 'center',
});
