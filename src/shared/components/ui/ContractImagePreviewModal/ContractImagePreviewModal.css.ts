import { style } from '@vanilla-extract/css';

/** DealerViewPage(제약사) 계약 이미지 뷰어와 동일 레이아웃 */
export const previewModalOverlay = style({
  position: 'fixed',
  inset: 0,
  backgroundColor: 'var(--color-overlay)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1100,
});

export const previewModalBox = style({
  width: '100vw',
  height: '100vh',
  backgroundColor: 'var(--color-surface)',
  borderRadius: 0,
  border: 'none',
  boxShadow: 'none',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

export const previewModalHeader = style({
  padding: '10px 12px',
  borderBottom: '1px solid var(--color-border)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
});

export const previewModalTitle = style({
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--color-text-muted)',
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const previewModalActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
});

export const previewModalBody = style({
  flex: 1,
  minHeight: 0,
  backgroundColor: 'var(--color-background)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
});

export const previewModalImage = style({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
  transformOrigin: 'center',
  userSelect: 'none',
  cursor: 'grab',
  touchAction: 'none',
});

export const previewModalImageDragging = style({
  cursor: 'grabbing',
});

export const previewModalImageNoPan = style({
  cursor: 'default',
});
