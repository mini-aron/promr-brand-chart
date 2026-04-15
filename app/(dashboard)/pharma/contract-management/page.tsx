import { getPageMetadata } from '@/lib/metadata/site';
import { ContractManagementPage } from '@/features/contract/ContractManagementPage';

export const metadata = getPageMetadata({
  title: '계약서 관리',
  description: '계약서 관리 페이지입니다.',
  canonicalPath: '/pharma/contract-management',
});

export default function ContractManagementRoute() {
  return <ContractManagementPage />;
}
