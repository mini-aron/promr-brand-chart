import { getPageMetadata } from '@/lib/metadata/site';
import { AggregatePage } from '@/features/corporation/AggregatePage';

export const metadata = getPageMetadata({
  title: '집계',
  description: '집계 페이지입니다.',
  canonicalPath: '/pharma/aggregate',
});

export default function AggregateRoute() {
  return <AggregatePage />;
}
