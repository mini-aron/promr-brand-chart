import { style } from '@vanilla-extract/css';

export { page } from '@/style/PageStyles.css';

export const content = style({
  display: 'flex',
  gap: 24,
  flex: 1,
  minHeight: 0,
  padding: '0 24px',
  overflow: 'auto',
});

export const regionPanel = style({
  width: '80%',
  minHeight: 520,
  maxHeight: 'calc(100vh - 180px)',
  marginBottom: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const regionPanelContent = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
});

export const mapSection = style({
  width: '20%',
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  minWidth: 0,
});

export const mapWrapper = style({
  flex: 1,
  minHeight: 280,
  marginBottom: 0,
  position: 'relative',
  overflow: 'hidden',
});

export const barChartSection = style({
  minHeight: 360,
  marginBottom: 0,
});

export const regionName = style({
  margin: 0,
  marginBottom: 16,
  fontSize: 20,
  fontWeight: 600,
  color: 'var(--color-text)',
});

export const gradientControls = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 12,
  height: 34,
  flexShrink: 0,
});

export const gradientModeGroup = style({
  display: 'flex',
  gap: 8,
});

export const gradientModeBtn = style({
  padding: '6px 12px',
  fontSize: 13,
  border: '1px solid var(--color-border)',
  borderRadius: 6,
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text-muted)',
  cursor: 'pointer',
  transition: 'border-color 0.15s, color 0.15s, background-color 0.15s',
  selectors: {
    '&:hover': {
      borderColor: 'var(--color-primary)',
      color: 'var(--color-primary)',
    },
  },
});

export const gradientModeActive = style({
  padding: '6px 12px',
  fontSize: 13,
  border: '1px solid var(--color-primary)',
  borderRadius: 6,
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
  color: 'var(--color-primary)',
  cursor: 'pointer',
});

export const corpChartSection = style({
  marginBottom: 20,
  flexShrink: 0,
});

export const corpChartRow = style({
  display: 'flex',
  gap: 16,
  alignItems: 'stretch',
  overflow: 'visible',
});

export const pieChartWrap = style({
  flexShrink: 0,
  width: 260,
  minWidth: 260,
  height: 240,
  overflow: 'visible',
});

export const corpBarChartWrap = style({
  flex: 1,
  minWidth: 0,
  height: 240,
});

export const regionSalesSection = style({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const sectionTitle = style({
  margin: 0,
  marginBottom: 8,
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--color-text-muted)',
});

export const sectionDesc = style({
  margin: 0,
  marginBottom: 12,
  fontSize: 12,
  color: 'var(--color-text-muted)',
});

export const chartWrap = style({
  width: '100%',
  height: 200,
  marginBottom: 8,
});

export const tableWrap = style({
  flex: 1,
  minHeight: 120,
  overflow: 'auto',
});

export const emptyMessage = style({
  margin: 0,
  padding: '16px 0',
  fontSize: 13,
  color: 'var(--color-text-muted)',
});
