import { style } from '@vanilla-extract/css';

export { page } from '@/style/PageStyles.css';

/** 제약사 대시보드 — 넓은 배경은 중립 톤, 아이콘·링크·뱃지 등은 primary 유지 */
export const dashboard = style({
  maxWidth: 1120,
  margin: '0 auto',
});

export const profileCard = style({
  maxWidth: 320,
  marginBottom: 16,
  padding: '14px 16px',
  borderRadius: 12,
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  boxShadow: '0 1px 2px color-mix(in srgb, var(--color-text) 6%, transparent)',
});

export const greetingLabel = style({
  fontSize: 12,
  color: 'var(--color-text-muted)',
  fontWeight: 500,
  marginBottom: 4,
});

export const greetingLine = style({
  fontSize: 15,
  fontWeight: 700,
  color: 'var(--color-text)',
  lineHeight: 1.35,
});

export const accountName = style({
  color: 'var(--color-primary-hover)',
});

export const accountRoleTag = style({
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--color-text-muted)',
});

export const kpiGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: 12,
  marginBottom: 16,
  '@media': {
    '(max-width: 1024px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '(max-width: 480px)': {
      gridTemplateColumns: '1fr',
    },
  },
});

export const kpiCard = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  padding: '14px 14px',
  borderRadius: 12,
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  boxShadow: '0 1px 2px color-mix(in srgb, var(--color-text) 5%, transparent)',
});

export const kpiIconWrap = style({
  flexShrink: 0,
  width: 44,
  height: 44,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
  color: 'var(--color-primary)',
});

/** 검토 대기 KPI — 노란색(앰버) 강조 */
export const kpiIconWrapPending = style({
  backgroundColor: 'color-mix(in srgb, var(--color-warning) 16%, transparent)',
  color: 'var(--color-warning)',
});

export const kpiValuePending = style({
  color: 'var(--color-warning)',
});

export const kpiText = style({
  minWidth: 0,
  flex: 1,
});

export const kpiTitle = style({
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--color-text)',
  lineHeight: 1.25,
});

export const kpiSubtitle = style({
  fontSize: 11,
  color: 'var(--color-text-muted)',
  marginTop: 2,
  marginBottom: 6,
});

export const kpiValueRow = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: 4,
});

export const kpiValue = style({
  fontSize: 22,
  fontWeight: 800,
  color: 'var(--color-text)',
  letterSpacing: '-0.02em',
  lineHeight: 1,
});

export const kpiUnit = style({
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--color-text-muted)',
});

export const midSplit = style({
  display: 'grid',
  gap: 14,
  marginBottom: 16,
  '@media': {
    '(min-width: 900px)': {
      gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
    },
  },
});

export const panelLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 2,
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--color-primary)',
  textDecoration: 'none',
  selectors: {
    '&:hover': { color: 'var(--color-primary-hover)', textDecoration: 'underline' },
    '&:focus-visible': {
      outline: '2px solid var(--color-primary)',
      outlineOffset: 2,
      borderRadius: 4,
    },
  },
});

export const tableScroll = style({
  overflowX: 'auto',
  maxHeight: 260,
  overflowY: 'auto',
});

export const dataTable = style({
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 12,
});

export const th = style({
  textAlign: 'left',
  padding: '8px 12px',
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--color-text-muted)',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 6%, var(--color-surface))',
  borderBottom: '1px solid color-mix(in srgb, var(--color-primary) 10%, var(--color-border))',
  whiteSpace: 'nowrap',
});

export const thDate = style([
  th,
  {
    textAlign: 'right',
    width: 96,
  },
]);

export const td = style({
  padding: '10px 12px',
  borderBottom: '1px solid var(--color-border)',
  verticalAlign: 'middle',
  color: 'var(--color-text)',
});

export const tdStrong = style([
  td,
  {
    fontWeight: 600,
    maxWidth: 200,
  },
]);

export const tdMuted = style([
  td,
  {
    textAlign: 'right',
    fontSize: 12,
    color: 'var(--color-text-muted)',
    whiteSpace: 'nowrap',
  },
]);

export const badgeGroup = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  alignItems: 'center',
});

export const badgeReview = style({
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: 6,
  fontSize: 11,
  fontWeight: 700,
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
  color: 'var(--color-primary-hover)',
});

export const badgeNew = style({
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: 6,
  fontSize: 11,
  fontWeight: 700,
  backgroundColor: 'color-mix(in srgb, var(--color-text-muted) 14%, transparent)',
  color: 'var(--color-text)',
});

export const badgeApproved = style({
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: 6,
  fontSize: 11,
  fontWeight: 700,
  backgroundColor: 'color-mix(in srgb, var(--color-success) 14%, transparent)',
  color: 'var(--color-success)',
});

export const badgeRejected = style({
  display: 'inline-block',
  padding: '2px 8px',
  borderRadius: 6,
  fontSize: 11,
  fontWeight: 700,
  backgroundColor: 'color-mix(in srgb, var(--color-error) 14%, transparent)',
  color: 'var(--color-error)',
});

export const emptyText = style({
  padding: '20px 14px',
  margin: 0,
  textAlign: 'center',
  fontSize: 13,
  color: 'var(--color-text-muted)',
});

export const panelFooter = style({
  padding: '10px 12px',
  borderTop: '1px solid var(--color-border)',
  textAlign: 'center',
  backgroundColor: 'var(--color-surface)',
});

export const footerLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--color-primary)',
  textDecoration: 'none',
  selectors: {
    '&:hover': { color: 'var(--color-primary-hover)', textDecoration: 'underline' },
    '&:focus-visible': {
      outline: '2px solid var(--color-primary)',
      outlineOffset: 2,
      borderRadius: 4,
    },
  },
});

export const noticeList = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
});

export const noticeItem = style({
  borderBottom: '1px solid var(--color-border)',
  selectors: {
    '&:last-child': { borderBottom: 'none' },
  },
});

export const noticeLink = style({
  display: 'grid',
  gridTemplateColumns: 'auto 1fr auto',
  gap: 8,
  alignItems: 'center',
  padding: '10px 12px',
  textDecoration: 'none',
  color: 'inherit',
  transition: 'background-color 0.12s ease',
  selectors: {
    '&:hover': {
      backgroundColor: 'color-mix(in srgb, var(--color-text) 4%, var(--color-surface))',
    },
    '&:focus-visible': {
      outline: '2px solid var(--color-primary)',
      outlineOffset: -2,
    },
  },
});

export const noticeTag = style({
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--color-primary)',
});

export const noticeTitle = style({
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--color-text)',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const noticeDate = style({
  fontSize: 11,
  color: 'var(--color-text-muted)',
});

export const regionSection = style({
  marginBottom: 8,
});

export const regionCard = style({
  display: 'grid',
  borderRadius: 12,
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  boxShadow: '0 1px 2px color-mix(in srgb, var(--color-text) 5%, transparent)',
  overflow: 'hidden',
  '@media': {
    '(min-width: 720px)': {
      gridTemplateColumns: '1fr 1fr',
    },
  },
});

/** `CardWrapper` 안에 넣을 때 외곽선·그림자 중복 제거 */
export const regionCardInWrapper = style({
  border: 'none',
  boxShadow: 'none',
  borderRadius: 0,
});

export const regionHighlight = style({
  padding: '16px 16px',
  borderRight: '1px solid var(--color-border)',
  backgroundColor: 'color-mix(in srgb, var(--color-text) 2%, var(--color-surface))',
  '@media': {
    '(max-width: 719px)': {
      borderRight: 'none',
      borderBottom: '1px solid var(--color-border)',
    },
  },
});

export const regionPill = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: '4px 10px',
  borderRadius: 999,
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--color-primary-hover)',
  backgroundColor: 'color-mix(in srgb, var(--color-text) 8%, var(--color-surface))',
  marginBottom: 10,
});

export const regionLead = style({
  margin: 0,
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--color-text)',
  lineHeight: 1.5,
});

export const regionHint = style({
  margin: '8px 0 0',
  fontSize: 12,
  color: 'var(--color-text-muted)',
  lineHeight: 1.45,
});

export const regionList = style({
  listStyle: 'none',
  margin: 0,
  padding: '12px 14px',
});

export const regionRow = style({
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

export const regionName = style({
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--color-text)',
});

export const regionAmount = style({
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--color-primary)',
  whiteSpace: 'nowrap',
});
