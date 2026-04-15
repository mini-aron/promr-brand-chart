import { globalStyle, style } from '@vanilla-extract/css';
import { box, labelText, wrapHorizontal } from '@/shared/components/ui/Checkbox/Checkbox.css';
import { trigger as selectTrigger } from '@/shared/components/ui/Select/Select.css';

/** 회원가입 폼 — 모서리를 살짝 각지게 (카드·동의·입력·버튼 공통 톤) */
export const formSharp = style({});

export const cardSharp = style({
  borderRadius: 4,
});

globalStyle(`${cardSharp} > div`, {
  padding: '22px 20px 26px',
});

export const wrap = style({
  padding: '24px 18px 32px',
  maxWidth: 620,
  width: '100%',
  margin: '0 auto',
  boxSizing: 'border-box',
});

export const formStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 20,
  minWidth: 0,
  width: '100%',
});

globalStyle(`${formSharp} input[type="file"]`, {
  borderRadius: 4,
});

globalStyle(`${formSharp} input[type="file"]::file-selector-button`, {
  borderRadius: 2,
});

globalStyle(
  `${formSharp} input:not([type="checkbox"]):not([type="file"]):not([type="radio"]):not([type="hidden"])`,
  {
    borderRadius: 4,
  },
);

globalStyle(`${formSharp} button`, {
  borderRadius: 4,
});

globalStyle(`${formSharp} .${selectTrigger}`, {
  fontSize: 12,
  minHeight: 34,
});

globalStyle(
  `${formSharp} input:not([type="checkbox"]):not([type="file"]):not([type="radio"]):not([type="hidden"])`,
  {
    fontSize: 12,
  },
);

export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
});

export const label = style({
  display: 'block',
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1.4,
  color: 'var(--color-text)',
});

export const requiredMark = style({
  fontWeight: 600,
  color: 'var(--color-error)',
  fontSize: 11,
});

export const hint = style({
  marginTop: 4,
  fontSize: 11,
  lineHeight: 1.5,
  color: 'var(--color-text-muted)',
});

export const divider = style({
  marginTop: 4,
  paddingTop: 18,
  borderTop: '1px solid var(--color-border)',
});

export const toggleRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
});

export const toggleLabel = style({
  fontSize: 13,
  fontWeight: 500,
  color: 'var(--color-text)',
});

export const consentSection = style({
  padding: '14px 16px',
  borderRadius: 4,
  border: '1px solid var(--color-border)',
  backgroundColor: 'var(--color-background)',
  minWidth: 0,
  width: '100%',
  boxSizing: 'border-box',
});

globalStyle(`${consentSection} .${wrapHorizontal}`, {
  alignItems: 'center',
  gap: 5,
});

globalStyle(`${consentSection} .${labelText}`, {
  fontSize: 12,
  fontWeight: 500,
  lineHeight: 1.4,
});

globalStyle(`${consentSection} .${box}`, {
  width: 18,
  height: 18,
  borderRadius: 2,
});

export const consentGroupLabel = style({
  margin: '4px 0 8px',
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: '0.04em',
  color: 'var(--color-text-muted)',
  textTransform: 'uppercase',
});

export const consentRowWide = style({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 0',
  borderBottom: '1px solid var(--color-border)',
  selectors: {
    '&:last-child': { borderBottom: 'none' },
  },
});

export const consentRowWideNoBorder = style({
  display: 'flex',
  alignItems: 'center',
  padding: '8px 0',
});

export const selectAllRow = style({
  display: 'flex',
  alignItems: 'center',
  padding: '4px 0 10px',
  borderBottom: '1px solid var(--color-border)',
});

/** 이용약관 긴 본문 패널 — 스크롤 */
export const termsAccordionPanel = style({
  maxHeight: 'min(55vh, 420px)',
  overflowY: 'auto',
});

export const termsChapterHeading = style({
  margin: '16px 0 8px',
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--color-text)',
});

export const termsChapterHeadingFirst = style({
  marginTop: 0,
});

export const termsArticleHeading = style({
  margin: '12px 0 6px',
  fontSize: 11,
  fontWeight: 700,
  color: 'var(--color-text)',
});

/** `showClauseIndicator` 조항 전체 — `detailDt`보다 한 톤 진하게 */
export const termsArticleHeadingClause = style({
  fontSize: 10,
  fontWeight: 700,
  color: 'color-mix(in srgb, var(--color-text) 82%, var(--color-text-muted) 28%)',
});

export const detailTitle = style({
  margin: '0 0 8px',
  fontSize: 12,
  fontWeight: 700,
  color: 'var(--color-text)',
});

export const detailIntro = style({
  margin: '0 0 12px',
  fontSize: 11,
  lineHeight: 1.55,
  color: 'var(--color-text)',
  whiteSpace: 'pre-line',
  overflowWrap: 'break-word',
});

export const detailDl = style({
  margin: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 10,
});

export const detailDt = style({
  margin: 0,
  fontSize: 10,
  fontWeight: 700,
  color: 'var(--color-text-muted)',
});

export const detailDd = style({
  margin: 0,
  fontSize: 11,
  lineHeight: 1.5,
  color: 'var(--color-text)',
  overflowWrap: 'break-word',
});

export const consentDivider = style({
  margin: '14px 0 10px',
  borderTop: '1px solid var(--color-border)',
});

export const parsedFields = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  marginTop: 12,
});

export const readonlyInput = style({
  borderRadius: 4,
  backgroundColor: 'var(--color-background)',
  cursor: 'default',
  selectors: {
    '&:focus': {
      borderColor: 'var(--color-border)',
      boxShadow: 'none',
    },
  },
});

export const parseLoading = style({
  marginTop: 6,
  fontSize: 11,
  color: 'var(--color-text-muted)',
});

export const actions = style({
  marginTop: 16,
  paddingTop: 4,
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
  alignItems: 'center',
});

export const errorText = style({
  marginTop: 6,
  fontSize: 12,
  lineHeight: 1.45,
  color: 'var(--color-error)',
});
