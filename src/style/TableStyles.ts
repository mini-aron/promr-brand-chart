import { css } from '@emotion/react';
import { theme } from '@/theme';

/**
 * 테이블 래퍼 공통 스타일 (기본: 테두리/배경 포함)
 * minWidth 등 페이지별 override 필요 시: css([tableWrap, css({ '& table': { minWidth: 700 } })])
 */
export const tableWrap = css({
  overflow: 'auto',
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.surface,
  boxShadow: theme.shadow.sm,
  fontSize: 12,
  '& table': { width: '100%', borderCollapse: 'collapse' },
  '& th, & td': {
    padding: theme.spacing(1.5),
    textAlign: 'left',
    borderBottom: `1px solid ${theme.colors.border}`,
    borderRight: `1px solid ${theme.colors.border}`,
  },
  '& th:last-child, & td:last-child': { borderRight: 'none' },
  '& th': { backgroundColor: theme.colors.background, fontWeight: 600 },
  '& tbody tr:hover': { backgroundColor: `${theme.colors.primary}06` },
});

/**
 * 카드 내부 테이블용 (테두리/배경 없음)
 */
export const tableWrapPlain = css({
  overflow: 'auto',
  fontSize: 12,
  '& table': { width: '100%', borderCollapse: 'collapse' },
  '& th, & td': {
    padding: theme.spacing(1.5),
    textAlign: 'left',
    borderBottom: `1px solid ${theme.colors.border}`,
    borderRight: `1px solid ${theme.colors.border}`,
  },
  '& th:last-child, & td:last-child': { borderRight: 'none' },
  '& th': { backgroundColor: theme.colors.background, fontWeight: 600 },
});

/**
 * 컴팩트 테이블 (정산 등 밀집 데이터)
 */
export const tableWrapCompact = css({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.surface,
  boxShadow: theme.shadow.sm,
  fontSize: 11,
  '& table': { width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' },
  '& th, & td': {
    padding: theme.spacing(1),
    textAlign: 'left',
    borderBottom: `1px solid ${theme.colors.border}`,
    borderRight: `1px solid ${theme.colors.border}`,
    whiteSpace: 'nowrap',
  },
  '& th:last-child, & td:last-child': { borderRight: 'none' },
  '& th': { backgroundColor: theme.colors.background, fontWeight: 600 },
});

/**
 * 고정 헤더 테이블 (스크롤 시 thead 고정)
 */
export const tableWrapSticky = css({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  fontSize: 12,
  '& table': { width: '100%', borderCollapse: 'collapse' },
  '& th, & td': {
    padding: theme.spacing(1.5),
    textAlign: 'left',
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  '& th': {
    position: 'sticky',
    top: 0,
    backgroundColor: theme.colors.background,
    fontWeight: 600,
    zIndex: 1,
  },
  '& tbody tr:hover': { backgroundColor: `${theme.colors.primary}06` },
});

/**
 * 수정된 행 강조
 */
export const tableRowModified = css({
  backgroundColor: `color-mix(in srgb, ${theme.colors.primary} 22%, transparent)`,
});
