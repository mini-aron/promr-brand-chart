import { getPageMetadata } from '@/lib/metadata/site';
import { PromotionPage } from '@/features/home/PromotionPage';

export const metadata = getPageMetadata({
  title: '프로모션',
  description: 'PROMR Performance에 오신 것을 환영합니다',
  canonicalPath: '/promotion',
});

export default function PromotionRoute() {
  return <PromotionPage />;
}
