import { style, globalStyle } from '@vanilla-extract/css';

export const emptyCell = style({
  padding: 16,
  textAlign: 'center',
});

export const rowsClickable = style({});
globalStyle(`${rowsClickable} tbody tr`, {
  cursor: 'pointer',
});
