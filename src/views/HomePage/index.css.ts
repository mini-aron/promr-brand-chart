import { style } from '@vanilla-extract/css';

export const page = style({});

export const pageTitle = style({
  marginBottom: 8,
});

export const pageDesc = style({
  marginBottom: 16,
});

export const statsSection = style({
  marginBottom: 24,
});

export const statsGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: 12,
  marginBottom: 16,
});

export const statCard = style({
  padding: 12,
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--color-border)',
  boxShadow: 'var(--shadow-sm)',
});

export const statLabel = style({
  fontSize: 13,
  color: 'var(--color-text-muted)',
  marginBottom: 4,
  fontWeight: 500,
});

export const statValue = style({
  fontSize: 28,
  fontWeight: 700,
  color: 'var(--color-text)',
  marginBottom: 2,
});

export const statUnit = style({
  fontSize: 14,
  color: 'var(--color-text-muted)',
  marginLeft: 4,
});

export const statDetail = style({
  fontSize: 12,
  color: 'var(--color-text-muted)',
  marginTop: 4,
});

export const primaryStatCard = style([
  statCard,
  {
    backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, transparent)',
    borderColor: 'color-mix(in srgb, var(--color-primary) 30%, transparent)',
  },
]);

export const primaryStatValue = style([
  statValue,
  { color: 'var(--color-primary)' },
]);

export const cardGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: 16,
});

export const card = style({
  padding: 16,
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--color-border)',
  boxShadow: 'var(--shadow-sm)',
});

export const cardTitle = style({
  fontSize: 18,
  marginBottom: 8,
});

export const cardDesc = style({
  fontSize: 14,
  margin: 0,
});

export const cardLink = style({
  color: 'var(--color-primary)',
  fontWeight: 600,
  textDecoration: 'none',
});

export const cardLinkHover = style({
  selectors: {
    '&:hover': { textDecoration: 'underline' },
  },
});

export const sectionTitle = style({
  fontSize: 16,
  fontWeight: 600,
  color: 'var(--color-text)',
  marginBottom: 12,
});

export const chartSection = style({
  marginBottom: 24,
});

export const chartCard = style({
  padding: 16,
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--color-border)',
  boxShadow: 'var(--shadow-sm)',
});

export const chartEmpty = style({
  padding: 16,
  textAlign: 'center',
  color: 'var(--color-text-muted)',
});

export const growthUp = style({
  marginLeft: 4,
  color: '#10b981',
  fontWeight: 600,
});

export const growthDown = style({
  marginLeft: 4,
  color: '#ef4444',
  fontWeight: 600,
});
