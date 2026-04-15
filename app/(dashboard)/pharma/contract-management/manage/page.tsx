import { getPageMetadata } from '@/lib/metadata/site';
import { ContractDocumentManagePage } from '@/features/contract/ContractDocumentManagePage';
export const metadata = getPageMetadata({
  title: '계약서 관리',
  description: '계약서 관리 페이지입니다.',
  canonicalPath: '/pharma/contract-management/manage',
});

export default function ContractManageRoute() {
  return <ContractDocumentManagePage />;
}
