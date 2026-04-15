import { style } from '@vanilla-extract/css';

/** 계약서 요청 모달 — 검토 페이지와 동일. 상위 패널보다 위에 보이도록 z-index 높게 */
export const requestModalOverlay = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'var(--color-overlay)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1300,
});

export const requestModalBox = style({
  width: 'min(420px, calc(100vw - 24px))',
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  padding: 20,
  boxShadow: 'var(--shadow-md)',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
});

export const requestModalTitle = style({
  fontSize: 16,
  fontWeight: 700,
  color: 'var(--color-text)',
});

export const requestModalDesc = style({
  margin: 0,
  fontSize: 13,
  color: 'var(--color-text-muted)',
  lineHeight: 1.5,
});

export const requestModalField = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
});

export const requestModalLabel = style({
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--color-text)',
});

export const requestModalLabelRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
});

export const requestModalExpiryDays = style({
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--color-text-muted)',
});

export const requestModalActions = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 8,
  marginTop: 4,
});

export const requestModalSegment = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
});

export const requestModalSegmentBtn = style({
  flex: '1 1 120px',
});

export const requestModalHint = style({
  margin: 0,
  fontSize: 12,
  color: 'var(--color-text-muted)',
  lineHeight: 1.45,
});

export const requestModalUploadRow = style({
  display: 'flex',
  gap: 8,
  flexWrap: 'wrap',
  alignItems: 'center',
});

export const requestModalFileInput = style({
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  border: 0,
});

export const requestModalUploadDropzone = style({
  border: '1px dashed var(--color-border)',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--color-bg)',
  padding: 10,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

export const requestModalFileSelectButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 32,
  padding: '0 12px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text)',
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  selectors: {
    '&:hover': { backgroundColor: 'var(--color-bg)' },
  },
});

export const requestModalFileName = style({
  flex: '1 1 180px',
  minWidth: 0,
  height: 32,
  padding: '0 10px',
  borderRadius: 'var(--radius-sm)',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text-muted)',
  fontSize: 12,
  display: 'inline-flex',
  alignItems: 'center',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});
