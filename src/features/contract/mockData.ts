/**
 * 계약 도메인 데모/목 데이터 일원화. 제거 시 이 파일만 삭제하면 된다.
 */
import type {
  ContractDocumentRow,
  ContractDocumentStatus,
} from '@/features/contract/ContractDocumentManagePage/types';
import type { ContractReviewItem } from '@/features/contract/ContractReviewPage/types';
import type {
  ReentrustTreeNode,
  ReentrustNodeStatus,
} from '@/features/contract/ContractRequestPage/types';
import { MOCK_CONTRACT_DOCUMENT_ROWS } from '@/features/contract/lib/contractManagementMock/contractDocumentRows';
import {
  DEMO_CONTRACT_SAMPLE_URL,
  DEMO_REPORT_CERTIFICATE_SAMPLE_URL,
} from '@/features/contract/lib/contractManagementMock/demoContractPlaceholderUrl';

// --- ContractDocumentManagePage

export const STATUS_LABEL: Record<ContractDocumentStatus, string> = {
  valid: '유효',
  expired: '만료',
};

export const DOCUMENT_ITEMS: {
  key: keyof ContractDocumentRow['documents'];
  label: string;
}[] = [
  { key: 'reportCert', label: '신고필증' },
  { key: 'contract', label: '계약서' },
  { key: 'subcontractContract', label: '재위탁계약서' },
  { key: 'businessLicense', label: '사업자등록증' },
  { key: 'csoTrainingCert', label: 'CSO교육이수증' },
];

/** 계약관리 공통 더미 — 재위탁 트리와 동일 소스 */
export const mockContractDocumentRows: ContractDocumentRow[] = MOCK_CONTRACT_DOCUMENT_ROWS;

// --- ContractReviewPage

export function buildDemoContractRequestUrl(expiryDate: string): string {
  const q = new URLSearchParams({
    organization_id: 'demo-org',
    expires: expiryDate,
  });
  return `/signup?${q.toString()}`;
}

export const MOCK_CONTRACT_REVIEW_ITEMS: ContractReviewItem[] = [
  {
    id: '1',
    listType: '수신목록',
    channel: '이메일',
    corporationName: '(주)굿모닝위탁',
    businessRegNo: '123-45-67890',
    summary: '계약서·신고필증 첨부',
    submittedTo: '샘플제약',
    startDate: '2026-03-15',
    endDate: '2027-03-14',
    fileName: 'contract_2026_03.pdf',
    reentrust: {
      depth: 2,
      nodeStatus: 'warning',
      contractDocStatus: 'valid',
      subcontracting: true,
      contractPeriod: { start: '2026-03-15', end: '2027-03-14' },
      subcontractPeriod: { start: '2026-04-01', end: '2027-03-14' },
      documents: {
        reportCert: false,
        contract: true,
        subcontractContract: true,
        businessLicense: true,
      },
    },
    status: '검토필요',
    receivedAt: '2026-03-25T06:00:00.000Z',
    isNew: true,
  },
  {
    id: 'corp-home-demo',
    listType: '수신목록',
    channel: '이메일',
    corporationName: '한국메디컬',
    businessRegNo: '123-45-67890',
    summary: '위탁계약서·신고필증 제출',
    submittedTo: '샘플제약',
    startDate: '2026-04-01',
    endDate: '2027-03-31',
    fileName: 'corp_dashboard_demo.pdf',
    reentrust: {
      depth: 1,
      nodeStatus: 'complete',
      contractDocStatus: 'valid',
      subcontracting: false,
      contractPeriod: { start: '2026-04-01', end: '2027-03-31' },
      documents: {
        reportCert: true,
        contract: true,
        businessLicense: true,
      },
    },
    status: '검토필요',
    receivedAt: '2026-04-08T09:00:00.000Z',
    isNew: true,
  },
  {
    id: '2',
    listType: '수신목록',
    channel: '카카오톡',
    corporationName: '(주)헬스케어CSO',
    businessRegNo: '234-56-78901',
    summary: '위탁계약 갱신',
    submittedTo: '샘플제약',
    startDate: '2026-02-01',
    endDate: '2027-01-31',
    fileName: 'renewal_2026.pdf',
    previewUrl: DEMO_CONTRACT_SAMPLE_URL,
    reentrust: {
      depth: 1,
      nodeStatus: 'complete',
      contractDocStatus: 'valid',
      subcontracting: true,
      contractPeriod: { start: '2026-02-01', end: '2027-01-31' },
      subcontractPeriod: { start: '2026-02-15', end: '2027-01-31' },
      documents: {
        reportCert: true,
        contract: true,
        subcontractContract: true,
        businessLicense: true,
      },
    },
    status: '검토완료',
    receivedAt: '2026-03-25T03:30:00.000Z',
    isNew: false,
  },
  {
    id: '3',
    listType: '수신목록',
    channel: '카카오톡',
    corporationName: '메디팜위탁',
    businessRegNo: '345-67-89012',
    summary: '신규 위탁 계약',
    submittedTo: '샘플제약',
    startDate: '2026-03-10',
    endDate: '2027-03-09',
    fileName: 'new_contract.pdf',
    previewUrl: DEMO_REPORT_CERTIFICATE_SAMPLE_URL,
    reentrust: {
      depth: 1,
      nodeStatus: 'warning',
      contractDocStatus: 'valid',
      subcontracting: true,
      contractPeriod: { start: '2026-03-10', end: '2027-03-09' },
      documents: {
        reportCert: true,
        contract: true,
        subcontractContract: false,
        businessLicense: true,
      },
    },
    status: '검토필요',
    receivedAt: '2026-03-24T10:00:00.000Z',
    isNew: true,
  },
  {
    id: '4',
    listType: '수신목록',
    channel: '링크',
    corporationName: '(주)파트너메디',
    businessRegNo: '456-78-90123',
    summary: '추가 첨부 서류 포함',
    submittedTo: '샘플제약',
    startDate: '2026-01-20',
    endDate: '2027-01-19',
    fileName: 'partner_2026.pdf',
    reentrust: {
      depth: 1,
      nodeStatus: 'complete',
      contractDocStatus: 'valid',
      subcontracting: false,
      contractPeriod: { start: '2026-01-20', end: '2027-01-19' },
      documents: {
        reportCert: true,
        contract: true,
        businessLicense: true,
      },
    },
    status: '검토완료',
    receivedAt: '2026-03-20T08:00:00.000Z',
    isNew: false,
  },
  {
    id: '5',
    listType: '수신목록',
    channel: '이메일',
    corporationName: '(주)케어솔루션',
    businessRegNo: '567-89-01234',
    summary: '계약서 정정본',
    submittedTo: '샘플제약',
    startDate: '2026-03-22',
    endDate: '2027-03-21',
    fileName: 'amendment.pdf',
    previewUrl: DEMO_CONTRACT_SAMPLE_URL,
    reentrust: {
      depth: 2,
      nodeStatus: 'error',
      contractDocStatus: 'expired',
      subcontracting: true,
      contractPeriod: { start: '2026-03-22', end: '2027-03-21' },
      subcontractPeriod: { start: '2026-04-01', end: '2027-03-21' },
      documents: {
        reportCert: true,
        contract: true,
        subcontractContract: true,
        businessLicense: false,
      },
    },
    status: '불가',
    receivedAt: '2026-03-25T01:15:00.000Z',
    isNew: false,
  },
  {
    id: 'request-1',
    listType: '요청목록',
    channel: '이메일',
    deliveryTarget: 'contracts@corp-demo.kr',
    requestUrl: buildDemoContractRequestUrl('2026-04-05'),
    expiryDate: '2026-04-05',
    status: '요청중',
    receivedAt: '2026-03-26T08:40:00.000Z',
    isNew: true,
  },
  {
    id: 'request-2',
    listType: '요청목록',
    channel: '카카오톡',
    deliveryTarget: '010-1234-5678',
    requestUrl: buildDemoContractRequestUrl('2026-04-10'),
    expiryDate: '2026-04-10',
    status: '요청중',
    receivedAt: '2026-03-26T02:10:00.000Z',
    isNew: false,
  },
  {
    id: 'request-3',
    listType: '요청목록',
    channel: '링크',
    requestUrl: buildDemoContractRequestUrl('2026-03-31'),
    expiryDate: '2026-03-31',
    status: '요청중',
    receivedAt: '2026-03-25T17:20:00.000Z',
    isNew: false,
  },
];

// --- ContractRequestPage (재위탁 트리)

function docRowToTreeStatus(row: ContractDocumentRow): ReentrustNodeStatus {
  if (row.status === 'expired') return 'error';
  const d = row.documents;
  if (d.reportCert && d.contract && d.subcontractContract && d.businessLicense && d.csoTrainingCert)
    return 'complete';
  return 'warning';
}

function rowById(id: string): ContractDocumentRow {
  const row = MOCK_CONTRACT_DOCUMENT_ROWS.find((r) => r.id === id);
  if (!row) throw new Error(`Missing MOCK_CONTRACT_DOCUMENT_ROWS id: ${id}`);
  return row;
}

function nodeFromRow(
  treeId: string,
  rowId: string,
  children?: ReentrustTreeNode[],
): ReentrustTreeNode {
  const row = rowById(rowId);
  return {
    id: treeId,
    name: row.csoName,
    contractDocumentRowId: row.id,
    contractDate: row.contractDate,
    expiryDate: row.expiryDate,
    status: docRowToTreeStatus(row),
    childCount: children?.length ?? 0,
    ...(children?.length ? { children } : {}),
  };
}

/** 제약사 관점 재위탁 구조 — 계약서 더미(`MOCK_CONTRACT_DOCUMENT_ROWS`)와 동기화 */
export const MOCK_REENTRUST_ROOT: ReentrustTreeNode = {
  id: 'pharma-root',
  name: '샘플제약',
  status: 'complete',
  contractDate: '2024-01-01',
  expiryDate: '2027-12-31',
  childCount: 6,
  children: [
    nodeFromRow('cso-1', '2', [
      nodeFromRow('cso-1-1', '3', [
        nodeFromRow('cso-1-1-1', '4', [nodeFromRow('cso-1-1-1-1', '5')]),
      ]),
    ]),
    nodeFromRow('cso-2', '1', [
      nodeFromRow('cso-2-1', '7'),
      nodeFromRow('cso-2-2', '8'),
      nodeFromRow('cso-2-3', '9'),
      nodeFromRow('cso-2-4', '10'),
    ]),
    nodeFromRow('cso-3', '4', [nodeFromRow('cso-3-1', '5')]),
    nodeFromRow('cso-4', '6'),
    nodeFromRow('cso-5', '11'),
    /** 4차 재위탁까지 이어지는 데모 경로 — 매트릭스에 1~4차 열이 모두 노출됨 */
    nodeFromRow('cso-6', '2', [
      nodeFromRow('cso-6-1', '7', [nodeFromRow('cso-6-2', '8', [nodeFromRow('cso-6-3', '9')])]),
    ]),
  ],
};
