/** 개인정보 수집 및 이용 동의 — 아코디언·모달 등 공통 사용 */

import type { ThirdPartyConsentDocument } from './types';

export const PRIVACY_COLLECTION_CONSENT: ThirdPartyConsentDocument = {
  mainTitle: '개인정보 수집 및 이용 동의',
  content: [
    {
      showClauseIndicator: false,
      paragraphs: [
        {
          text: `귀하는 아래와 같은 개인정보 수집 및 이용에 대해 동의하실 수 있습니다.
다만, 동의를 거부하실 경우 서비스 이용이 불가합니다.`,
        },
        {
          text: '---------------------------------------------------------------------------------',
        },
      ],
    },
    {
      subheading: '수집 목적',
      showClauseIndicator: true,
      paragraphs: [{ text: '회원 식별 및 서비스 제공, 사업자 검증' }],
    },
    {
      subheading: '수집 항목',
      showClauseIndicator: true,
      paragraphs: [
        {
          text: '이름, 이메일, 연락처, 소속 회사명, 사업유형, 계약 관련 서류(사업자등록증 등)',
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
