import { style } from '@vanilla-extract/css';

/**
 * 법인 대시보드 전용 그리드만 정의.
 * 카드·타이포·뱃지·패널은 PharmaHomePage/index.css 토큰과 동일하게 맞춤.
 */
export const layoutGrid = style({
  display: 'grid',
  gap: 12,
  marginBottom: 16,
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gridTemplateRows: 'auto auto minmax(0, 1fr)',
  gridTemplateAreas: `
    "welcome welcome welcome"
    "docs status notices"
    "approval approval notices"
  `,
  alignItems: 'stretch',
  '@media': {
    '(max-width: 900px)': {
      gridTemplateColumns: '1fr',
      gridTemplateRows: 'auto',
      gridTemplateAreas: `
        "welcome"
        "docs"
        "status"
        "notices"
        "approval"
      `,
    },
  },
});

/** 제약사 profileCard와 동일 스타일이나 그리드 전체 너비 */
export const welcomeFull = style({
  gridArea: 'welcome',
  maxWidth: 'none',
  width: '100%',
  marginBottom: 0,
});

export const cardAreaDocs = style({
  gridArea: 'docs',
  minWidth: 0,
});

export const cardAreaStatus = style({
  gridArea: 'status',
  minWidth: 0,
});

export const cardAreaNotices = style({
  gridArea: 'notices',
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  '@media': {
    '(min-width: 901px)': {
      minHeight: 360,
    },
  },
});

export const cardAreaApproval = style({
  gridArea: 'approval',
  minWidth: 0,
});

export const noticesBody = style({
  flex: 1,
  minHeight: 200,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const noticesScroll = style({
  flex: 1,
  overflowY: 'auto',
  minHeight: 0,
});

/** 계약 상태 상단: 제약사 kpiGrid와 동일 gap, 2열 */
export const statusKpiGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 12,
  marginBottom: 12,
});

export const docRowWithIcon = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
  padding: '10px 0',
  borderBottom: '1px solid var(--color-border)',
  selectors: {
    '&:last-child': { borderBottom: 'none' },
  },
});

export const docLabel = style({
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--color-text)',
});

export const docCheckWrap = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--color-success)',
});

export const docMuted = style({
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--color-text-muted)',
});

/** KPI 아래: 최근 제출 한 건 — 라벨 + 인라인 카드 */
export const statusLatestWrap = style({
  marginTop: 4,
});

export const statusLatestSectionLabel = style({
  margin: '0 0 8px',
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--color-text-muted)',
});

export const statusLatestCard = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '12px 14px',
  borderRadius: 10,
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  boxShadow: '0 1px 2px color-mix(in srgb, var(--color-text) 4%, transparent)',
});

export const statusLatestLeft = style({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  minWidth: 0,
  flex: 1,
});

export const statusLatestIconWrap = style({
  flexShrink: 0,
  width: 36,
  height: 36,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
  color: 'var(--color-primary)',
});

export const statusLatestPharmaName = style({
  fontSize: 14,
  fontWeight: 700,
  color: 'var(--color-text)',
  letterSpacing: '-0.02em',
  lineHeight: 1.35,
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const statusLatestDateCol = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: 2,
  flexShrink: 0,
});

export const statusLatestDateCaption = style({
  fontSize: 10,
  fontWeight: 700,
  color: 'var(--color-text-muted)',
  letterSpacing: '0.02em',
});

export const statusLatestDateValue = style({
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--color-text-muted)',
  fontVariantNumeric: 'tabular-nums',
});

export const emptyAlignLeft = style({
  padding: '12px 0',
  margin: 0,
  textAlign: 'left',
});
