/**
 * 계약서·서류 더미 이미지 — A4 세로(210×297mm)와 동일 비율의 PDF 포인트 크기(595×842).
 * placehold.co 생성 픽셀; UI에서 object-fit contain 시 A4 느낌에 맞춤.
 */
export const DEMO_CONTRACT_PLACEHOLDER_A4 = '595x842';

/** `public/demo/report_certificate_sample.png` — 의료기기 판촉영업자 신고필증 샘플 */
export const DEMO_REPORT_CERTIFICATE_SAMPLE_URL = '/demo/report_certificate_sample.png';

/** `public/demo/contract_sample.png` — 거래계약서 샘플 */
export const DEMO_CONTRACT_SAMPLE_URL = '/demo/contract_sample.png';

/** `public/demo/subcontract_contract_sample.png` — 재위탁계약서 샘플(전역 더미 통일) */
export const DEMO_SUBCONTRACT_CONTRACT_SAMPLE_URL = '/demo/subcontract_contract_sample.png';

export function demoContractPlaceholderUrl(text: string): string {
  return `https://placehold.co/${DEMO_CONTRACT_PLACEHOLDER_A4}/e2e8f0/64748b?text=${encodeURIComponent(text)}`;
}
