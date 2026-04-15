import { style } from '@vanilla-extract/css';

export const layoutWrap = style({
  height: '100vh',
  maxHeight: '100dvh',
  overflow: 'hidden',
  backgroundColor: 'var(--color-background)',
  boxSizing: 'border-box',
});

export const main = style({
  flex: 1,
  minWidth: 320,
  minHeight: 0,
  maxWidth: 2400,
  padding: 16,
  overflowX: 'hidden',
  overflowY: 'auto',
  boxSizing: 'border-box',
});
