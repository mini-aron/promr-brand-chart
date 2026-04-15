import { getPageMetadata } from '@/lib/metadata/site';
import { PharmaMyPage } from '@/features/pharma-dashboard/PharmaMyPage';

export const metadata = getPageMetadata({
  title: '마이페이지',
  description: '제약사 계정 정보를 확인하고 수정합니다.',
  canonicalPath: '/pharma/my-page',
});

export default function PharmaMyPageRoute() {
  return <PharmaMyPage />;
}
