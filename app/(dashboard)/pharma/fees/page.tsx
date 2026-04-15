import { getPageMetadata } from '@/lib/metadata/site';
import { FeeManagePage } from '@/features/fee/FeeManagePage';

export const metadata = getPageMetadata({
  title: '수수료 관리',
  description: '수수료 관리 페이지입니다.',
  canonicalPath: '/pharma/fees',
});

export default function FeesRoute() {
  return <FeeManagePage />;
}
