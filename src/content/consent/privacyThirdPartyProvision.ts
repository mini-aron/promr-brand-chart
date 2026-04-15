/** 개인정보 제3자 제공 동의 — 아코디언·모달 등 공통 사용 */

import type { ThirdPartyConsentDocument } from './types';

export const PRIVACY_THIRD_PARTY_PROVISION: ThirdPartyConsentDocument = {
  mainTitle: '개인정보 제3자 제공 동의',
  content: [
    {
      showClauseIndicator: false,
      paragraphs: [
        {
          text: `귀하는 아래와 같은 개인정보 제3자 제공에 대해 동의하실 수 있습니다.
다만, 동의를 거부하실 경우 서비스 이용이 불가합니다.`,
        },
        {
          text: '---------------------------------------------------------------------------------',
        },
      ],
    },
    {
      subheading: '제공받는 자',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: '① PROMR Performance에 가입된 제약사 및 회원이 소속되거나 직계 거래 관계에 있는 업체',
        },
        {
          text: '② Google (Gemini AI 서비스, 사업자 검증 목적)',
        },
      ],
    },
    {
      subheading: '이용 목적',
      showClauseIndicator: true,
      paragraphs: [{ text: '사업자 검증 및 제약사에게 검증 확인' }],
    },
    {
      subheading: '제공 항목',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: '계약 관련 서류(사업자등록증 등), 사업자명, 연락처, 이메일',
        },
      ],
    },
    {
      subheading: '보유 및 이용 기간',
      showClauseIndicator: true,
      paragraphs: [{ text: '서비스 탈퇴 및 계정 삭제 시까지' }],
    },
  ],
};
