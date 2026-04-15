import { style, globalStyle, styleVariants } from '@vanilla-extract/css';

export { page } from '@/style/PageStyles.css';

export const layoutWrap = style({
  display: 'flex',
  gap: 16,
  flex: 1,
  minHeight: 0,
  alignItems: 'stretch',
});

export const mainArea = style({
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const dealerCountBadge = style({
  display: 'inline-block',
  marginLeft: 4,
  padding: '2px 8px',
  fontSize: 11,
  fontWeight: 600,
  borderRadius: 12,
  backgroundColor: 'var(--color-background)',
  color: 'var(--color-text-muted)',
});

export const promrBadge = style({
  display: 'inline-block',
  marginLeft: 4,
  padding: '2px 8px',
  fontSize: 11,
  fontWeight: 600,
  borderRadius: 12,
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
  color: 'var(--color-primary)',
});

export const contentWrap = style({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-sm)',
  overflow: 'hidden',
});

export const contentHeader = style({
  flexShrink: 0,
  padding: 12,
  borderBottom: '1px solid var(--color-border)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 8,
});
globalStyle(`${contentHeader} h2`, { margin: 0, fontSize: 18, fontWeight: 600 });
globalStyle(`${contentHeader} p`, { margin: '4px 0 0', fontSize: 13 });

export const contentTablesWrap = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  padding: 12,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
});

globalStyle(`${contentTablesWrap} table`, { minWidth: 1100 });

export const subCsoSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

export const subCsoTitle = style({
  margin: 0,
  fontSize: 14,
  fontWeight: 700,
  color: 'var(--color-text)',
});

export const emptyStateInline = style({
  padding: '12px 0',
  color: 'var(--color-text-muted)',
  fontSize: 14,
});

export const contractDocBadgeRow = style({
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

/** 등록 서류 클릭 시 미리보기 — 미등록 회색 배지와 동일 패딩 */
export const docBadgeYesBtn = style({
  margin: 0,
  flexShrink: 0,
  padding: '4px 10px',
  border: 'none',
  borderRadius: 4,
  fontFamily: 'var(--font-family)',
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.35,
  backgroundColor: 'color-mix(in srgb, var(--color-success) 12%, transparent)',
  color: 'var(--color-success)',
  cursor: 'pointer',
  verticalAlign: 'baseline',
  selectors: {
    '&:focus-visible': {
      outline: '2px solid color-mix(in srgb, var(--color-success) 50%, transparent)',
      outlineOffset: 1,
    },
  },
});

export const docBadgeYesBtnInner = style({
  display: 'grid',
  placeItems: 'center',
});

export const docBadgeYesBtnLabel = style({
  gridRow: 1,
  gridColumn: 1,
  transition: 'opacity 0.12s ease',
  selectors: {
    [`${docBadgeYesBtn}:hover &`]: { opacity: 0 },
    [`${docBadgeYesBtn}:focus-visible &`]: { opacity: 0 },
  },
});

export const docBadgeYesBtnIcon = style({
  gridRow: 1,
  gridColumn: 1,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.12s ease',
  pointerEvents: 'none',
  selectors: {
    [`${docBadgeYesBtn}:hover &`]: { opacity: 1 },
    [`${docBadgeYesBtn}:focus-visible &`]: { opacity: 1 },
  },
});

export const docBadgeNo = style({
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

/** 재위탁 대상 법인: 직접 계약 행에서 재위탁계약서 미필요 표시 */
export const docBadgeExempt = style({
  display: 'inline-block',
  flexShrink: 0,
  padding: '4px 10px',
  borderRadius: 4,
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.35,
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, transparent)',
  color: 'var(--color-text-muted)',
});

export const emptyDocCell = style({
  color: 'var(--color-text-muted)',
  fontSize: 13,
});

export const contractStatusBadge = styleVariants({
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

export const linkStyles = style({
  color: 'var(--color-primary)',
  textDecoration: 'none',
});
globalStyle(`${linkStyles}:hover`, { textDecoration: 'underline' });

export const fileActionGroup = style({ display: 'flex', gap: 4, alignItems: 'center' });

export const linkButton = style({
  color: 'var(--color-primary)',
  background: 'none',
  border: 'none',
  padding: 0,
  fontSize: 'inherit',
  textDecoration: 'none',
  cursor: 'pointer',
});
globalStyle(`${linkButton}:hover`, { textDecoration: 'underline' });

export const separator = style({ color: 'var(--color-text-muted)' });

export const emptyState = style({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--color-text-muted)',
  fontSize: 14,
});
