import { style, globalStyle } from '@vanilla-extract/css';

/** 법인정산확인 기준 통일 필터 스타일 */
export const filterSection = style({
  padding: 12,
  marginBottom: 12,
  backgroundColor: 'var(--color-background)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
});

export const filterRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: 12,
});

export const filterField = style({
  width: 180,
});

globalStyle(`${filterField} label`, {
  display: 'block',
  marginBottom: 4,
  fontSize: 11,
  fontWeight: 600,
  color: 'var(--color-text)',
});
