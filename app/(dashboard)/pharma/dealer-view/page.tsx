import { getPageMetadata } from '@/lib/metadata/site';
import { DealerViewPage } from '@/features/dealer/DealerViewPage';

export const metadata = getPageMetadata({
  title: '딜러 조회',
  description: '딜러 조회 페이지입니다.',
  canonicalPath: '/pharma/dealer-view',
});

export default function DealerViewRoute() {
  return <DealerViewPage />;
}
