import { getPageMetadata } from '@/lib/metadata/site';
import { ContractReviewPage } from '@/features/contract/ContractReviewPage';

export const metadata = getPageMetadata({
  title: '계약서 검토',
  description: '계약서 검토 페이지입니다.',
  canonicalPath: '/pharma/contract-management/review',
});

export default function ContractReviewRoute() {
  return <ContractReviewPage />;
}
