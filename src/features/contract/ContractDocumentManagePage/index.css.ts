import { style, styleVariants, globalStyle } from '@vanilla-extract/css';

export { page } from '@/style/PageStyles.css';
export { filterSection, filterRow, filterField } from '@/style/FilterStyles.css';

export const filterFieldWide = style({
  minWidth: 220,
  flex: '1 1 240px',
  maxWidth: 360,
});

export const pageTopRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 12,
  flexShrink: 0,
  marginBottom: 8,
});

export const pageHeaderLeft = style({
  flex: '1 1 200px',
  minWidth: 0,
});

export const pageHeaderActions = style({
  flexShrink: 0,
  paddingTop: 2,
});

export const tableSection = style({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
});

export const tableCardInner = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  padding: 8,
  fontSize: 14,
});

globalStyle(`${tableCardInner} table`, { minWidth: 1120 });

export const actionCell = style({
  whiteSpace: 'nowrap',
  verticalAlign: 'middle',
});

export const actionIconSvg = style({
  display: 'block',
  flexShrink: 0,
  color: 'inherit',
});
globalStyle(`${tableCardInner} th, ${tableCardInner} td`, {
  padding: 8,
  borderRight: 'none',
});
globalStyle(`${tableCardInner} th`, { fontSize: 13 });

export const docBadgeRow = style({
  display: 'inline-flex',
  flexWrap: 'nowrap',
  gap: 6,
  alignItems: 'center',
  width: 'max-content',
  maxWidth: 'none',
  overflow: 'visible',
});

export const docBadgeCell = style({
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
  overflow: 'visible',
});

export const docBadge = style({
  display: 'inline-block',
  flexShrink: 0,
  padding: '4px 10px',
  borderRadius: 4,
  fontSize: 12,
  fontWeight: 600,
  backgroundColor: 'color-mix(in srgb, var(--color-success) 12%, transparent)',
  color: 'var(--color-success)',
});

/** 미등록 서류 — 회색 배지 */
export const docBadgeMissing = style({
  display: 'inline-block',
  flexShrink: 0,
  padding: '4px 10px',
  borderRadius: 4,
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.35,
  backgroundColor: 'color-mix(in srgb, var(--color-text-muted) 10%, transparent)',
  color: 'var(--color-text-muted)',
});

export const statusBadge = styleVariants({
  valid: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
    backgroundColor: 'color-mix(in srgb, var(--color-success) 12%, transparent)',
    color: 'var(--color-success)',
  },
  expired: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
    backgroundColor: 'color-mix(in srgb, var(--color-error) 12%, transparent)',
    color: 'var(--color-error)',
  },
});

export const subcontractBadge = styleVariants({
  yes: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
    backgroundColor: 'color-mix(in srgb, var(--color-primary) 14%, transparent)',
    color: 'var(--color-primary)',
  },
  no: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
    backgroundColor: 'color-mix(in srgb, var(--color-text-muted) 10%, transparent)',
    color: 'var(--color-text-muted)',
  },
});
