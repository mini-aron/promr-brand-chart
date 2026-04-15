import { style, globalStyle } from '@vanilla-extract/css';

export { page } from '@/style/PageStyles.css';

/* ========== 선택 단계 (들어가기 전) ========== */
export const selectPhase = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '40px 24px',
  minHeight: '60vh',
});

export const selectPhaseHeader = style({
  textAlign: 'center',
  marginBottom: 40,
});

export const selectPhaseTitle = style({
  fontSize: 28,
  fontWeight: 700,
  color: 'var(--color-text)',
  margin: 0,
  marginBottom: 8,
});

export const selectPhaseDesc = style({
  fontSize: 16,
  color: 'var(--color-text-muted)',
  margin: 0,
});

export const pharmaEntryGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: 16,
  width: '100%',
  maxWidth: 560,
});

export const pharmaEntryCard = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 12,
  padding: 24,
  backgroundColor: 'var(--color-surface)',
  border: '2px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  cursor: 'pointer',
  transition: 'border-color 0.2s, box-shadow 0.2s, transform 0.15s',
  textAlign: 'center',
  selectors: {
    '&:hover': {
      borderColor: 'var(--color-primary)',
      boxShadow: 'var(--shadow-md)',
      transform: 'translateY(-2px)',
    },
  },
});

export const pharmaEntryIcon = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 56,
  height: 56,
  borderRadius: 'var(--radius-lg)',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
  color: 'var(--color-primary)',
});

export const pharmaEntryName = style({
  fontSize: 18,
  fontWeight: 700,
  color: 'var(--color-text)',
});

export const pharmaEntryArrow = style({
  color: 'var(--color-text-muted)',
  opacity: 0.7,
});

/* ========== 포털 단계 (제약사 선택 후) ========== */
export const portalPhase = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
});

export const portalHeader = style({
  padding: '24px 0',
  marginBottom: 24,
  borderBottom: '1px solid var(--color-border)',
});

export const portalHeaderInner = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: 12,
  marginBottom: 4,
});

export const portalPharmaName = style({
  fontSize: 24,
  fontWeight: 800,
  color: 'var(--color-primary)',
  letterSpacing: '-0.02em',
});

export const portalTitle = style({
  fontSize: 18,
  fontWeight: 600,
  color: 'var(--color-text-muted)',
});

export const portalSubtitle = style({
  fontSize: 14,
  color: 'var(--color-text-muted)',
  margin: 0,
  marginBottom: 16,
});

export const switchPharmaBtn = style({
  padding: '6px 12px',
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--color-primary)',
  backgroundColor: 'transparent',
  border: '1px solid var(--color-primary)',
  borderRadius: 'var(--radius-md)',
  cursor: 'pointer',
  transition: 'background-color 0.2s, color 0.2s',
  selectors: {
    '&:hover': {
      backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
    },
  },
});

export const portalContent = style({
  flex: 1,
  minHeight: 0,
});

/* ========== 메뉴 카드 그리드 ========== */
export const cardGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: 16,
  alignItems: 'start',
});

export const noticeCardWrap = style({
  gridColumn: '1 / -1',
});

export const dashboardCard = style({
  padding: 20,
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--color-border)',
  boxShadow: 'var(--shadow-sm)',
  minHeight: 200,
});

globalStyle(`${dashboardCard} h2`, { fontSize: 20, marginBottom: 8 });
globalStyle(`${dashboardCard} p`, { fontSize: 15, margin: 0, marginBottom: 12 });

export const noticeLinkBtn = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: '8px 14px',
  marginTop: 4,
  color: 'var(--color-primary)',
  fontWeight: 600,
  fontSize: 14,
  textDecoration: 'none',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
  transition: 'background-color 0.2s',
  selectors: {
    '&:hover': {
      backgroundColor: 'color-mix(in srgb, var(--color-primary) 18%, transparent)',
      textDecoration: 'none',
    },
  },
});

export const noticeList = style({
  listStyle: 'none',
  padding: 0,
  margin: '0 0 12px 0',
  borderTop: '1px solid var(--color-border)',
  paddingTop: 12,
});

globalStyle(`${noticeList} li`, {
  fontSize: 15,
  padding: 0,
  marginBottom: 4,
  borderRadius: 'var(--radius-md)',
  borderBottom: 'none',
  transition: 'background-color 0.15s',
});
globalStyle(`${noticeList} li:hover`, {
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 6%, transparent)',
});

export const noticePreviewLink = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
  width: '100%',
  padding: '10px 12px',
  textDecoration: 'none',
  color: 'inherit',
  borderRadius: 'inherit',
});
globalStyle(`${noticeList} li:last-child`, { marginBottom: 0 });
globalStyle(`${noticeList} .notice-title`, { color: 'var(--color-text)', fontWeight: 600 });
globalStyle(`${noticeList} .notice-date`, {
  display: 'inline-block',
  fontSize: 12,
  color: 'var(--color-text-muted)',
  marginLeft: 8,
  padding: '2px 8px',
  borderRadius: 'var(--radius-sm)',
  backgroundColor: 'color-mix(in srgb, var(--color-border) 50%, transparent)',
});

export const menuCardDesc = style({
  fontSize: 13,
  color: 'var(--color-text-muted)',
  fontWeight: 400,
  marginTop: 2,
});

export const menuCard = style({
  display: 'flex',
  alignItems: 'center',
  gap: 12,
  padding: 16,
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  textDecoration: 'none',
  color: 'var(--color-text)',
  fontWeight: 600,
  fontSize: 16,
  boxShadow: 'var(--shadow-sm)',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  selectors: {
    '&:hover': {
      borderColor: 'var(--color-primary)',
      boxShadow: 'var(--shadow-md)',
    },
  },
});

globalStyle(`${menuCard} .icon`, {
  flexShrink: 0,
  width: 48,
  height: 48,
  borderRadius: 'var(--radius-md)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, transparent)',
  color: 'var(--color-primary)',
});
globalStyle(`${menuCard} .card-inner`, {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  textAlign: 'left',
});
