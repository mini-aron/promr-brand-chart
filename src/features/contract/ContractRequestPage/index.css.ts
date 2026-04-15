import { globalStyle, style, styleVariants } from '@vanilla-extract/css';

export { page } from '@/style/PageStyles.css';

export const main = style({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
});

export const layout = style({
  display: 'flex',
  gap: 16,
  flex: 1,
  minHeight: 0,
  minWidth: 0,
  marginTop: 8,
  alignItems: 'stretch',
});

export const leftPanel = style({
  flex: '1 1 67%',
  minWidth: 260,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  overflow: 'hidden',
});

export const panelTitle = style({
  margin: 0,
  padding: '12px 14px',
  fontSize: 14,
  fontWeight: 700,
  color: 'var(--color-text-muted)',
  borderBottom: '1px solid var(--color-border)',
  letterSpacing: '-0.02em',
});

export const treeFilterWrap = style({
  padding: '10px 12px',
  borderBottom: '1px solid var(--color-border)',
  backgroundColor: 'color-mix(in srgb, var(--color-text) 2%, var(--color-surface))',
});

export const treeFilterRow = style({
  display: 'flex',
  gap: 8,
  alignItems: 'center',
  flexWrap: 'wrap',
});

export const viewModeRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 10,
  flexWrap: 'wrap',
});

export const viewModeLabel = style({
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--color-text-muted)',
  letterSpacing: '-0.02em',
});

export const viewModeSwitch = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  padding: 4,
  borderRadius: '999px',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
});

export const viewModeButton = style({
  border: 'none',
  background: 'transparent',
  color: 'var(--color-text-muted)',
  borderRadius: '999px',
  padding: '6px 12px',
  fontSize: 12,
  fontWeight: 700,
  fontFamily: 'var(--font-family)',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease, color 0.15s ease',
  selectors: {
    '&:hover': {
      backgroundColor: 'color-mix(in srgb, var(--color-text) 6%, transparent)',
      color: 'var(--color-text)',
    },
  },
});

export const viewModeButtonActive = style({
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 14%, var(--color-surface))',
  color: 'var(--color-primary)',
});

export const treeFilterInput = style({
  flex: 1,
  minWidth: 0,
  height: 34,
});

export const treeFilterSelect = style({
  flex: '0 0 120px',
  height: 34,
  minWidth: 120,
  display: 'flex',
  alignItems: 'center',
});

/** 필터 줄 — 검토 열 표시/숨김 토글 */
export const treeFilterReviewToggle = style({
  flexShrink: 0,
  height: 34,
  whiteSpace: 'nowrap',
});

export const treeScroll = style({
  flex: 1,
  minHeight: 280,
  overflow: 'auto',
  padding: 0,
  backgroundColor: '#ffffff',
});

export const treeViewport = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  padding: 10,
});

export const treeEmpty = style({
  minHeight: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 24,
  color: 'var(--color-text-muted)',
  fontSize: 13,
  fontWeight: 600,
});

export const treeNodeGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
});

export const treeNodeRow = style({
  display: 'flex',
  alignItems: 'stretch',
  gap: 6,
  minWidth: 0,
});

export const treeChildren = style({
  marginLeft: 11,
  paddingLeft: 16,
  borderLeft: '1px dashed color-mix(in srgb, var(--color-text) 14%, transparent)',
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
});

export const treeRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  width: '100%',
  padding: '8px 10px',
  marginBottom: 2,
  borderRadius: 'var(--radius-md)',
  border: '1px solid transparent',
  backgroundColor: 'transparent',
  cursor: 'pointer',
  textAlign: 'left',
  fontFamily: 'var(--font-family)',
  transition: 'background-color 0.12s, border-color 0.12s',
  outline: 'none',
  selectors: {
    '&:hover': {
      backgroundColor: 'color-mix(in srgb, var(--color-text) 4%, transparent)',
    },
    '&:focus-visible': {
      boxShadow: '0 0 0 2px color-mix(in srgb, var(--color-primary) 35%, transparent)',
    },
  },
});

export const treeRowSelected = style({
  borderColor: 'var(--color-primary)',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, var(--color-surface))',
});

export const treeRowRoot = style({
  padding: '12px 10px',
  marginBottom: 6,
});

export const expandBtn = style({
  flexShrink: 0,
  width: 24,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  borderRadius: 'var(--radius-sm)',
  background: 'transparent',
  color: 'var(--color-text-muted)',
  cursor: 'pointer',
  padding: 0,
  selectors: {
    '&:hover': {
      backgroundColor: 'color-mix(in srgb, var(--color-text) 8%, transparent)',
    },
  },
});

export const expandPlaceholder = style({
  width: 24,
  flexShrink: 0,
});

export const statusDot = styleVariants({
  complete: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: 6,
    backgroundColor: 'var(--color-success)',
  },
  warning: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: 6,
    backgroundColor: '#f59e0b',
  },
  error: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
    marginTop: 6,
    backgroundColor: 'var(--color-error)',
  },
});

export const treeIconWrap = style({
  flexShrink: 0,
  width: 28,
  height: 28,
  borderRadius: 'var(--radius-sm)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 14%, transparent)',
  color: 'var(--color-primary)',
});

export const treeBody = style({
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  minWidth: 0,
  gap: 8,
});

export const treeTextColumn = style({
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
});

export const treeStatusDot = style({
  marginTop: 0,
});

export const treeName = style({
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--color-text)',
  lineHeight: 1.35,
});

export const tierLogoBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 10,
  fontWeight: 700,
  color: '#2563eb',
  lineHeight: 1,
});

export const treeMeta = style({
  fontSize: 11,
  color: 'var(--color-text-muted)',
  marginTop: 2,
});

export const matrixTableWrap = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
});

export const matrixTable = style({
  width: 'max-content',
  borderCollapse: 'separate',
  borderSpacing: 0,
  tableLayout: 'fixed',
  backgroundColor: '#eef1f5',
});

/**
 * DataTable `variant="plain"` → TableStyles `tableWrapPlain table { width: 100% }` 가
 * 단일 `.matrixTable` 보다 우선해 테이블이 항상 가로 꽉 참. 래퍼+table로 덮어씀.
 */
globalStyle(`${matrixTableWrap} table.${matrixTable}`, {
  width: 'max-content',
  borderCollapse: 'separate',
});

globalStyle(`${matrixTable} thead th`, {
  padding: '6px 8px',
  textAlign: 'center',
  color: 'var(--color-text-muted)',
  backgroundColor: 'color-mix(in srgb, var(--color-text) 4%, var(--color-surface))',
  borderRight: '1px solid #d8dee8',
  borderBottom: '1px solid #d8dee8',
  verticalAlign: 'middle',
  boxSizing: 'border-box',
});

globalStyle(`${matrixTable} thead tr:first-child th`, {
  borderTop: '1px solid #d8dee8',
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--color-text)',
});

globalStyle(`${matrixTable} thead tr:last-child th`, {
  fontSize: 10,
  fontWeight: 600,
});

globalStyle(`${matrixTable} thead th:first-child`, {
  borderLeft: '1px solid #d8dee8',
});

globalStyle(`${matrixTable} tbody td`, {
  padding: 0,
  height: 30,
  boxSizing: 'border-box',
  borderRight: '1px solid #d8dee8',
  borderBottom: '1px solid #d8dee8',
  verticalAlign: 'middle',
});

globalStyle(`${matrixTable} tbody tr:first-child td`, {
  borderTop: '1px solid #d8dee8',
});

globalStyle(`${matrixTable} tbody td:first-child`, {
  borderLeft: '1px solid #d8dee8',
});

globalStyle(`${matrixTable} tfoot td`, {
  padding: '0 6px',
  height: 28,
  boxSizing: 'border-box',
  borderRight: '1px solid #d8dee8',
  borderBottom: '1px solid #d8dee8',
  verticalAlign: 'middle',
});

globalStyle(`${matrixTable} tfoot td:first-child`, {
  borderLeft: '1px solid #d8dee8',
});

export const matrixFooterRow = style({
  selectors: {
    '&&': {
      fontSize: 11,
      fontWeight: 700,
      color: 'var(--color-text-muted)',
      backgroundColor: 'color-mix(in srgb, var(--color-text) 6%, var(--color-surface))',
    },
  },
});

export const matrixFooterTier = style({
  selectors: {
    '&&': {
      width: 48,
      minWidth: 48,
      maxWidth: 48,
      textAlign: 'center',
      fontSize: 10,
      userSelect: 'none',
    },
  },
});

export const matrixFooterReview = style({
  selectors: {
    '&&': {
      width: 44,
      minWidth: 44,
      maxWidth: 44,
      padding: '0 2px',
      textAlign: 'center',
      fontSize: 9,
      fontWeight: 700,
      letterSpacing: '-0.03em',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      userSelect: 'none',
    },
  },
});

export const matrixFooterName = style({
  selectors: {
    '&&': {
      width: 140,
      minWidth: 140,
      maxWidth: 140,
      padding: '0 8px',
      textAlign: 'right',
      fontVariantNumeric: 'tabular-nums',
      userSelect: 'none',
    },
  },
});

export const matrixTierCell = style({
  /** `tbody td` 전역보다 우선 (구체성 ↑) */
  selectors: {
    '&&': {
      boxSizing: 'border-box',
      width: 48,
      minWidth: 48,
      maxWidth: 48,
      padding: '0 4px',
      textAlign: 'center',
      verticalAlign: 'middle',
      fontSize: 11,
      fontWeight: 700,
      color: 'var(--color-primary-hover)',
      backgroundColor: 'color-mix(in srgb, var(--color-primary) 14%, var(--color-surface))',
      whiteSpace: 'nowrap',
      cursor: 'pointer',
    },
  },
});

/** 선택된 차수 열 — border 대신 ::after로 그려 셀마다 테두리가 끊기지 않음 */
export const matrixTierCellSelected = style({
  selectors: {
    '&&': {
      position: 'relative',
      zIndex: 1,
      backgroundColor: 'color-mix(in srgb, var(--color-primary) 28%, var(--color-surface))',
      color: 'var(--color-primary-hover)',
    },
    '&&::after': {
      content: '""',
      position: 'absolute',
      inset: '-1px',
      border: '1px solid var(--color-primary)',
      pointerEvents: 'none',
    },
  },
});

/** 파일 순서: `matrixNameCellSelected`가 뒤에 와야 `overflow: visible`이 말줄임 `overflow: hidden`을 이김(선택 링 상·하 표시) */
export const matrixNameCell = style({
  selectors: {
    '&&': {
      boxSizing: 'border-box',
      width: 140,
      maxWidth: 140,
      minWidth: 140,
      padding: '0 8px',
      fontSize: 13,
      fontWeight: 500,
      color: '#1f2937',
      backgroundColor: '#ffffff',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      cursor: 'pointer',
    },
  },
});

export const matrixNameCellSelected = style({
  selectors: {
    '&&': {
      position: 'relative',
      zIndex: 1,
      overflow: 'visible',
      backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, var(--color-surface))',
    },
    '&&::after': {
      content: '""',
      position: 'absolute',
      inset: '-1px',
      border: '1px solid var(--color-primary)',
      pointerEvents: 'none',
    },
  },
});

export const matrixTierEmptyCell = style({
  selectors: {
    '&&': {
      boxSizing: 'border-box',
      width: 48,
      minWidth: 48,
      maxWidth: 48,
      backgroundColor: '#eef1f5',
    },
  },
});

export const matrixNameEmptyCell = style({
  selectors: {
    '&&': {
      boxSizing: 'border-box',
      width: 140,
      maxWidth: 140,
      minWidth: 140,
      backgroundColor: '#eef1f5',
    },
  },
});

export const matrixReviewCellInner = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 3,
  width: '100%',
  minWidth: 0,
});

export const matrixReviewDot = style({
  selectors: {
    '&&': {
      marginTop: 0,
      width: 6,
      height: 6,
      flexShrink: 0,
    },
  },
});

export const matrixReviewAbbrev = style({
  fontSize: 9,
  fontWeight: 600,
  lineHeight: 1,
  color: 'var(--color-text)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

export const matrixReviewCell = style({
  selectors: {
    '&&': {
      boxSizing: 'border-box',
      width: 44,
      minWidth: 44,
      maxWidth: 44,
      padding: '0 2px',
      textAlign: 'center',
      verticalAlign: 'middle',
      fontSize: 9,
      backgroundColor: '#ffffff',
      cursor: 'pointer',
    },
  },
});

export const matrixReviewCellSelected = style({
  selectors: {
    '&&': {
      position: 'relative',
      zIndex: 1,
      backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, var(--color-surface))',
    },
    '&&::after': {
      content: '""',
      position: 'absolute',
      inset: '-1px',
      border: '1px solid var(--color-primary)',
      pointerEvents: 'none',
    },
  },
});

export const matrixReviewEmptyCell = style({
  selectors: {
    '&&': {
      boxSizing: 'border-box',
      width: 44,
      minWidth: 44,
      maxWidth: 44,
      backgroundColor: '#eef1f5',
    },
  },
});

export const rightPanel = style({
  flex: '0 0 33%',
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 'var(--radius-lg)',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  overflow: 'hidden',
});

export const detailHeader = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: 14,
  padding: '18px 18px 14px',
  borderBottom: '1px solid var(--color-border)',
});

export const detailSplit = style({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
});

export const leftInfo = style({
  minWidth: 280,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
});

export const rightDocs = style({
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const detailHeaderIcon = style({
  width: 48,
  height: 48,
  borderRadius: 'var(--radius-md)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, transparent)',
  color: 'var(--color-primary)',
});

export const detailHeaderText = style({
  flex: 1,
  minWidth: 0,
});

export const detailTitle = style({
  margin: 0,
  fontSize: 20,
  fontWeight: 700,
  color: 'var(--color-text)',
  letterSpacing: '-0.02em',
});

export const tierLogoBadgeLarge = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 38,
  height: 24,
  padding: '0 8px',
  borderRadius: 12,
  fontSize: 12,
  fontWeight: 700,
  color: '#2563eb',
  backgroundColor: 'color-mix(in srgb, #3b82f6 18%, transparent)',
  lineHeight: 1,
});

export const statusBadge = styleVariants({
  complete: {
    display: 'inline-block',
    marginTop: 8,
    padding: '4px 10px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 12,
    fontWeight: 700,
    backgroundColor: 'color-mix(in srgb, var(--color-success) 14%, transparent)',
    color: 'var(--color-success)',
  },
  warning: {
    display: 'inline-block',
    marginTop: 8,
    padding: '4px 10px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 12,
    fontWeight: 700,
    backgroundColor: 'color-mix(in srgb, #f59e0b 16%, transparent)',
    color: '#d97706',
  },
  error: {
    display: 'inline-block',
    marginTop: 8,
    padding: '4px 10px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 12,
    fontWeight: 700,
    backgroundColor: 'color-mix(in srgb, var(--color-error) 14%, transparent)',
    color: 'var(--color-error)',
  },
});

export const detailTable = style({
  padding: '14px 18px',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
});

export const detailRow = style({
  display: 'flex',
  gap: 12,
  fontSize: 13,
  lineHeight: 1.45,
});

export const detailKey = style({
  flex: '0 0 120px',
  color: 'var(--color-text-muted)',
  fontWeight: 600,
});

export const detailVal = style({
  flex: 1,
  color: 'var(--color-text)',
});

export const docMarkYes = style({
  fontWeight: 600,
  color: 'var(--color-success)',
});

export const docMarkNo = style({
  fontWeight: 600,
  color: 'var(--color-text-muted)',
});

export const docCardGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: 10,
});

export const docInlineRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  alignItems: 'center',
});

export const docInlineItem = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  padding: '8px 10px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  minHeight: 36,
});

export const docInlineLabel = style({
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--color-text)',
});

export const docInlineActions = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
});

export const docInlineActionsDisabled = style({
  opacity: 0.6,
});

export const docCard = style({
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
});

export const docCardDisabled = style({
  opacity: 0.6,
});

export const docCardThumb = style({
  height: 78,
  backgroundColor: 'var(--color-background)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--color-text-muted)',
  fontSize: 12,
  fontWeight: 700,
  letterSpacing: '-0.02em',
});

export const docCardBody = style({
  padding: '10px 10px 12px',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
});

export const docCardTitleRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
});

export const docCardTitle = style({
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--color-text)',
});

export const docCardActions = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 6,
});

export const detailAction = style({
  padding: '0 18px 16px',
});

export const docSection = style({
  flexShrink: 0,
  padding: '14px 18px',
  borderTop: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

export const docMenuSection = style({
  padding: '14px 18px',
  borderBottom: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
});

export const docMenuRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  alignItems: 'center',
});

export const docMenuItem = style({
  border: '1px solid var(--color-border)',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, var(--color-surface))',
  color: 'var(--color-primary)',
  borderRadius: 'var(--radius-md)',
  padding: '7px 10px',
  cursor: 'pointer',
  fontFamily: 'var(--font-family)',
  selectors: {
    '&:hover': {
      borderColor: 'color-mix(in srgb, var(--color-primary) 60%, var(--color-border))',
    },
  },
});

export const docMenuItemActive = style({
  borderColor: 'color-mix(in srgb, var(--color-primary) 80%, var(--color-border))',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 18%, var(--color-surface))',
  color: 'var(--color-primary)',
});

export const docMenuItemDisabled = style({
  opacity: 0.55,
  cursor: 'not-allowed',
  backgroundColor: 'var(--color-surface)',
  color: 'var(--color-text-muted)',
});

export const docMenuLabel = style({
  fontSize: 13,
  fontWeight: 700,
  color: 'inherit',
});

export const docMenuActions = style({
  display: 'flex',
  justifyContent: 'flex-end',
});

export const docPreviewPanel = style({
  flex: 1,
  minHeight: 0,
  padding: '14px 18px 12px',
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  overflow: 'auto',
});

export const docPreviewTitle = style({
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--color-text-muted)',
  letterSpacing: '-0.02em',
});

export const docPreviewImageWrap = style({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-background)',
  overflow: 'hidden',
});

export const docPreviewImage = style({
  maxWidth: '100%',
  maxHeight: '100%',
  width: 'auto',
  height: 'auto',
  objectFit: 'contain',
  cursor: 'zoom-in',
});

export const docPreviewEmpty = style({
  flex: 1,
  minHeight: 0,
  borderRadius: 'var(--radius-md)',
  border: '1px dashed var(--color-border)',
  backgroundColor: 'var(--color-background)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--color-text-muted)',
  fontSize: 12,
  fontWeight: 600,
});

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

export const previewModalTitleBlock = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  minWidth: 0,
  flex: 1,
});

export const previewModalDocKind = style({
  fontSize: 18,
  fontWeight: 800,
  letterSpacing: '-0.02em',
  color: 'var(--color-text)',
  lineHeight: 1.25,
  minWidth: 0,
});

export const previewModalTitleSub = style({
  fontSize: 12,
  fontWeight: 500,
  color: 'var(--color-text-muted)',
  lineHeight: 1.35,
  minWidth: 0,
});

export const previewModalDocIndex = style({
  fontWeight: 700,
  color: 'var(--color-primary)',
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

export const previewModalBodyInner = style({
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const previewModalNavSide = style({
  position: 'absolute',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 2,
});

export const previewModalNavBtn = style([
  previewModalNavSide,
  {
    width: 60,
    height: 60,
    minWidth: 60,
    minHeight: 60,
    padding: 0,
    borderRadius: '50%',
    backgroundColor: 'color-mix(in srgb, var(--color-surface) 92%, transparent)',
    border: '1px solid var(--color-border)',
    selectors: {
      '&:disabled': {
        opacity: 0.35,
        cursor: 'not-allowed',
      },
      '&:not(:disabled):hover': {
        backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, var(--color-surface))',
        borderColor: 'color-mix(in srgb, var(--color-primary) 35%, var(--color-border))',
      },
    },
  },
]);

export const previewModalNavPrev = style({ left: 50 });

export const previewModalNavNext = style({ right: 50 });

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

export const subSection = style({
  flexShrink: 0,
  padding: '14px 18px',
  borderTop: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
});

export const subSectionTitle = style({
  margin: '0 0 10px',
  fontSize: 13,
  fontWeight: 700,
  color: 'var(--color-text-muted)',
});

/** 직계 행이 많을 때 높이 상한 — 미리보기 flex 영역 확보 */
export const subTableViewport = style({
  maxHeight: 220,
  overflowY: 'auto',
  overflowX: 'hidden',
  flexShrink: 0,
});

export const subTable = style({
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
  fontSize: 12,
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  overflow: 'hidden',
});

globalStyle(`${subTable} tbody tr:last-child td`, {
  borderBottom: 'none',
});

export const subTableTh = style({
  padding: '8px 10px',
  textAlign: 'left',
  fontWeight: 700,
  color: 'var(--color-text-muted)',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, var(--color-surface))',
  borderBottom: '1px solid var(--color-border)',
});

export const subTableThStatus = style({
  width: 56,
  textAlign: 'center',
});

export const subTableTd = style({
  padding: '8px 10px',
  verticalAlign: 'middle',
  borderBottom: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-surface)',
});

export const subTableTdName = style({
  fontWeight: 600,
  color: 'var(--color-text)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
});

export const subTableTdStatus = style({
  textAlign: 'center',
});

export const subTableRow = style({
  cursor: 'pointer',
});

globalStyle(`${subTableRow}:hover td`, {
  backgroundColor: 'color-mix(in srgb, var(--color-text) 4%, var(--color-surface))',
});

/** 선택 행 마커 — 배경은 아래 globalStyle */
export const subTableRowSelected = style({
  selectors: {
    '&&': {
      fontWeight: 'inherit',
    },
  },
});

globalStyle(`${subTableRowSelected} td`, {
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, var(--color-surface))',
});

globalStyle(`${subTableRowSelected}:hover td`, {
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 14%, var(--color-surface))',
});

export const subTableStatusDot = style({
  marginTop: 0,
});
