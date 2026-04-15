import { getPageMetadata } from '@/lib/metadata/site';
import { NoticeWritePage } from '@/features/notice/NoticeWritePage';

export const metadata = getPageMetadata({
  title: '공지사항 작성',
  description: '제약사 공지를 작성합니다.',
  canonicalPath: '/pharma/notices/new',
});

export default function PharmaNoticeNewRoute() {
  return <NoticeWritePage listPath="/pharma/notices" noticeScope="pharma" />;
}
