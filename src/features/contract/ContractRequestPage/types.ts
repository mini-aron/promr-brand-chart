/** 재위탁 구조 트리 노드 상태 */
export type ReentrustNodeStatus = 'complete' | 'warning' | 'error';

export type ReentrustTreeNode = {
  id: string;
  name: string;
  /** `MOCK_CONTRACT_DOCUMENT_ROWS`의 id — 있으면 계약서 더미와 동일 행 */
  contractDocumentRowId?: string;
  /** 계약일 표시용 */
  contractDate?: string;
  status: ReentrustNodeStatus;
  /** 계약 만료일 등 */
  expiryDate?: string;
  /** 직접 하위 CSO 수 */
  childCount?: number;
  children?: ReentrustTreeNode[];
};
