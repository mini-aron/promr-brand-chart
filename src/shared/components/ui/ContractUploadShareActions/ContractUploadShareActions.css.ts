import { style } from '@vanilla-extract/css';

export const triggerWrap = style({
  display: 'inline-flex',
});

export const managementOverlay = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'var(--color-overlay)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1200,
  padding: 16,
});

export const managementBox = style({
  width: '100%',
  maxWidth: 560,
  maxHeight: 'min(90vh, 720px)',
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  boxShadow: '0 16px 48px color-mix(in srgb, var(--color-text) 12%, transparent)',
  minHeight: 0,
});

export const managementHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '14px 16px',
  borderBottom: '1px solid var(--color-border)',
  flexShrink: 0,
});

export const managementTitle = style({
  margin: 0,
  fontSize: 16,
  fontWeight: 700,
  color: 'var(--color-text)',
});

export const managementScroll = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  padding: '12px 16px 16px',
});
