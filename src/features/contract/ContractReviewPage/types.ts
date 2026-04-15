import type { ContractDocumentRow } from '@/features/contract/ContractDocumentManagePage/types';

/** 제출 서류 탭 키(계약 문서 행과 동일) */
export type DocKey = keyof ContractDocumentRow['documents'];

/** 계약서 검토 화면에서만 계약서(contract) 탭 제외 */
export type ReviewDocKey = Exclude<DocKey, 'contract'>;
export type ReceivedPreviewDocKey = DocKey;

/** 채널 필터 탭(스타일 variant 키) */
export type ChannelTabKey = 'all' | 'email' | 'kakao' | 'link';

/** 계약서 요청 모달: 전달 방식 */
export type RequestDeliveryMode = 'send' | 'linkOnly';

/** 계약서 요청·수신 채널 (도메인 허용값과 동일) */
export type ContractReviewChannel = '이메일' | '카카오톡' | '링크';

export type ContractReviewReceivedStatus = '검토필요' | '검토완료' | '불가';
export type ContractReviewRequestStatus = '요청중' | '제출완료' | '승인' | '반려' | '재제출요청';

export type ContractReviewListType = '수신목록' | '요청목록' | '재위탁목록';

/** 재위탁 확인 화면과 동일한 노드 상태(데모) */
export type ContractReviewReentrustNodeStatus = 'complete' | 'warning' | 'error';

/** 계약서·재위탁계약서에만 부여되는 기간(신고필증·사업자등록증에는 없음) */
export type ContractReviewReentrustPeriod = { start: string; end: string };

/** 우측 패널: 재위탁 구조·서류 제출 현황(데모) */
export type ContractReviewReentrustDetail = {
  depth: number;
  nodeStatus: ContractReviewReentrustNodeStatus;
  contractDocStatus: 'valid' | 'expired';
  subcontracting: boolean;
  /** 계약서(위탁) 기간 */
  contractPeriod: ContractReviewReentrustPeriod;
  /** 재위탁계약서 기간 — 해당·제출 시 */
  subcontractPeriod?: ContractReviewReentrustPeriod;
  documents: Partial<Record<keyof ContractDocumentRow['documents'], boolean>>;
};

/** 수신된 계약서(법인·파일 정보 포함) */
export type ContractReviewReceivedItem = {
  id: string;
  listType: '수신목록';
  channel: ContractReviewChannel;
  corporationName: string;
  businessRegNo: string;
  summary: string;
  /** 계약서를 제출한 상대(예: 제약사명) — 법인 대시보드 등 */
  submittedTo?: string;
  /** 목록 요약용 기간(계약서 기간과 동일하게 맞춤) */
  startDate: string;
  endDate: string;
  fileName: string;
  /** 데모: 원본 미리보기 이미지 URL (미지정 시 계약서 샘플) */
  previewUrl?: string;
  /** 재위탁 확인 우측 패널 — 없으면 기본 미리보기만 표시 */
  reentrust?: ContractReviewReentrustDetail;
  status: ContractReviewReceivedStatus;
  receivedAt: string;
  isNew: boolean;
};

/** 발송한 계약서 제출 요청(수신 전 — 만료일·제출 링크·전송 채널) */
export type ContractReviewRequestItem = {
  id: string;
  listType: '요청목록';
  /** API `alias` — 있으면 목록 제목으로 사용 */
  alias?: string;
  channel: ContractReviewChannel;
  /** 전달 방식이 "send"인 경우 실제 발송 대상(이메일/전화번호) */
  deliveryTarget?: string;
  /** 생성된 계약 제출 URL(요청 시점 스냅샷) */
  requestUrl: string;
  expiryDate: string;
  status: ContractReviewRequestStatus;
  receivedAt: string;
  isNew: boolean;
};

export type ContractReviewItem = ContractReviewReceivedItem | ContractReviewRequestItem;

export type ContractReviewChannelFilter = '전체' | ContractReviewChannel;

/** 수신목록: 계약서 상태 필터(목록용) */
export type ContractReviewStatusFilter = '전체' | '검토필요' | '불가';

export function isContractReviewReceivedItem(
  item: ContractReviewItem,
): item is ContractReviewReceivedItem {
  return item.listType === '수신목록';
}

export function isContractReviewRequestItem(
  item: ContractReviewItem,
): item is ContractReviewRequestItem {
  return item.listType === '요청목록';
}
