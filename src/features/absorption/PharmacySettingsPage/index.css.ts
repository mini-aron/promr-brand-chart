import { style, globalStyle } from '@vanilla-extract/css';

export { page } from '@/style/PageStyles.css';

export const content = style({
  display: 'flex',
  gap: 16,
  flex: 1,
  minHeight: 0,
  padding: '0 24px',
});

export const hospitalPanelLayout = style({
  width: 300,
  flexShrink: 0,
  marginBottom: 0,
  overflow: 'hidden',
});

export const hospitalPanel = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  flex: 1,
});

export const panelTitle = style({
  margin: 0,
  padding: '12px 16px',
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--color-text-muted)',
  borderBottom: '1px solid var(--color-border)',
});

export const searchWrap = style({
  flexShrink: 0,
  padding: 12,
  borderBottom: '1px solid var(--color-border)',
});

globalStyle(`${searchWrap} label`, {
  display: 'block',
  marginBottom: 6,
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--color-text-muted)',
});

export const hospitalList = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  padding: 8,
});

globalStyle(`${hospitalList} button`, {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  padding: '10px 12px',
  marginBottom: 4,
  textAlign: 'left',
  border: 'none',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--color-text)',
});
globalStyle(`${hospitalList} button:hover`, {
  backgroundColor: 'var(--color-background)',
});
globalStyle(`${hospitalList} button[data-active="true"]`, {
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, transparent)',
  color: 'var(--color-primary)',
  fontWeight: 600,
});

export const hospitalName = style({
  display: 'block',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const hospitalInfo = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
});

export const hospitalAddress = style({
  display: 'block',
  fontSize: 11,
  color: 'var(--color-text-muted)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const pharmacyCount = style({
  flexShrink: 0,
  marginLeft: 8,
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--color-text-muted)',
});

export const pharmacyCountEmpty = style({
  flexShrink: 0,
  marginLeft: 8,
  fontSize: 12,
  fontWeight: 600,
  color: '#fff',
  backgroundColor: 'var(--color-error, #dc2626)',
  padding: '2px 8px',
  borderRadius: 'var(--radius-sm)',
});

export const pharmacyContent = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
});

export const pharmacyEmpty = style({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--color-text-muted)',
  fontSize: 14,
});

export const pharmacyList = style({
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const pharmacyItem = style({
  padding: '10px 12px',
  marginBottom: 8,
  backgroundColor: 'var(--color-background)',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  cursor: 'pointer',
});

export const pharmacyItemName = style({
  display: 'block',
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--color-text)',
  marginBottom: 4,
});

export const pharmacyItemAddr = style({
  display: 'block',
  fontSize: 12,
  color: 'var(--color-text-muted)',
});

export const mapPanelLayout = style({
  width: 600,
  flexShrink: 0,
  marginBottom: 0,
  overflow: 'hidden',
});

export const mapPanel = style({
  display: 'flex',
  flexDirection: 'column',
  minHeight: 400,
  flex: 1,
});
