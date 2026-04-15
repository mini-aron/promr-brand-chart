import { style } from '@vanilla-extract/css';

export { page } from '@/style/PageStyles.css';

export const mainLayout = style({
  display: 'flex',
  gap: 12,
});

export const rightColumn = style({
  flex: 1,
  maxWidth: 520,
  display: 'flex',
  flexDirection: 'column',
});

export const reviewRightCard = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
});

export const reviewRightInner = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
});
