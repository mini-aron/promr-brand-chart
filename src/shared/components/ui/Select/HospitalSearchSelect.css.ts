import { style, globalStyle } from '@vanilla-extract/css';

export const inputWithOptionsWrap = style({
  position: 'relative',
  width: '100%',
});

export const inputRow = style({
  display: 'flex',
  gap: 8,
  alignItems: 'center',
});

export const dropdownSearchRow = style({
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  padding: '8px 6px',
  borderBottom: '1px solid var(--color-border)',
  background: 'var(--color-surface)',
  flexShrink: 0,
});

export const dropdownContainer = style({
  position: 'absolute',
  left: 0,
  right: 0,
  top: '100%',
  marginTop: 0,
  width: 'max(100%, 320px)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  background: 'var(--color-surface)',
  boxShadow: 'var(--shadow-md)',
  zIndex: 10000,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: 280,
  overflow: 'hidden',
});

export const optionList = style({
  listStyleType: 'none',
  padding: '0 6px 8px',
  margin: 0,
  overflowY: 'auto',
  flex: 1,
  minHeight: 0,
});

export const searchInputField = style({
  flex: 1,
  minWidth: 0,
  minHeight: 32,
  height: 32,
  padding: '4px 8px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  fontSize: 13,
  lineHeight: 1.2,
  outline: 'none',
  color: 'var(--color-text)',
  background: 'var(--color-surface)',
  boxSizing: 'border-box',
  selectors: {
    '&:focus': { borderColor: 'var(--color-primary)' },
  },
});

globalStyle(`${inputWithOptionsWrap} input.${searchInputField}`, {
  minHeight: 32,
  height: 32,
});

export const dropdownSearchInput = style([
  searchInputField,
  {
    minHeight: 32,
    height: 32,
    padding: '4px 8px',
    fontSize: 13,
    lineHeight: 1.2,
  },
]);
