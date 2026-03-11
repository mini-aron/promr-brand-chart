import { style, globalStyle } from '@vanilla-extract/css';

export const wrapHorizontal = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: 6,
  cursor: 'pointer',
  userSelect: 'none',
});

globalStyle(`${wrapHorizontal} input:focus-visible ~ [data-checkbox-box]`, {
  outline: '2px solid var(--color-primary)',
  outlineOffset: 2,
});
globalStyle(`${wrapHorizontal}:hover [data-checkbox-box]`, {
  borderColor: 'var(--color-text-muted)',
});

export const wrapHorizontalChecked = style({});
globalStyle(`${wrapHorizontalChecked}:hover [data-checkbox-box]`, {
  borderColor: 'var(--color-primary-hover)',
});

export const wrapVertical = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 6,
  cursor: 'pointer',
  userSelect: 'none',
});

globalStyle(`${wrapVertical} input:focus-visible ~ [data-checkbox-box]`, {
  outline: '2px solid var(--color-primary)',
  outlineOffset: 2,
});
globalStyle(`${wrapVertical}:hover [data-checkbox-box]`, {
  borderColor: 'var(--color-text-muted)',
});

export const wrapVerticalChecked = style({});
globalStyle(`${wrapVerticalChecked}:hover [data-checkbox-box]`, {
  borderColor: 'var(--color-primary-hover)',
});

export const inputHidden = style({
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

export const box = style({
  flexShrink: 0,
  width: 20,
  height: 20,
  borderRadius: 4,
  border: '2px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'border-color 0.15s, background-color 0.15s',
});

export const boxChecked = style({
  borderColor: 'var(--color-primary)',
  backgroundColor: 'var(--color-primary)',
});

export const labelText = style({
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--color-text)',
});

export const description = style({
  fontSize: 12,
  color: 'var(--color-text-muted)',
  marginTop: 2,
});
