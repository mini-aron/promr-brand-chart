import { redirect } from 'next/navigation';

/** 예전 경로 호환: 법인·딜러 = 재위탁 확인과 동일 화면 */
export default function CorporationDealersRedirectPage() {
  redirect('/pharma/contract-management/request');
}
