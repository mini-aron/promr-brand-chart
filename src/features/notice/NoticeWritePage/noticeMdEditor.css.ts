import { globalStyle, style } from '@vanilla-extract/css';
import * as pageHeader from '@/shared/components/layout/PageHeader/PageHeader.css';
import * as edit from '../EditNoticePage/index.css';

/** 공지 작성·수정: 상단 제목 영역 여백 축소 */
export const noticeWriteRoot = style({});

globalStyle(`${noticeWriteRoot} .${pageHeader.pageHeader}`, {
  marginBottom: 4,
});

globalStyle(`${noticeWriteRoot} h1`, {
  marginBottom: 4,
});

export const noticeWriteCard = style([
  edit.card,
  {
    marginTop: 10,
  },
]);

export const noticeWriteHeader = style([
  edit.headerSection,
  {
    padding: '10px 20px 12px',
  },
]);

export const noticeWriteBack = style([
  edit.backButton,
  {
    marginBottom: 8,
  },
]);

export const noticeWriteMetaRow = style([
  edit.metaRow,
  {
    marginBottom: 8,
  },
]);

export const noticeWriteTitleInput = style([
  edit.titleInput,
  {
    padding: '6px 0 8px',
    marginBottom: 0,
  },
]);

export const noticeWriteContentSection = style([
  edit.contentSection,
  {
    padding: '16px 24px 28px',
  },
]);

export const wrap = style({
  width: '100%',
  minWidth: 0,
});

export const editorShell = style({
  minWidth: 0,
  borderRadius: 'var(--radius-md)',
  overflow: 'hidden',
  border: '1px solid var(--color-border)',
});

globalStyle(`${editorShell} .w-md-editor`, {
  boxShadow: 'none',
});

globalStyle(`${editorShell} .w-md-editor-toolbar`, {
  borderBottomColor: 'var(--color-border)',
});

export const loading = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 400,
  color: 'var(--color-text-muted)',
  fontSize: 14,
  border: '1px dashed var(--color-border)',
  borderRadius: 'var(--radius-md)',
});
