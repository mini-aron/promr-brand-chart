import { style, styleVariants } from '@vanilla-extract/css';

export const leftColumn = style({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
});

export const leftColumnFullWidth = style({
  flex: 1,
  maxWidth: '100%',
});

export const reviewStatusSelectWrap = style({
  display: 'flex',
  alignItems: 'center',
  width: 'min(200px, 100%)',
});

export const listFiltersRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  gap: 12,
  rowGap: 10,
  padding: '6px 8px',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--color-background)',
  border: '1px solid var(--color-border)',
});

export const listFiltersChannelGroup = style({
  display: 'inline-flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 8,
  minWidth: 0,
});

export const listFiltersGroup = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 6,
  minWidth: 0,
});

export const listFiltersStatusGroup = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
});

export const listFiltersFieldLabel = style({
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: 13,
  fontWeight: 600,
  lineHeight: 1.25,
  color: 'var(--color-text-muted)',
  whiteSpace: 'nowrap',
});

export const listStatusLegend = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  padding: '8px 10px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid color-mix(in srgb, var(--color-border) 70%, transparent)',
  backgroundColor: 'color-mix(in srgb, var(--color-border) 22%, var(--color-surface))',
  fontSize: 11,
  fontWeight: 500,
  color: 'var(--color-text-muted)',
});

export const listStatusLegendRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 10,
  rowGap: 6,
});

export const listStatusLegendTitle = style({
  fontWeight: 700,
  letterSpacing: '-0.02em',
});

export const listStatusLegendItems = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 12,
  rowGap: 4,
});

export const listStatusLegendItem = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 5,
  whiteSpace: 'nowrap',
});

export const listStatusLegendDot = style({
  width: 8,
  height: 8,
  borderRadius: 999,
});

export const listStatusLegendDotComplete = style({
  backgroundColor: 'var(--color-success)',
});

export const listStatusLegendDotNeedReview = style({
  backgroundColor: '#fb923c',
});

export const listStatusLegendDotDenied = style({
  backgroundColor: 'var(--color-error)',
});

export const listStatusLegendDotRequested = style({
  backgroundColor: '#7c3aed',
});

export const listTypeTabsRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
});

export const listTypeTabs = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  padding: 2,
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--color-background)',
  border: '1px solid var(--color-border)',
});

export const listTypeTabsAction = style({});

export const listTypeTab = style({
  appearance: 'none',
  border: '1px solid transparent',
  backgroundColor: 'transparent',
  color: 'var(--color-text-muted)',
  fontSize: 13,
  fontWeight: 600,
  lineHeight: 1.25,
  padding: '6px 10px',
  borderRadius: 'var(--radius-sm)',
  cursor: 'pointer',
});

export const listTypeTabActive = style({
  backgroundColor: 'var(--color-surface)',
  borderColor: 'var(--color-primary)',
  color: 'var(--color-text)',
});

export const channelTab = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  padding: '6px 12px',
  borderRadius: 'var(--radius-md)',
  fontSize: 13,
  fontWeight: 500,
  fontFamily: 'var(--font-family)',
  lineHeight: 1.25,
  cursor: 'pointer',
  border: '1px solid transparent',
  color: 'var(--color-text)',
  transition: 'background-color 0.15s, border-color 0.15s, font-weight 0.15s, transform 0.1s',
  selectors: {
    '&:focus-visible': {
      outline: '2px solid var(--color-primary)',
      outlineOffset: 2,
    },
    '&:active:not(:disabled)': {
      transform: 'translateY(1px)',
    },
  },
});

export const channelTabIcon = style({
  color: 'var(--color-text-muted)',
});

export const channelTabIconActive = style({
  color: 'var(--color-text)',
});

export const channelTabInactive = style({
  backgroundColor: 'var(--color-surface)',
  borderColor: 'var(--color-border)',
});

export const channelTabActive = styleVariants({
  all: {
    fontWeight: 600,
    backgroundColor: 'color-mix(in srgb, var(--color-primary) 12%, var(--color-surface))',
    borderColor: 'var(--color-primary)',
  },
  email: {
    fontWeight: 600,
    backgroundColor: 'color-mix(in srgb, #0ea5e9 9%, var(--color-surface))',
    borderColor: 'color-mix(in srgb, #0ea5e9 55%, var(--color-border))',
  },
  kakao: {
    fontWeight: 600,
    backgroundColor: 'color-mix(in srgb, #ca8a04 8%, var(--color-surface))',
    borderColor: 'color-mix(in srgb, #ca8a04 45%, var(--color-border))',
  },
  link: {
    fontWeight: 600,
    backgroundColor: 'color-mix(in srgb, #7c3aed 9%, var(--color-surface))',
    borderColor: 'color-mix(in srgb, #7c3aed 48%, var(--color-border))',
  },
});

export const listWrap = style({
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: 6,
  paddingRight: 4,
  minHeight: 0,
  width: '100%',
  textAlign: 'left',
});

export const listItem = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'flex-start',
  gap: 10,
  padding: '10px 12px',
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-background)',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'border-color 0.15s, background-color 0.15s',
  selectors: {
    '&:hover': {
      borderColor: 'color-mix(in srgb, var(--color-primary) 35%, var(--color-border))',
      backgroundColor: 'color-mix(in srgb, var(--color-primary) 5%, var(--color-background))',
    },
  },
});

export const listItemSelected = style({
  borderColor: 'var(--color-primary)',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, var(--color-background))',
});

export const listItemRow = style({
  display: 'flex',
  gap: 0,
  borderRadius: 'var(--radius-md)',
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-background)',
  transition: 'border-color 0.15s, background-color 0.15s',
  selectors: {
    '&:hover': {
      borderColor: 'color-mix(in srgb, var(--color-primary) 35%, var(--color-border))',
      backgroundColor: 'color-mix(in srgb, var(--color-primary) 5%, var(--color-background))',
    },
  },
});

export const listItemRowSelected = style({
  borderColor: 'var(--color-primary)',
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, var(--color-background))',
});

export const listItemMain = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  gap: 10,
  padding: '8px 6px 8px 12px',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  font: 'inherit',
  color: 'inherit',
  selectors: {
    '&:focus-visible': {
      outline: '2px solid var(--color-primary)',
      outlineOffset: 2,
      borderRadius: 'var(--radius-sm)',
    },
  },
});

export const listItemDeleteBtn = style({
  alignSelf: 'center',
});

export const requestItemHeaderRow = style({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 8,
  minWidth: 0,
});

export const requestLinkRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  marginTop: 2,
  minWidth: 0,
  width: 'fit-content',
  maxWidth: '100%',
});

export const requestLinkText = style({
  minWidth: 0,
  maxWidth: 'min(100%, 360px)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontSize: 12,
  color: 'var(--color-text-muted)',
  lineHeight: 1.35,
});

export const requestLinkCopyBtn = style({});

export const listItemIcon = style({
  marginTop: 2,
  color: 'var(--color-text-muted)',
});

export const listItemBody = style({
  flex: 1,
  minWidth: 0,
  textAlign: 'left',
});

export const listItemTitle = style({
  fontSize: 14,
  fontWeight: 700,
  color: 'var(--color-text)',
});

export const listItemSub = style({
  marginTop: 2,
  fontSize: 12,
  color: 'var(--color-text-muted)',
});

export const listItemMeta = style({
  marginTop: 4,
  fontSize: 12,
  lineHeight: 1.45,
  color: 'var(--color-text-muted)',
});

export const listItemRight = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 6,
  flexShrink: 0,
  textAlign: 'left',
});

export const listItemTime = style({
  fontSize: 12,
  color: 'var(--color-text-muted)',
  whiteSpace: 'nowrap',
});

export const emptyList = style({
  padding: 16,
  fontSize: 14,
  color: 'var(--color-text-muted)',
  textAlign: 'left',
});
