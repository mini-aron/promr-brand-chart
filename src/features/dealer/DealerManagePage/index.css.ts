import { style, globalStyle, styleVariants } from '@vanilla-extract/css';
import { corpListSidebarLayout } from '@/shared/components/layout/CorpListSidebar/CorpListSidebar.css';

export { page } from '@/style/PageStyles.css';

export const headerRowWrap = style({ marginBottom: 16 });

/** 상위위탁처·본문 + 우측 본인서류 가로 배치 */
export const pageBody = style({
  display: 'flex',
  flexDirection: 'row',
  flex: 1,
  minHeight: 0,
  gap: 16,
  alignItems: 'stretch',
});

export const layoutWrap = style({
  display: 'flex',
  gap: 16,
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  alignItems: 'stretch',
});

/** 최우측 세로형 본인 서류 관리 레일 */
export const corpOwnRail = style({
  width: 312,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  padding: 12,
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-sm)',
  overflow: 'hidden',
});

export const corpOwnRailScroll = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
});

/** 계약관리: 상위위탁처 목록 폭 축소 — `CorpListSidebar` 기본 260px 덮어씀 */
export const sidebarNarrow = style({});
globalStyle(`.${corpListSidebarLayout}.${sidebarNarrow}`, {
  width: 200,
});

export const mainArea = style({
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const contentWrap = style({
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-sm)',
  overflow: 'hidden',
});

export const contentHeader = style({
  flexShrink: 0,
  padding: 12,
  borderBottom: '1px solid var(--color-border)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: 8,
});
globalStyle(`${contentHeader} h2`, { margin: 0, fontSize: 18, fontWeight: 600 });
globalStyle(`${contentHeader} p`, { margin: '4px 0 0', fontSize: 13 });

export const contentTablesWrap = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  padding: 12,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
});

/** 내 계약서: 테이블 + 우�� ��인 기본 서류 */
export const myContractSplit = style({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'row',
  gap: 16,
  padding: 12,
  alignItems: 'stretch',
});

export const myContractTableArea = style({
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  overflow: 'auto',
  display: 'flex',
  flexDirection: 'column',
});

export const myCorpDocsPanel = style({
  width: 300,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
  padding: 12,
  backgroundColor: 'var(--color-background)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  minHeight: 0,
  overflow: 'auto',
});

export const myCorpDocsBadgeColumn = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  gap: 8,
});

export const sectionTitle = style({
  margin: '0 0 8px',
  fontSize: 16,
  fontWeight: 700,
  color: 'var(--color-text)',
});

export const sectionDesc = style({
  margin: '0 0 12px',
  fontSize: 13,
  color: 'var(--color-text-muted)',
  lineHeight: 1.5,
});

export const upperTableSection = style({
  marginBottom: 28,
});

/** 상위 위탁처 — 등록 서류(간단 배지) */
export const upperRegisteredDocsBlock = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  alignItems: 'flex-start',
});

export const upperRegisteredDocsCaption = style({
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--color-text-muted)',
});

/** 우측 레일 «등록 서류» 라벨 — 본문과 동일 타이포, 아래 목록과 간격 */
export const corpOwnRailDocsCaption = style({
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--color-text-muted)',
  marginBottom: 10,
  flexShrink: 0,
});

export const corpOwnDocsTitle = style({
  margin: 0,
  fontSize: 14,
  fontWeight: 700,
  color: 'var(--color-text)',
  lineHeight: 1.35,
  flexShrink: 0,
});

export const corpOwnRailDesc = style({
  margin: '0 0 8px',
  fontSize: 12,
  color: 'var(--color-text-muted)',
  lineHeight: 1.45,
  flexShrink: 0,
});

/** 본인 서류: 소형 표 */
export const corpOwnTableWrap = style({
  width: '100%',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  overflow: 'hidden',
  backgroundColor: 'var(--color-surface)',
});

export const corpOwnTable = style({
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
  fontSize: 12,
});

export const corpOwnTh = style({
  padding: '7px 8px',
  textAlign: 'left',
  fontWeight: 600,
  fontSize: 11,
  color: 'var(--color-text-muted)',
  backgroundColor: 'var(--color-background)',
  borderBottom: '1px solid var(--color-border)',
  verticalAlign: 'middle',
});

export const corpOwnTd = style({
  padding: '8px 8px',
  borderBottom: '1px solid var(--color-border)',
  verticalAlign: 'middle',
  color: 'var(--color-text)',
  wordBreak: 'keep-all',
});

/** 등록된 서류명 — 클릭 시 미리보기 */
export const corpOwnDocNameBtn = style({
  margin: 0,
  padding: 0,
  border: 'none',
  background: 'none',
  font: 'inherit',
  fontWeight: 600,
  color: 'var(--color-primary)',
  cursor: 'pointer',
  textAlign: 'left',
  textDecoration: 'underline',
  textUnderlineOffset: 2,
  selectors: {
    '&:hover': { opacity: 0.85 },
    '&:focus-visible': {
      outline: '2px solid var(--color-primary)',
      outlineOffset: 2,
      borderRadius: 2,
    },
  },
});

export const corpOwnDocNameText = style({
  fontWeight: 600,
});

globalStyle(`${corpOwnTable} tbody tr:last-child td`, {
  borderBottom: 'none',
});

/** 본인 서류 DataTable — `tableWrapPlain` 세로 구분선 제거(기존 소형 표와 동일) */
export const corpOwnDataTable = style({ width: '100%' });
globalStyle(`${corpOwnDataTable} :where(th, td)`, {
  borderRight: 'none',
});

export const corpOwnStatusOk = style({
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--color-success)',
});

export const corpOwnStatusNo = style({
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--color-text-muted)',
});

export const corpOwnActionCell = style({
  position: 'relative',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 6,
});

/** 숨김 file input — 버튼으로만 트리거 */
export const corpOwnFileInputHidden = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 'none',
  opacity: 0,
});

export const subCsoSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

export const subCsoTitle = style({
  margin: 0,
  fontSize: 14,
  fontWeight: 700,
  color: 'var(--color-text)',
});

export const dealerSectionTitle = style({
  margin: '0 0 8px',
  fontSize: 16,
  fontWeight: 700,
  color: 'var(--color-text)',
});

export const reentrustSectionHead = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 12,
  marginBottom: 12,
});

export const reentrustSectionHeadLeft = style({
  flex: '1 1 200px',
  minWidth: 0,
});

export const reentrustSectionActions = style({
  flexShrink: 0,
  paddingTop: 2,
});

export const modalActionsWrap = style({
  marginTop: 16,
  paddingTop: 12,
  borderTop: '1px solid var(--color-border)',
});

export const formSection = style({});
globalStyle(`${formSection} label`, {
  display: 'block',
  marginBottom: 4,
  fontSize: 14,
  fontWeight: 600,
  color: 'var(--color-text)',
});
globalStyle(
  `${formSection} input[type="text"], ${formSection} input[type="tel"], ${formSection} input[type="email"]`,
  {
    width: '100%',
    minHeight: 48,
    padding: '0 12px',
    fontSize: 14,
    borderRadius: 'var(--radius-md)',
    border: '2px solid var(--color-border)',
    marginBottom: 12,
  },
);
globalStyle(
  `${formSection} input[type="text"]:focus, ${formSection} input[type="tel"]:focus, ${formSection} input[type="email"]:focus`,
  {
    outline: 'none',
    borderColor: 'var(--color-primary)',
    boxShadow: '0 0 0 2px color-mix(in srgb, var(--color-primary) 12%, transparent)',
  },
);

export const fileFieldWrap = style({ marginBottom: 12 });
export const fileNameDisplay = style({
  display: 'block',
  fontSize: 13,
  color: 'var(--color-text-muted)',
  marginTop: 2,
});

export const confirmModalBox = style({
  backgroundColor: 'var(--color-surface)',
  borderRadius: 'var(--radius-lg)',
  boxShadow: 'var(--shadow-md)',
  width: '100%',
  maxWidth: 480,
  padding: 16,
  position: 'relative',
});

export const addError = style({ marginTop: 8, fontSize: 14, color: 'var(--color-error)' });
export const deleteConfirmText = style({ marginBottom: 12, color: 'var(--color-text)' });
export const deleteConfirmTextMuted = style({
  fontSize: 14,
  color: 'var(--color-text-muted)',
  marginBottom: 16,
});
export const emptyMessage = style({ marginTop: 8, color: 'var(--color-text-muted)' });

/** 계약서 / 재위탁 메인 탭 바 */
export const tabBar = style({
  display: 'flex',
  gap: 0,
  borderBottom: '1px solid var(--color-border)',
  flexShrink: 0,
  paddingInline: 12,
});

export const tabBtn = style({
  position: 'relative',
  padding: '10px 16px',
  fontSize: 13,
  fontWeight: 600,
  color: 'var(--color-text-muted)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  selectors: {
    '&:hover': { color: 'var(--color-text)' },
  },
});

/** 업로드한 계약서 / 계약 요청 목록 서브 탭 바 */
export const subTabBar = style({
  display: 'flex',
  gap: 0,
  borderBottom: '1px solid var(--color-border)',
  flexShrink: 0,
  paddingInline: 12,
  backgroundColor: 'var(--color-background)',
});

export const subTabBtn = style({
  position: 'relative',
  padding: '7px 14px',
  fontSize: 12,
  fontWeight: 600,
  color: 'var(--color-text-muted)',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  selectors: {
    '&:hover': { color: 'var(--color-text)' },
  },
});

export const subTabBtnActive = style({
  color: 'var(--color-primary)',
  selectors: {
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -1,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: 'var(--color-primary)',
      borderRadius: '1px 1px 0 0',
    },
  },
});

export const subTabActionRow = style({
  display: 'flex',
  justifyContent: 'flex-end',
  flexShrink: 0,
  padding: '10px 12px 0',
});

/** 계약 요청 목록: 요청 링크 */
export const requestLinkCell = style({
  display: 'flex',
  alignItems: 'center',
  gap: 4,
  minWidth: 0,
});

/** CSO 유형 배지 */
export const csoTypeBadge = styleVariants({
  personal: {
    display: 'inline-block',
    padding: '3px 8px',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
    backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)',
    color: 'var(--color-primary)',
  },
  corporate: {
    display: 'inline-block',
    padding: '3px 8px',
    borderRadius: 4,
    fontSize: 11,
    fontWeight: 600,
    backgroundColor: 'color-mix(in srgb, #8b5cf6 10%, transparent)',
    color: '#7c3aed',
  },
});

/** 재위탁 통보서 업로드 셀 */
export const reentrustNoticeCell = style({
  display: 'flex',
  alignItems: 'center',
  gap: 6,
});

export const requestLinkText = style({
  fontSize: 12,
  color: 'var(--color-text-muted)',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  minWidth: 0,
  flex: 1,
});

export const tabBtnActive = style({
  color: 'var(--color-primary)',
  selectors: {
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: -1,
      left: 0,
      right: 0,
      height: 2,
      backgroundColor: 'var(--color-primary)',
      borderRadius: '1px 1px 0 0',
    },
  },
});

export const contractMetaRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: 16,
  marginBottom: 12,
  flexShrink: 0,
});

export const contractMetaItem = style({
  fontSize: 13,
  color: 'var(--color-text-muted)',
});

export const contractMetaItemStrong = style({
  color: 'var(--color-text)',
  fontWeight: 600,
});

/** 재위탁 탭 — 좌우 분할 레이아웃 */
export const reentrustLayout = style({
  display: 'flex',
  flex: 1,
  minHeight: 0,
  overflow: 'hidden',
});

export const reentrustPharmacyList = style({
  width: 190,
  flexShrink: 0,
  borderRight: '1px solid var(--color-border)',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column',
});

export const reentrustPharmacyItem = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  padding: '10px 14px',
  width: '100%',
  textAlign: 'left',
  background: 'none',
  border: 'none',
  borderBottom: '1px solid var(--color-border)',
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--color-text)',
  selectors: {
    '&:hover': { backgroundColor: 'var(--color-background)' },
    '&:last-child': { borderBottom: 'none' },
  },
});

export const reentrustPharmacyItemActive = style({
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, transparent)',
  color: 'var(--color-primary)',
  fontWeight: 700,
});

export const reentrustPharmacyCount = style({
  flexShrink: 0,
  fontSize: 11,
  fontWeight: 700,
  padding: '1px 6px',
  borderRadius: 10,
  backgroundColor: 'var(--color-border)',
  color: 'var(--color-text-muted)',
});

export const reentrustContent = style({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

export const reentrustContentHeader = style({
  flexShrink: 0,
  padding: '10px 14px',
  borderBottom: '1px solid var(--color-border)',
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'space-between',
  gap: 12,
  flexWrap: 'wrap',
});

export const reentrustContentHeaderLeft = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  minWidth: 0,
  flex: '1 1 200px',
});

export const reentrustContentHeaderTitle = style({
  margin: 0,
  fontSize: 14,
  fontWeight: 700,
  color: 'var(--color-text)',
});

export const reentrustContentBody = style({
  flex: 1,
  minHeight: 0,
  overflowY: 'auto',
  padding: 12,
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
});

export const dealerTableWrap = style({});
/** 등록 서류 열 배지 한 줄·셀 스크롤 없음 — 테이블 전체는 래퍼에서 스크롤 */
globalStyle(`${dealerTableWrap} table`, { minWidth: 1200 });

export const reentrustStatusBadge = styleVariants({
  complete: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 700,
    backgroundColor: 'color-mix(in srgb, var(--color-success) 12%, transparent)',
    color: 'var(--color-success)',
  },
  warning: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 700,
    backgroundColor: 'color-mix(in srgb, #f59e0b 16%, transparent)',
    color: '#d97706',
  },
  error: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 700,
    backgroundColor: 'color-mix(in srgb, var(--color-error) 14%, transparent)',
    color: 'var(--color-error)',
  },
});

export const docBadgeRow = style({
  display: 'inline-flex',
  flexWrap: 'nowrap',
  gap: 6,
  alignItems: 'center',
  width: 'max-content',
  maxWidth: 'none',
  overflow: 'visible',
});

/** 등록 서류 열 th/td — 셀 내부 가로 스크롤 없이 내용 너비만큼 확장 */
export const docBadgeCell = style({
  verticalAlign: 'middle',
  whiteSpace: 'nowrap',
  overflow: 'visible',
});

/** 등록 서류: 열람 가능 배지 */
export const docBadgeYesBtn = style({
  margin: 0,
  flexShrink: 0,
  padding: '4px 10px',
  border: 'none',
  borderRadius: 4,
  fontFamily: 'var(--font-family)',
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.35,
  backgroundColor: 'color-mix(in srgb, var(--color-success) 12%, transparent)',
  color: 'var(--color-success)',
  cursor: 'pointer',
  verticalAlign: 'baseline',
  selectors: {
    '&:focus-visible': {
      outline: '2px solid color-mix(in srgb, var(--color-success) 50%, transparent)',
      outlineOffset: 1,
    },
  },
});

export const docBadgeYesBtnInner = style({
  display: 'grid',
  placeItems: 'center',
});

export const docBadgeYesBtnLabel = style({
  gridRow: 1,
  gridColumn: 1,
  transition: 'opacity 0.12s ease',
  selectors: {
    [`${docBadgeYesBtn}:hover &`]: { opacity: 0 },
    [`${docBadgeYesBtn}:focus-visible &`]: { opacity: 0 },
  },
});

export const docBadgeYesBtnIcon = style({
  gridRow: 1,
  gridColumn: 1,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.12s ease',
  pointerEvents: 'none',
  selectors: {
    [`${docBadgeYesBtn}:hover &`]: { opacity: 1 },
    [`${docBadgeYesBtn}:focus-visible &`]: { opacity: 1 },
  },
});

export const docBadgeNo = style({
  display: 'inline-block',
  flexShrink: 0,
  padding: '4px 10px',
  borderRadius: 4,
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.35,
  backgroundColor: 'color-mix(in srgb, var(--color-text-muted) 10%, transparent)',
  color: 'var(--color-text-muted)',
});
