import { style, globalStyle } from '@vanilla-extract/css';

export const page = style({});

globalStyle(`${page} h1`, { marginBottom: 8, color: 'var(--color-text)' });
globalStyle(`${page} p`, { color: 'var(--color-text-muted)', marginBottom: 16 });

export const pharmaCard = style({
  padding: 12,
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  marginBottom: 16,
  maxWidth: 360,
});

globalStyle(`${pharmaCard} label`, {
  display: 'block',
  fontSize: 13,
  color: 'var(--color-text-muted)',
  marginBottom: 4,
  fontWeight: 500,
});

export const sectionTitle = style({
  fontSize: 16,
  fontWeight: 600,
  color: 'var(--color-text)',
  marginBottom: 12,
});

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
globalStyle(`${dashboardCard} a`, {
  color: 'var(--color-primary)',
  fontWeight: 600,
  fontSize: 15,
  textDecoration: 'none',
});
globalStyle(`${dashboardCard} a:hover`, { textDecoration: 'underline' });

export const noticeList = style({
  listStyle: 'none',
  padding: 0,
  margin: '0 0 12px 0',
  borderTop: '1px solid var(--color-border)',
  paddingTop: 12,
});

globalStyle(`${noticeList} li`, {
  fontSize: 15,
  padding: '8px 0',
  borderBottom: '1px solid color-mix(in srgb, var(--color-border) 30%, transparent)',
});
globalStyle(`${noticeList} li:last-child`, { borderBottom: 'none' });
globalStyle(`${noticeList} .notice-title`, { color: 'var(--color-text)', fontWeight: 600 });
globalStyle(`${noticeList} .notice-date`, { fontSize: 14, color: 'var(--color-text-muted)', marginLeft: 8 });

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
globalStyle(`${menuCard} .card-inner`, { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' });
