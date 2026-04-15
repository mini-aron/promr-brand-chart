import { getPageMetadata } from '@/lib/metadata/site';
import { AbsorptionCalculationPage } from '@/features/absorption/AbsorptionCalculationPage';

export const metadata = getPageMetadata({
  title: '흡수율 계산',
  description: '흡수율 계산 페이지입니다.',
  canonicalPath: '/pharma/absorption/calculation',
});

export default function AbsorptionCalculationRoute() {
  return <AbsorptionCalculationPage />;
}
