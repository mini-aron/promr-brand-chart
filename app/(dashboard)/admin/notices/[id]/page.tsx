import { NoticeDetailPageView } from '@/features/notice/NoticeDetailPage';

export default function AdminNoticeDetailRoute({ params }: { params: { id: string } }) {
  return <NoticeDetailPageView listPath="/admin/notices" noticeId={params.id} />;
}
