import { style, globalStyle } from '@vanilla-extract/css';

export const hospitalTableWrap = style({});

globalStyle(`${hospitalTableWrap} table`, { minWidth: 700 });
globalStyle(`${hospitalTableWrap} th:first-child, ${hospitalTableWrap} td:first-child`, {
  width: 110,
  maxWidth: 110,
});
