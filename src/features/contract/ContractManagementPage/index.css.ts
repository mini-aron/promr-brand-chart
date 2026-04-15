export { page } from '@/style/PageStyles.css';

import { style } from '@vanilla-extract/css';

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 12,
});

/** 계약관리 카드 — 요약 통계 행 + 목록 표를 한 블록으로 */
export const contractSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 16,
});

export const summaryGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: 12,
  '@media': {
    '(max-width: 920px)': { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
    '(max-width: 620px)': { gridTemplateColumns: 'repeat(1, minmax(0, 1fr))' },
  },
});

export const statCard = style({
  padding: 14,
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--color-border)',
  boxShadow: 'var(--shadow-sm)',
});

/** 링크 카드 내부 — 테두리는 부모 linkCard에 둠 */
export const statCardLinkable = style([
  statCard,
  {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: 148,
    margin: 0,
    border: 'none',
    boxShadow: 'none',
    backgroundColor: 'transparent',
  },
]);

export const statCardLinkableBody = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
});

export const statCardRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  flex: 1,
});

export const statIconWrap = style({
  width: 42,
  height: 42,
  borderRadius: 'var(--radius-md)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
  color: 'var(--color-primary)',
});

export const statLabel = style({
  fontSize: 13,
  color: 'var(--color-text-muted)',
  marginBottom: 4,
  fontWeight: 600,
});

export const statValue = style({
  fontSize: 28,
  fontWeight: 800,
  color: 'var(--color-text)',
});

export const statDetail = style({
  fontSize: 12,
  color: 'var(--color-text-muted)',
  marginTop: 6,
});

export const linkCard = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 168,
  textDecoration: 'none',
  color: 'inherit',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  boxShadow: 'var(--shadow-sm)',
  cursor: 'pointer',
  transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease',
  selectors: {
    '&:hover': {
      borderColor: 'color-mix(in srgb, var(--color-primary) 40%, var(--color-border))',
      boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 12%, transparent)',
      backgroundColor: 'color-mix(in srgb, var(--color-primary) 5%, var(--color-surface))',
    },
    '&:focus-visible': {
      outline: '2px solid var(--color-primary)',
      outlineOffset: 2,
    },
  },
});

export const linkCardCta = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 4,
  marginTop: 'auto',
  paddingTop: 8,
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--color-primary)',
});

export const linkCardCtaIcon = style({
  flexShrink: 0,
  opacity: 0.9,
  transition: 'transform 0.15s ease',
  selectors: {
    [`${linkCard}:hover &`]: {
      transform: 'translateX(3px)',
    },
  },
});

export const listCard = style({
  padding: 0,
});

export const listWrap = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

export const listTitleRow = style({
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  gap: 12,
});

export const listTitle = style({
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--color-text)',
});

export const listMeta = style({
  fontSize: 12,
  color: 'var(--color-text-muted)',
});

export const list = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 0,
});

export const table = style({
  marginTop: 10,
  borderTop: '1px solid var(--color-border)',
});

export const tableRow = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr) 120px',
  gap: 12,
  padding: '10px 12px',
  alignItems: 'center',
});

export const tableHeaderRow = style([
  tableRow,
  {
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: 'color-mix(in srgb, var(--color-text) 3%, transparent)',
  },
]);

export const tableBodyRow = style([
  tableRow,
  {
    borderTop: '1px solid var(--color-border)',
  },
]);

export const tableHeaderCell = style({
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--color-text-muted)',
});

export const listItemLink = style({
  textDecoration: 'none',
  color: 'inherit',
  selectors: {
    '&:hover': {
      backgroundColor: 'color-mix(in srgb, var(--color-primary) 6%, transparent)',
    },
  },
});

export const listItemName = style({
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--color-text)',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const listItemSub = style({
  fontSize: 12,
  color: 'var(--color-text-muted)',
  flexShrink: 0,
});

export const emptyState = style({
  padding: '12px 12px',
  color: 'var(--color-text-muted)',
  fontSize: 12,
  borderTop: '1px solid var(--color-border)',
});
