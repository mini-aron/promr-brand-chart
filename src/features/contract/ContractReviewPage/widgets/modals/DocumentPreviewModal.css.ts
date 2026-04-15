import { style } from '@vanilla-extract/css';

export const previewModalOverlay = style({
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1100,
  backgroundColor: 'var(--color-overlay)',
});

export const previewModalBox = style({
  display: 'flex',
  width: '100vw',
  height: '100vh',
  overflow: 'hidden',
  backgroundColor: 'var(--color-surface)',
});

export const previewModalMain = style({
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const previewModalSideList = style({
  width: 272,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  borderRight: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-background)',
});

export const previewModalSideListRail = style({
  width: 44,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: 8,
  paddingBottom: 8,
  borderRight: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-background)',
});

export const previewModalSideListTitleRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  padding: '8px 8px 8px 14px',
  borderBottom: '1px solid var(--color-border)',
});

export const previewModalSideListHeading = style({
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--color-text-muted)',
  letterSpacing: '-0.02em',
});

export const previewModalSideListScroll = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: 6,
  padding: 8,
  overflowY: 'auto',
  flex: 1,
  minHeight: 0,
  textAlign: 'left',
});

export const previewModalSideEmpty = style({
  margin: 0,
  padding: '8px 4px',
  fontSize: 12,
  lineHeight: 1.45,
  color: 'var(--color-text-muted)',
  textAlign: 'left',
});

export const previewModalSideItem = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 10,
  padding: '10px',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--color-surface)',
  cursor: 'pointer',
  font: 'inherit',
  color: 'inherit',
  transition: 'border-color 0.15s, background-color 0.15s',
  selectors: {
    '&:hover': {
      borderColor: 'color-mix(in srgb, var(--color-primary) 35%, var(--color-border))',
      backgroundColor: 'color-mix(in srgb, var(--color-primary) 5%, var(--color-background))',
    },
    '&:focus-visible': {
      outline: '2px solid var(--color-primary)',
      outlineOffset: 2,
    },
  },
});

export const previewModalSideItemActive = style({
  borderColor: 'var(--color-primary)',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, var(--color-surface))',
});

export const previewModalSideItemBody = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 6,
});

export const previewModalSideItemTitle = style({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: 13,
  fontWeight: 700,
  lineHeight: 1.3,
  color: 'var(--color-text)',
});

export const previewModalSideItemReceived = style({
  fontSize: 11,
  lineHeight: 1.35,
  fontWeight: 500,
  color: 'var(--color-text-muted)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%',
});

export const previewModalHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
  padding: '10px 12px',
  borderBottom: '1px solid var(--color-border)',
});

export const previewModalHeaderMain = style({
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
});

export const previewModalHeaderSub = style({
  display: 'flex',
  gap: 8,
});

export const previewModalCorpRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  minWidth: 0,
});

export const previewModalCorpName = style({
  minWidth: 0,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: 17,
  fontWeight: 800,
  lineHeight: 1.25,
  color: 'var(--color-text)',
});

export const previewModalStatusChip = style({});

export const previewModalDocName = style({
  minWidth: 0,
  maxWidth: '100%',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: 16,
  fontWeight: 700,
  lineHeight: 1.3,
  color: 'var(--color-text)',
});

export const previewModalStackNav = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap',
});

export const previewModalStackNavCounter = style({
  minWidth: 44,
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--color-text)',
  fontVariantNumeric: 'tabular-nums',
  textAlign: 'center',
});

export const previewModalActions = style({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
});

export const previewModalBody = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  overflow: 'hidden',
  backgroundColor: 'var(--color-background)',
  flex: 1,
  minHeight: 0,
});

export const previewModalImageArea = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minWidth: 0,
  minHeight: 0,
});

export const previewModalImageWrap = style({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  pointerEvents: 'none',
  flex: 1,
  minHeight: 0,
});

export const previewModalImage = style({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain',
  transformOrigin: 'center',
  userSelect: 'none',
  cursor: 'grab',
  touchAction: 'none',
  pointerEvents: 'auto',
});

export const previewModalImageDragging = style({
  cursor: 'grabbing',
});

export const previewModalImageNoPan = style({
  cursor: 'default',
});

export const previewModalRightPanel = style({
  width: 320,
  maxWidth: '38vw',
  minWidth: 260,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: 16,
  padding: '16px 14px',
  borderLeft: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
});

export const previewModalRightPanelTitle = style({
  margin: 0,
  fontSize: 15,
  fontWeight: 800,
  color: 'var(--color-text)',
  lineHeight: 1.3,
});

export const previewModalDateRow = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: 12,
});

export const previewModalDateField = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  minWidth: 180,
});

export const previewModalDateLabel = style({
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--color-text-muted)',
  lineHeight: 1.2,
});

export const previewModalFooterActions = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  gap: 10,
  flexWrap: 'wrap',
});
