import { getPageMetadata } from '@/lib/metadata/site';
import { NoticeListPage } from '@/features/notice/NoticePage';

export const metadata = getPageMetadata({
  title: '시스템 공지사항',
  description: '시스템 공지를 작성·관리합니다.',
  canonicalPath: '/admin/notices',
});

export default function AdminNoticesRoute() {
  return (
    <NoticeListPage
      detailBasePath="/admin/notices"
      scopeMode="system"
      composerHref="/admin/notices/new"
      description="관리자가 등록하는 시스템 공지입니다."
    />
  );
}
