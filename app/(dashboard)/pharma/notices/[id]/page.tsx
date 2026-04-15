import { NoticeDetailPageView } from '@/features/notice/NoticeDetailPage';

export default function PharmaNoticeDetailRoute({ params }: { params: { id: string } }) {
  return <NoticeDetailPageView listPath="/pharma/notices" noticeId={params.id} />;
}
