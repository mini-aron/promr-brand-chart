import { NoticeDetailScreen } from './NoticeDetailScreen.client';

export type NoticeDetailPageViewProps = {
  listPath?: string;
  noticeId: string;
};

export function NoticeDetailPageView({ listPath, noticeId }: NoticeDetailPageViewProps) {
  return <NoticeDetailScreen listPath={listPath} noticeId={noticeId} />;
}
