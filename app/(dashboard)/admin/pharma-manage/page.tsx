import { getPageMetadata } from '@/lib/metadata/site';
import { PharmaManagePage } from '@/features/admin/PharmaManagePage';
export const metadata = getPageMetadata({
  title: '제약사 관리',
  description: '제약사 목록을 조회하고 제약사를 등록·수정합니다.',
  canonicalPath: '/admin/pharma-manage',
});

export default function PharmaManageRoute() {
  return <PharmaManagePage />;
}
