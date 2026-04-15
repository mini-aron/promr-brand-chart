import { style } from '@vanilla-extract/css';

export const reentrustSectionTitle = style({
  marginBottom: 10,
  fontSize: 14,
  fontWeight: 700,
  color: 'var(--color-text)',
});

export const reentrustDetailHeader = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 12,
  paddingBottom: 12,
  marginBottom: 12,
  borderBottom: '1px solid var(--color-border)',
});

export const reentrustDetailHeaderIcon = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 44,
  height: 44,
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
  color: 'var(--color-primary)',
});

export const reentrustTierBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 36,
  height: 22,
  padding: '0 8px',
  borderRadius: 11,
  fontSize: 11,
  fontWeight: 700,
  lineHeight: 1,
  color: '#2563eb',
  backgroundColor: 'color-mix(in srgb, #3b82f6 18%, transparent)',
});

export const reentrustDetailHeaderText = style({
  flex: 1,
  minWidth: 0,
});

export const reentrustDetailTitle = style({
  margin: 0,
  fontSize: 16,
  fontWeight: 700,
  lineHeight: 1.3,
  letterSpacing: '-0.02em',
  color: 'var(--color-text)',
});

export const reentrustDetailTable = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  marginBottom: 12,
});

export const reentrustDetailRow = style({
  display: 'flex',
  gap: 10,
  fontSize: 13,
  lineHeight: 1.45,
});

export const reentrustDetailKey = style({
  flex: '0 0 100px',
  fontWeight: 600,
  color: 'var(--color-text-muted)',
});

export const reentrustDetailVal = style({
  flex: 1,
  minWidth: 0,
  color: 'var(--color-text)',
});

export const reentrustSubTitle = style({
  margin: '0 0 8px',
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--color-text-muted)',
});

export const reentrustDocSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  paddingTop: 12,
  borderTop: '1px solid var(--color-border)',
});

export const reentrustDocMenuRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 6,
});

export const reentrustSingleDocPill = style({
  display: 'inline-flex',
  alignItems: 'center',
  height: 30,
  padding: '0 10px',
  border: '1px solid color-mix(in srgb, var(--color-primary) 60%, var(--color-border))',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, var(--color-surface))',
  color: 'var(--color-primary)',
  fontSize: 12,
  fontWeight: 700,
});

export const reentrustDocMenuItem = style({
  padding: '6px 9px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, var(--color-surface))',
  color: 'var(--color-primary)',
  cursor: 'pointer',
  fontFamily: 'var(--font-family)',
  fontSize: 12,
  fontWeight: 700,
  selectors: {
    '&:hover': {
      borderColor: 'color-mix(in srgb, var(--color-primary) 60%, var(--color-border))',
    },
  },
});

export const reentrustDocMenuItemActive = style({
  borderColor: 'color-mix(in srgb, var(--color-primary) 80%, var(--color-border))',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 18%, var(--color-surface))',
});

export const reentrustDocMenuItemDisabled = style({
  opacity: 0.55,
  cursor: 'not-allowed',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text-muted)',
});

export const reentrustDocPeriodRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 12,
  padding: '8px 0',
  borderBottom: '1px solid var(--color-border)',
});

export const reentrustDocPeriodPair = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  fontSize: 13,
  lineHeight: 1.35,
});

export const reentrustDocPeriodLabel = style({
  fontWeight: 600,
  color: 'var(--color-text-muted)',
});

export const reentrustDocPeriodVal = style({
  fontWeight: 600,
  color: 'var(--color-text)',
});

export const reentrustDocPeriodDateInput = style({
  maxWidth: 168,
});

export const reentrustDocPreviewPanel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

export const reentrustDocPreviewTitleRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  minWidth: 0,
});

export const reentrustDocPreviewTitle = style({
  minWidth: 0,
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--color-text-muted)',
});

export const reentrustDocPreviewCounter = style({
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--color-text-muted)',
});

export const reentrustDocPreviewSwipe = style({
  position: 'relative',
  minWidth: 0,
  touchAction: 'none',
  userSelect: 'none',
  cursor: 'grab',
  selectors: {
    '&:active': {
      cursor: 'grabbing',
    },
  },
});

export const reentrustDocPreviewSwipeHint = style({
  margin: 0,
  fontSize: 11,
  fontWeight: 500,
  lineHeight: 1.35,
  color: 'var(--color-text-muted)',
});

export const reentrustDocPreviewImageWrap = style({
  minHeight: 160,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-background)',
  overflow: 'hidden',
});

export const reentrustDocPreviewImage = style({
  maxWidth: '100%',
  maxHeight: 220,
  objectFit: 'contain',
  cursor: 'zoom-in',
});

export const reentrustDocPreviewEmpty = style({
  minHeight: 160,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 'var(--radius-md)',
  border: '1px dashed var(--color-border)',
  backgroundColor: 'var(--color-background)',
  color: 'var(--color-text-muted)',
  fontSize: 12,
  fontWeight: 600,
});
