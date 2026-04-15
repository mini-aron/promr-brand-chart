import { style, styleVariants } from '@vanilla-extract/css';

const statusPill = style({
  display: 'inline-block',
  padding: '4px 10px',
  fontSize: 12,
  fontWeight: 700,
});

export const listRowReentrustStatusBadge = style({});

export const statusBadge = styleVariants({
  needReview: [
    statusPill,
    {
      fontWeight: 600,
      borderRadius: 4,
      backgroundColor: 'color-mix(in srgb, #f97316 14%, transparent)',
      color: '#fb923c',
    },
  ],
  done: [
    statusPill,
    {
      fontWeight: 600,
      borderRadius: 4,
      backgroundColor: 'color-mix(in srgb, var(--color-success) 14%, transparent)',
      color: 'var(--color-success)',
    },
  ],
  requested: [
    statusPill,
    {
      fontWeight: 600,
      borderRadius: 4,
      backgroundColor: 'color-mix(in srgb, #7c3aed 14%, transparent)',
      color: '#7c3aed',
    },
  ],
});

export const reentrustStatusBadge = styleVariants({
  complete: [
    statusPill,
    {
      marginTop: 6,
      borderRadius: 'var(--radius-sm)',
      backgroundColor: 'color-mix(in srgb, var(--color-success) 14%, transparent)',
      color: 'var(--color-success)',
    },
  ],
  warning: [
    statusPill,
    {
      marginTop: 6,
      borderRadius: 'var(--radius-sm)',
      backgroundColor: 'color-mix(in srgb, #f59e0b 16%, transparent)',
      color: '#d97706',
    },
  ],
  error: [
    statusPill,
    {
      marginTop: 6,
      borderRadius: 'var(--radius-sm)',
      backgroundColor: 'color-mix(in srgb, var(--color-error) 14%, transparent)',
      color: 'var(--color-error)',
    },
  ],
});
