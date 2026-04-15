import { getPageMetadata } from '@/lib/metadata/site';
import { FilterApprovalPage } from '@/features/filter/FilterApprovalPage';

export const metadata = getPageMetadata({
  title: ' 거래선 승인',
  description: '거래선 승인 페이지입니다.',
  canonicalPath: '/pharma/filter-approval',
});

export default function FilterApprovalRoute() {
  return <FilterApprovalPage />;
}
