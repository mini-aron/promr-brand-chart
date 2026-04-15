import { DEMO_SUBCONTRACT_CONTRACT_SAMPLE_URL } from './demoContractPlaceholderUrl';

/** 법인이 위탁을 맡긴 상위 CSO(상위 위탁처) — 계약서 제출·재위탁 플로우와 연동되는 UI용 더미 */
export type UpperSubcontractorRow = {
  id: string;
  corporationId: string;
  /** 상위 위탁처(CSO)명 */
  name: string;
  /** 재위탁 트리 기준 "부모 CSO"에 해당하는 ContractDocumentRow.id */
  contractDocumentRowId: string;
  /** 상위 위탁처에 제출하는 재위탁 계약서만 관리 */
  subcontractContractUrl?: string;
};

export const MOCK_UPPER_SUBCONTRACTORS: UpperSubcontractorRow[] = [
  /** corp-1(한국메디컬) 상위 = 재위탁 트리 루트(샘플제약) */
  {
    id: 'usc-1',
    corporationId: 'corp-1',
    name: '샘플제약',
    contractDocumentRowId: '2',
    subcontractContractUrl: DEMO_SUBCONTRACT_CONTRACT_SAMPLE_URL,
  },
  /** corp-1 — 부모 CSO (주)케어파마 · 직계 하위 1건(메디팜코리아 등) */
  {
    id: 'usc-1b',
    corporationId: 'corp-1',
    name: '(주)케어파마',
    contractDocumentRowId: '4',
    subcontractContractUrl: DEMO_SUBCONTRACT_CONTRACT_SAMPLE_URL,
  },
  {
    id: 'usc-3',
    corporationId: 'corp-2',
    name: '샘플제약',
    contractDocumentRowId: '1',
    subcontractContractUrl: DEMO_SUBCONTRACT_CONTRACT_SAMPLE_URL,
  },
];
