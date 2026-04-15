import { getPageMetadata } from '@/lib/metadata/site';
import { ContractRequestPage } from '@/features/contract/ContractRequestPage';

export const metadata = getPageMetadata({
  title: '재위탁 확인',
  description: '재위탁 확인 페이지입니다.',
  canonicalPath: '/pharma/contract-management/request',
});

export default function ContractRequestRoute() {
  return <ContractRequestPage />;
}
