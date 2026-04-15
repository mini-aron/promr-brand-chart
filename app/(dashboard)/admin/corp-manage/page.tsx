import { AdminCorpManagePage } from '@/features/corporation/AdminCorpManagePage';
import { getPageMetadata } from '@/lib/metadata/site';

export const metadata = getPageMetadata({
  title: '법인 관리',
  description: '법인 목록을 조회하고 법인을 등록·수정합니다.',
  canonicalPath: '/admin/corp-manage',
});

export default function AdminCorpManageRoute() {
  return <AdminCorpManagePage />;
}
