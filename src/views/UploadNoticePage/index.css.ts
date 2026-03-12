import { style, globalStyle } from '@vanilla-extract/css';

export const page = style({});

globalStyle(`${page} h1`, { marginBottom: 8 });
globalStyle(`${page} p`, { marginBottom: 16 });

export const backLink = style({
  color: 'var(--color-primary)',
  fontWeight: 600,
});
