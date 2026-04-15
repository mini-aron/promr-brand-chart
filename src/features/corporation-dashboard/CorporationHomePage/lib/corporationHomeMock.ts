/**
 * @file Mock — 법인 대시보드 데모 집계 (`MOCK_*` / demo 스토어 기준). API 연동 시 교체
 */
import { MOCK_CONTRACT_REVIEW_ITEMS } from '@/features/contract/mockData';
import { MOCK_CONTRACT_DOCUMENT_ROWS } from '@/features/contract/lib/contractManagementMock/contractDocumentRows';
import {
  isContractReviewReceivedItem,
  type ContractReviewReceivedItem,
} from '@/features/contract/ContractReviewPage/types';
import type { Notice } from '@/types';

export type CorporationProfileDocumentsMock = {
  businessLicense: boolean;
  reportCert: boolean;
  csoTrainingCert: boolean;
};

/** `MOCK_CONTRACT_DOCUMENT_ROWS`에서 법인명과 일치하는 CSO 행 기준(계약관리 더미와 동일) */
export function getCorporationProfileDocumentsMock(
  corporationName: string,
): CorporationProfileDocumentsMock | null {
  const row = MOCK_CONTRACT_DOCUMENT_ROWS.find((r) => r.csoName === corporationName);
  if (!row) return null;
  return {
    businessLicense: row.documents.businessLicense,
    reportCert: row.documents.reportCert,
    csoTrainingCert: row.documents.csoTrainingCert,
  };
}

const NOTICE_PREVIEW_LIMIT_MOCK = 5;
const CONTRACT_PREVIEW_LIMIT_MOCK = 6;

export function getCorporationNoticePreviewMock(params: {
  notices: Notice[];
  acceptedPharmaIds: string[];
}): Notice[] {
  const { notices, acceptedPharmaIds } = params;
  const pharmaSet = new Set(acceptedPharmaIds);
  const scoped = notices.filter((n) => {
    if (n.noticeScope === 'system') return true;
    if (n.noticeScope === 'pharma' && n.pharmaId && pharmaSet.has(n.pharmaId)) return true;
    return false;
  });
  return [...scoped].sort((a, b) => b.no - a.no).slice(0, NOTICE_PREVIEW_LIMIT_MOCK);
}

export function getCorporationContractReviewPreviewMock(
  corporationName: string,
  limit = CONTRACT_PREVIEW_LIMIT_MOCK,
): ContractReviewReceivedItem[] {
  return MOCK_CONTRACT_REVIEW_ITEMS.filter(isContractReviewReceivedItem)
    .filter((i) => i.corporationName === corporationName)
    .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
    .slice(0, limit);
}
