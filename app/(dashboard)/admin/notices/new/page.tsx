import { getPageMetadata } from '@/lib/metadata/site';
import { NoticeWritePage } from '@/features/notice/NoticeWritePage';

export const metadata = getPageMetadata({
  title: '시스템 공지 작성',
  description: '시스템 공지를 등록합니다.',
  canonicalPath: '/admin/notices/new',
});

export default function AdminNoticeNewRoute() {
  return <NoticeWritePage listPath="/admin/notices" noticeScope="system" />;
}
