import { style, globalStyle } from '@vanilla-extract/css';

/** 대시보드 페이지 공통 루트: flex column, 전체 높이 */
export const page = style({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
});

/** 제목/본문을 컴포넌트(PageTitle, PageDesc, PageHeader)로 쓰지 않을 때만 적용 */
globalStyle(`${page} h1`, { marginBottom: 8 });
globalStyle(`${page} p`, { marginBottom: 16 });
