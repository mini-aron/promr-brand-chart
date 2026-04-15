import { NoticeListPage } from '@/features/notice/NoticePage';

export default function UploadNoticeRoute() {
  return (
    <NoticeListPage
      scopeMode="dual"
      pharmaNoticeScope="linked"
      description="시스템 공지와 연결 제약사별 공지를 확인하세요. 제약사 공지는 상단에서 제약사를 선택합니다."
    />
  );
}
