import { style, globalStyle } from '@vanilla-extract/css';

const tableCell = {
  padding: 6,
  textAlign: 'left' as const,
  borderBottom: '1px solid var(--color-border)',
  borderRight: '1px solid var(--color-border)',
};

const tableCellLast = { borderRight: 'none' };

const thBase = {
  backgroundColor: 'var(--color-background)',
  fontWeight: 600,
};

/** 테이블 래퍼 (기본: 테두리/배경 포함) */
export const tableWrap = style({
  overflow: 'auto',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--color-surface)',
  boxShadow: 'var(--shadow-sm)',
  fontSize: 12,
});

globalStyle(`${tableWrap} table`, {
  width: '100%',
  borderCollapse: 'collapse',
});
globalStyle(`${tableWrap} th, ${tableWrap} td`, tableCell);
globalStyle(`${tableWrap} th:last-child, ${tableWrap} td:last-child`, tableCellLast);
globalStyle(`${tableWrap} th`, thBase);
globalStyle(`${tableWrap} tbody tr:hover`, {
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 6%, transparent)',
});

/** 카드 내부 테이블용 (테두리/배경 없음) */
export const tableWrapPlain = style({
  overflow: 'auto',
  fontSize: 12,
});

globalStyle(`${tableWrapPlain} table`, {
  width: '100%',
  borderCollapse: 'collapse',
});
globalStyle(`${tableWrapPlain} th, ${tableWrapPlain} td`, tableCell);
globalStyle(`${tableWrapPlain} th:last-child, ${tableWrapPlain} td:last-child`, tableCellLast);
globalStyle(`${tableWrapPlain} th`, thBase);

/** 컴팩트 테이블 */
export const tableWrapCompact = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-md)',
  backgroundColor: 'var(--color-surface)',
  boxShadow: 'var(--shadow-sm)',
  fontSize: 11,
});

globalStyle(`${tableWrapCompact} table`, {
  width: '100%',
  borderCollapse: 'collapse',
  tableLayout: 'fixed',
});
globalStyle(`${tableWrapCompact} th, ${tableWrapCompact} td`, {
  ...tableCell,
  padding: 4,
  whiteSpace: 'nowrap',
});
globalStyle(`${tableWrapCompact} th:last-child, ${tableWrapCompact} td:last-child`, tableCellLast);
globalStyle(`${tableWrapCompact} th`, thBase);

/** 고정 헤더 테이블 */
export const tableWrapSticky = style({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  fontSize: 12,
});

globalStyle(`${tableWrapSticky} table`, {
  width: '100%',
  borderCollapse: 'collapse',
});
globalStyle(`${tableWrapSticky} th, ${tableWrapSticky} td`, {
  padding: 6,
  textAlign: 'left',
  borderBottom: '1px solid var(--color-border)',
});
globalStyle(`${tableWrapSticky} th`, {
  ...thBase,
  position: 'sticky',
  top: 0,
  zIndex: 1,
});
globalStyle(`${tableWrapSticky} tbody tr:hover`, {
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 6%, transparent)',
});

/** 수정된 행 강조 */
export const tableRowModified = style({
  backgroundColor: 'color-mix(in srgb, var(--color-primary) 22%, transparent)',
});
