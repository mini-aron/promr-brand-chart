import { style, globalStyle } from '@vanilla-extract/css';

export const wrapper = style({
  position: 'relative',
  display: 'inline-block',
  paddingRight: 22,
});

export const iconWrap = style({
  position: 'absolute',
  top: 0,
  right: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 18,
  height: 18,
  borderRadius: '50%',
  color: 'var(--color-text-muted)',
  cursor: 'help',
  flexShrink: 0,
});
globalStyle(`${iconWrap}:hover`, {
  color: 'var(--color-primary)',
});

export const tooltipBubble = style({
  position: 'absolute',
  top: '100%',
  right: 0,
  marginTop: 6,
  padding: '8px 12px',
  minWidth: 160,
  maxWidth: 400,
  fontSize: 12,
  lineHeight: 1.4,
  color: '#fff',
  backgroundColor: 'rgba(15, 23, 42, 0.9)',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  boxShadow: 'var(--shadow-md)',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  zIndex: 100,
  pointerEvents: 'none',
  opacity: 0,
  visibility: 'hidden',
  transition: 'opacity 0.15s, visibility 0.15s',
});
globalStyle(`${iconWrap}:hover + ${tooltipBubble}`, {
  opacity: 1,
  visibility: 'visible',
});
