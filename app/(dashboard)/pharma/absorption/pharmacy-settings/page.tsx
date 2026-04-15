import { getPageMetadata } from '@/lib/metadata/site';
import { PharmacySettingsPage } from '@/features/absorption/PharmacySettingsPage';

export const metadata = getPageMetadata({
  title: '약국 설정',
  description: '약국 설정 페이지입니다.',
  canonicalPath: '/pharma/absorption/pharmacy-settings',
});

export default function PharmacySettingsRoute() {
  return <PharmacySettingsPage />;
}
