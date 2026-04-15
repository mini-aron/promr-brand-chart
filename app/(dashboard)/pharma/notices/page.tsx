import { getPageMetadata } from '@/lib/metadata/site';
import { NoticeListPage } from '@/features/notice/NoticePage';

export const metadata = getPageMetadata({
  title: '공지사항',
  description: '시스템 공지와 제약사별 공지를 확인합니다.',
  canonicalPath: '/pharma/notices',
});

export default function PharmaNoticesRoute() {
  return (
    <NoticeListPage
      detailBasePath="/pharma/notices"
      scopeMode="dual"
      description="시스템 공지와 소속 제약사 공지를 탭에서 구분해 확인하세요."
    />
  );
}
