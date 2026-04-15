import { style, styleVariants } from '@vanilla-extract/css';

const iconBox = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 38,
  height: 38,
  borderRadius: 'var(--radius-sm)',
});

export const dashboardRow = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 10,
  marginBottom: 10,
});

export const statCard = style({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '10px 12px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
});

export const statCardIconWrap = styleVariants({
  review: [
    iconBox,
    {
      backgroundColor: 'color-mix(in srgb, #f97316 18%, transparent)',
      color: '#fb923c',
    },
  ],
  today: [
    iconBox,
    {
      backgroundColor: 'color-mix(in srgb, var(--color-primary) 18%, transparent)',
      color: 'var(--color-primary)',
    },
  ],
  new: [
    iconBox,
    {
      backgroundColor: 'color-mix(in srgb, #22c55e 18%, transparent)',
      color: '#22c55e',
    },
  ],
});

export const statCardValue = style({
  fontSize: 22,
  fontWeight: 700,
  lineHeight: 1.1,
  letterSpacing: '-0.02em',
  color: 'var(--color-text)',
});

export const statCardLabel = style({
  marginTop: 2,
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--color-text-muted)',
});
