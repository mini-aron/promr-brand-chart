import { style } from '@vanilla-extract/css';

export const wrap = style({
  position: 'relative',
  width: '100%',
});

export const trigger = style({
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  padding: '4px 8px',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  color: 'var(--color-text)',
  minHeight: 32,
  fontSize: 13,
  background: 'var(--color-surface)',
  selectors: {
    '&:hover': {
      borderColor: 'var(--color-primary)',
      backgroundColor: 'var(--color-background)',
    },
  },
});

export const triggerLarge = style({
  minHeight: 48,
  padding: '0 12px',
  fontSize: 15,
});

export const list = style({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 'calc(100% + 2px)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-sm)',
  background: 'var(--color-surface)',
  padding: '8px 6px',
  listStyleType: 'none',
  boxShadow: 'var(--shadow-md)',
  zIndex: 10000,
  maxHeight: 200,
  overflowY: 'auto',
});

export const listWithSearch = style([
  list,
  {
    padding: '0 6px 4px 6px',
  },
]);

export const searchInput = style({
  position: 'sticky',
  top: 0,
  width: 'calc(100% + 12px)',
  margin: '0 -6px',
  padding: '6px 8px 4px 8px',
  border: 'none',
  borderBottom: '1px solid var(--color-border)',
  background: 'var(--color-surface)',
  fontSize: 13,
  outline: 'none',
  color: 'var(--color-text)',
  boxSizing: 'border-box',
  borderTopLeftRadius: 'var(--radius-sm)',
  borderTopRightRadius: 'var(--radius-sm)',
  selectors: {
    '&:focus': { borderBottomColor: 'var(--color-primary)' },
  },
});

const itemBase = style({
  padding: '4px 8px',
  cursor: 'pointer',
  fontSize: 13,
  borderRadius: 4,
  margin: '2px 0',
  selectors: {
    '&:hover': {
      backgroundColor: 'color-mix(in srgb, var(--color-primary) 26%, transparent)',
    },
  },
});

export const item = itemBase;
export const itemSelected = style([
  itemBase,
  {
    backgroundColor: 'color-mix(in srgb, var(--color-primary) 14%, transparent)',
    color: 'var(--color-primary)',
  },
]);
export const itemFocused = style([
  itemBase,
  {
    backgroundColor: 'color-mix(in srgb, var(--color-primary) 14%, transparent)',
    outline: '2px solid var(--color-primary)',
    outlineOffset: -2,
  },
]);
export const itemSelectedFocused = style([
  itemBase,
  {
    backgroundColor: 'color-mix(in srgb, var(--color-primary) 14%, transparent)',
    color: 'var(--color-primary)',
    outline: '2px solid var(--color-primary)',
    outlineOffset: -2,
  },
]);

export const optionContent = style({
  minWidth: 0,
  overflow: 'hidden',
});

export const optionLabel = style({
  fontWeight: 500,
  display: 'block',
});

export const optionDescription = style({
  fontSize: 11,
  color: 'var(--color-text-muted)',
  marginTop: 2,
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const checkboxLabel = style({
  display: 'flex',
  alignItems: 'flex-start',
  cursor: 'pointer',
  gap: 4,
  width: '100%',
});

export const checkboxInput = style({
  cursor: 'pointer',
  marginTop: 2,
});
