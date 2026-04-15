import { style, globalStyle } from '@vanilla-extract/css';

/** 상세 카드: 그림자·모서리만 살짝 강조 */
export const detailCard = style({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 0,
  alignSelf: 'stretch',
  width: '100%',
  marginTop: 20,
  backgroundColor: 'var(--color-surface)',
  border: '1px solid color-mix(in srgb, var(--color-border) 85%, transparent)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.04)',
  overflow: 'hidden',
});

export const detailToolbar = style({
  padding: '12px 24px 0',
});

globalStyle(`${detailToolbar} button`, {
  marginBottom: 4,
});

export const detailHeader = style({
  padding: '8px 24px 20px',
  backgroundColor: 'var(--color-surface)',
  borderBottom: '1px solid var(--color-border)',
});

export const detailHeaderTop = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  flexWrap: 'wrap',
  marginBottom: 14,
});

export const detailBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '6px 12px',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.02em',
});

export const detailBadgeSystem = style({
  color: 'var(--color-text-muted)',
  backgroundColor: 'color-mix(in srgb, var(--color-border) 45%, transparent)',
});

export const detailBadgePharma = style({
  color: 'var(--color-primary)',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 14%, transparent)',
});

export const detailTitle = style({
  margin: 0,
  fontSize: 'clamp(1.25rem, 2.8vw, 1.5rem)',
  fontWeight: 700,
  lineHeight: 1.35,
  letterSpacing: '-0.02em',
  color: 'var(--color-text)',
});

export const detailMeta = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 16,
  marginTop: 14,
  paddingTop: 14,
  borderTop: '1px solid color-mix(in srgb, var(--color-border) 65%, transparent)',
  flexWrap: 'wrap',
  rowGap: 8,
});

export const detailAuthor = style({
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--color-text)',
});

export const detailDates = style({
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--color-text-muted)',
  textAlign: 'right',
});

/** 본문 영역: 가로 전체 사용 */
export const detailContent = style({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  width: '100%',
  minWidth: 0,
  padding: '28px 28px 36px',
  boxSizing: 'border-box',
  backgroundColor: 'var(--color-surface)',
});

export const detailMarkdownLoading = style({
  margin: 0,
  padding: '24px 0',
  fontSize: 14,
  color: 'var(--color-text-muted)',
});
