import { style, globalStyle } from '@vanilla-extract/css';

export const wrap = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  cursor: 'pointer',
  userSelect: 'none',
  minWidth: 0,
});

globalStyle(`${wrap} input:focus-visible ~ [data-toggle-track]`, {
  outline: '2px solid var(--color-primary)',
  outlineOffset: 2,
});

export const wrapDisabled = style({
  cursor: 'not-allowed',
  opacity: 0.6,
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

export const track = style({
  flexShrink: 0,
  width: 40,
  height: 22,
  borderRadius: 11,
  border: '2px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  position: 'relative',
  transition: 'border-color 0.15s, background-color 0.15s',
});

globalStyle(`${wrap}:hover:not(${wrapDisabled}) [data-toggle-track]`, {
  borderColor: 'var(--color-text-muted)',
});

export const trackChecked = style({
  borderColor: 'var(--color-primary)',
  backgroundColor: 'var(--color-primary)',
});

globalStyle(`${wrap}:hover:not(${wrapDisabled}) [data-toggle-track].${trackChecked}`, {
  borderColor: 'var(--color-primary-hover)',
  backgroundColor: 'var(--color-primary-hover)',
});

export const thumb = style({
  position: 'absolute',
  top: 2,
  left: 2,
  width: 16,
  height: 16,
  borderRadius: '50%',
  backgroundColor: 'white',
  boxShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
  transition: 'transform 0.15s ease',
});

export const thumbChecked = style({
  transform: 'translateX(18px)',
});

export const labelText = style({
  fontSize: 14,
  color: 'var(--color-text-muted)',
});
