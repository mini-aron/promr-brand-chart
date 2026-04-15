/**
 * @file Mock — 제약사 대시보드 계약 검토 데모 집계 (`MOCK_CONTRACT_REVIEW_ITEMS`). API 연동 시 교체
 */
import { MOCK_CONTRACT_REVIEW_ITEMS } from '@/features/contract/mockData';
import {
  isContractReviewReceivedItem,
  isContractReviewRequestItem,
  type ContractReviewReceivedItem,
} from '@/features/contract/ContractReviewPage/types';

/** 발송 중인 계약서 제출 요청(요청목록·요청중) */
export function countOutstandingContractRequestsMock(): number {
  return MOCK_CONTRACT_REVIEW_ITEMS.filter(isContractReviewRequestItem).filter(
    (i) => i.status === '요청중',
  ).length;
}

export function countPendingContractReviewMock(): number {
  return MOCK_CONTRACT_REVIEW_ITEMS.filter(isContractReviewReceivedItem).filter(
    (i) => i.status === '검토필요',
  ).length;
}

/** 재위탁·서류 검토가 필요한 건(수신·검토필요 + 노드 warning/error) */
export function countReentrustAttentionPendingMock(): number {
  return MOCK_CONTRACT_REVIEW_ITEMS.filter(isContractReviewReceivedItem)
    .filter((i) => i.status === '검토필요')
    .filter((i) => {
      if (!i.reentrust) return false;
      const ns = i.reentrust.nodeStatus;
      return ns === 'warning' || ns === 'error';
    }).length;
}

export function getPendingContractReviewPreviewMock(limit: number): ContractReviewReceivedItem[] {
  return MOCK_CONTRACT_REVIEW_ITEMS.filter(isContractReviewReceivedItem)
    .filter((i) => i.status === '검토필요')
    .sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())
    .slice(0, limit);
}
