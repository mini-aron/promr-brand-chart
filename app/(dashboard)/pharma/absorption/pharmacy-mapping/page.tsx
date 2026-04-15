import { PharmacyMappingPage } from '@/features/absorption/PharmacyMappingPage';
import { getPageMetadata } from '@/lib/metadata/site';

export const metadata = getPageMetadata({
  title: '문전약국 매핑',
  description: '문전약국 매핑 페이지입니다.',
  canonicalPath: '/pharma/absorption/pharmacy-mapping',
});

export default function PharmacyMappingRoute() {
  return <PharmacyMappingPage />;
}
