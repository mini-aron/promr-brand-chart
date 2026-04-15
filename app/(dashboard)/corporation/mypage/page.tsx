import { getPageMetadata } from '@/lib/metadata/site';
import { CorpMyPage } from '@/features/corporation-dashboard/CorpMyPage';

export const metadata = getPageMetadata({
  title: '마이페이지',
  description: '법인 계정 정보를 확인하고 수정합니다.',
  canonicalPath: '/corporation/mypage',
});

export default function CorporationMyPageRoute() {
  return <CorpMyPage />;
}
