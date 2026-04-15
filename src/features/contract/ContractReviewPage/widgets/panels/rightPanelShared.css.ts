import { style, styleVariants } from '@vanilla-extract/css';

export const previewTitle = style({
  marginBottom: 6,
  fontSize: 14,
  fontWeight: 700,
  color: 'var(--color-text)',
});

export const previewImageWrap = style({
  minHeight: 180,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-background)',
  overflow: 'hidden',
  flex: 1,
});

export const previewImage = style({
  maxWidth: '100%',
  maxHeight: 200,
  objectFit: 'contain',
  cursor: 'zoom-in',
});

export const previewFileMeta = style({
  marginTop: 6,
  fontSize: 12,
  color: 'var(--color-text-muted)',
  textAlign: 'center',
  wordBreak: 'break-all',
});

export const previewEmptyBox = style({
  minHeight: 120,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 12,
  borderRadius: 'var(--radius-md)',
  border: '1px dashed var(--color-border)',
  backgroundColor: 'var(--color-background)',
  flex: 1,
});

export const previewPlaceholder = style({
  fontSize: 13,
  color: 'var(--color-text-muted)',
  textAlign: 'center',
});

export const kvBlock = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  marginTop: 8,
});

export const kvRow = style({
  display: 'flex',
  gap: 12,
  fontSize: 13,
  lineHeight: 1.45,
});

export const kvKey = style({
  flex: '0 0 100px',
  fontWeight: 600,
  color: 'var(--color-text-muted)',
});

export const kvVal = style({
  flex: 1,
  minWidth: 0,
  color: 'var(--color-text)',
});

export const kvDateInput = style({
  width: '100%',
  maxWidth: 200,
});

export const submittedDocsText = style({
  marginTop: 8,
  fontSize: 12,
  lineHeight: 1.5,
  color: 'var(--color-text-muted)',
});

export const submittedDocsGrid = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 6,
  marginTop: 8,
});

export const submittedDocRow = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '6px 9px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, var(--color-surface))',
  color: 'var(--color-primary)',
  cursor: 'pointer',
  fontFamily: 'var(--font-family)',
  fontSize: 12,
  fontWeight: 700,
  selectors: {
    '&:not(:disabled):hover': {
      borderColor: 'color-mix(in srgb, var(--color-primary) 60%, var(--color-border))',
    },
    '&:disabled': {
      opacity: 0.55,
      cursor: 'not-allowed',
      backgroundColor: 'var(--color-surface)',
      color: 'var(--color-text-muted)',
    },
  },
});

export const submittedDocLabel = style({
  fontSize: 12,
  color: 'inherit',
  fontWeight: 700,
});

export const submittedDocRowActive = style({
  borderColor: 'color-mix(in srgb, var(--color-primary) 80%, var(--color-border))',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 18%, var(--color-surface))',
});

export const actionRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
  marginTop: 12,
  paddingTop: 8,
  borderTop: '1px solid var(--color-border)',
});
