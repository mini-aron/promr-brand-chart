import { NoticeDetailPageView } from '@/features/notice/NoticeDetailPage';

export default function CorporationNoticeDetailRoute({ params }: { params: { id: string } }) {
  return <NoticeDetailPageView noticeId={params.id} />;
}
