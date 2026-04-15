import { getPageMetadata } from '@/lib/metadata/site';
import { HospitalManagePage } from '@/features/hospital/HospitalManagePage';

export const metadata = getPageMetadata({
  title: '병의원 관리',
  description: '병의원 목록을 조회하고 병의원을 등록·수정합니다.',
  canonicalPath: '/admin/hospitals',
});

export default function AdminHospitalsRoute() {
  return <HospitalManagePage />;
}
