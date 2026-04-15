import { globalStyle, style } from '@vanilla-extract/css';

export const root = style({
  width: '100%',
  minWidth: 0,
});

globalStyle(`${root} .wmde-markdown`, {
  fontSize: 15,
  lineHeight: 1.8,
  color: 'var(--color-text)',
});

globalStyle(`${root} .wmde-markdown h1`, {
  fontSize: '1.35rem',
  marginTop: '1.25em',
  marginBottom: '0.5em',
});

globalStyle(`${root} .wmde-markdown h2`, {
  fontSize: '1.2rem',
  marginTop: '1.1em',
  marginBottom: '0.45em',
});

globalStyle(`${root} .wmde-markdown table`, {
  display: 'block',
  overflowX: 'auto',
  maxWidth: '100%',
});

globalStyle(`${root} .wmde-markdown pre`, {
  borderRadius: 'var(--radius-sm)',
});
