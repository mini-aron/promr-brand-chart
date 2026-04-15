import { getPageMetadata } from '@/lib/metadata/site';
import { PharmaCorporationContractPage } from '@/features/contract/PharmaCorporationContractPage';

export const metadata = getPageMetadata({
  title: '법인별 계약서 관리',
  description: '법인별 계약서 관리 페이지입니다.',
  canonicalPath: '/pharma/contract-management/view',
});

export default function PharmaCorporationContractRoute() {
  return <PharmaCorporationContractPage />;
}
