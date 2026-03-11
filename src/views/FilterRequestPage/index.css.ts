import { style, globalStyle } from '@vanilla-extract/css';

export const filterRequestTableWrap = style({
  fontSize: 14,
});

globalStyle(`${filterRequestTableWrap} th, ${filterRequestTableWrap} td`, {
  padding: 8,
  borderRight: 'none',
});
