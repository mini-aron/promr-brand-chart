import { redirect } from 'next/navigation';
import { getPageMetadata } from '@/lib/metadata/site';

export const metadata = getPageMetadata({
  title: '흡수율',
  description: '흡수율 페이지입니다.',
  canonicalPath: '/pharma/absorption',
});

export default function AbsorptionRoute() {
  redirect('/pharma/absorption/pharmacy-settings');
}
