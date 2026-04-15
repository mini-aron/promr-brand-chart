import type { ContractDocumentRow } from '@/features/contract/ContractDocumentManagePage/types';
import {
  DEMO_CONTRACT_SAMPLE_URL,
  DEMO_REPORT_CERTIFICATE_SAMPLE_URL,
  DEMO_SUBCONTRACT_CONTRACT_SAMPLE_URL,
  demoContractPlaceholderUrl,
} from './demoContractPlaceholderUrl';

/** 등록된 서류 다운로드 데모 URL(행에 documentUrls 없을 때 사용) — A4 비율 */
export const DEMO_CONTRACT_DOCUMENT_FILE_URLS: Record<
  keyof ContractDocumentRow['documents'],
  string
> = {
  reportCert: DEMO_REPORT_CERTIFICATE_SAMPLE_URL,
  contract: DEMO_CONTRACT_SAMPLE_URL,
  subcontractContract: DEMO_SUBCONTRACT_CONTRACT_SAMPLE_URL,
  businessLicense: demoContractPlaceholderUrl('Business License'),
  csoTrainingCert: demoContractPlaceholderUrl('CSO교육이수증'),
};

/**
 * 계약관리(계약서·서류 목록 / 재위탁 트리) 공통 더미.
 * id는 재위탁 트리 노드의 contractDocumentRowId와 대응합니다.
 */
export const MOCK_CONTRACT_DOCUMENT_ROWS: ContractDocumentRow[] = [
  {
    id: '1',
    csoName: '(주)굿모닝위탁',
    contractDate: '2024-03-10',
    expiryDate: '2026-03-09',
    status: 'valid',
    documents: {
      reportCert: true,
      contract: true,
      subcontractContract: false,
      businessLicense: true,
      csoTrainingCert: true,
    },
    subcontracting: true,
  },
  {
    id: '2',
    csoName: '한국메디컬',
    contractDate: '2024-06-20',
    expiryDate: '2026-04-15',
    status: 'valid',
    documents: {
      reportCert: true,
      contract: true,
      subcontractContract: true,
      businessLicense: true,
      csoTrainingCert: true,
    },
    subcontracting: true,
  },
  {
    id: '3',
    csoName: '(유)헬스케어솔루션',
    contractDate: '2024-08-01',
    expiryDate: '2025-12-31',
    status: 'expired',
    documents: {
      reportCert: false,
      contract: true,
      subcontractContract: false,
      businessLicense: false,
      csoTrainingCert: false,
    },
    subcontracting: true,
  },
  {
    id: '4',
    csoName: '(주)케어파마',
    contractDate: '2024-05-01',
    expiryDate: '2026-04-30',
    status: 'valid',
    documents: {
      reportCert: true,
      contract: true,
      subcontractContract: true,
      businessLicense: true,
      csoTrainingCert: true,
    },
    subcontracting: true,
  },
  {
    id: '5',
    csoName: '(주)메디팜코리아',
    contractDate: '2024-09-15',
    expiryDate: '2026-09-14',
    status: 'valid',
    documents: {
      reportCert: true,
      contract: false,
      subcontractContract: false,
      businessLicense: true,
      csoTrainingCert: false,
    },
    subcontracting: true,
  },
  {
    id: '6',
    csoName: '(주)파트너메디',
    contractDate: '2024-11-01',
    expiryDate: '2027-10-31',
    status: 'valid',
    documents: {
      reportCert: true,
      contract: true,
      subcontractContract: true,
      businessLicense: true,
      csoTrainingCert: true,
    },
    subcontracting: true,
  },
  /** (주)사이닝위탁(corp-2) 하위 재위탁처 */
  {
    id: '7',
    csoName: '강태영',
    contractDate: '2024-04-12',
    expiryDate: '2026-04-11',
    status: 'valid',
    documents: {
      reportCert: true,
      contract: true,
      subcontractContract: true,
      businessLicense: true,
      csoTrainingCert: true,
    },
    subcontracting: true,
  },
  {
    id: '8',
    csoName: '문수빈',
    contractDate: '2024-05-20',
    expiryDate: '2026-05-19',
    status: 'valid',
    documents: {
      reportCert: true,
      contract: true,
      subcontractContract: true,
      businessLicense: true,
      csoTrainingCert: true,
    },
    subcontracting: true,
  },
  {
    id: '9',
    csoName: '임재현',
    contractDate: '2024-07-08',
    expiryDate: '2026-07-07',
    status: 'valid',
    documents: {
      reportCert: true,
      contract: true,
      subcontractContract: true,
      businessLicense: true,
      csoTrainingCert: true,
    },
    subcontracting: true,
  },
  {
    id: '10',
    csoName: '한소희',
    contractDate: '2024-09-01',
    expiryDate: '2026-08-31',
    status: 'valid',
    documents: {
      reportCert: true,
      contract: true,
      subcontractContract: true,
      businessLicense: true,
      csoTrainingCert: true,
    },
    subcontracting: true,
  },
  /** D법인(corp-4) 직접 계약 */
  {
    id: '11',
    csoName: 'D법인',
    contractDate: '2024-10-01',
    expiryDate: '2026-09-30',
    status: 'valid',
    documents: {
      reportCert: true,
      contract: true,
      subcontractContract: true,
      businessLicense: true,
      csoTrainingCert: true,
    },
    subcontracting: true,
  },
];

export function contractDocumentRowsById(): Map<string, ContractDocumentRow> {
  return new Map(MOCK_CONTRACT_DOCUMENT_ROWS.map((r) => [r.id, r]));
}
