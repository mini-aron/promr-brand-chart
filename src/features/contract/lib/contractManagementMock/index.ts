export {
  MOCK_CONTRACT_DOCUMENT_ROWS,
  contractDocumentRowsById,
  DEMO_CONTRACT_DOCUMENT_FILE_URLS,
} from './contractDocumentRows';
export { MOCK_UPPER_SUBCONTRACTORS, type UpperSubcontractorRow } from './upperSubcontractors';
export {
  DEMO_CONTRACT_PLACEHOLDER_A4,
  DEMO_CONTRACT_SAMPLE_URL,
  DEMO_REPORT_CERTIFICATE_SAMPLE_URL,
  DEMO_SUBCONTRACT_CONTRACT_SAMPLE_URL,
  demoContractPlaceholderUrl,
} from './demoContractPlaceholderUrl';

import { contractDocumentRowsById } from './contractDocumentRows';

import { MOCK_REENTRUST_ROOT } from '@/features/contract/mockData';
import type { ContractDocumentRow } from '@/features/contract/ContractDocumentManagePage/types';
import type { ReentrustTreeNode } from '@/features/contract/ContractRequestPage/types';

const CONTRACT_ROW_BY_ID = contractDocumentRowsById();

function findNodeByRowId(root: ReentrustTreeNode, rowId: string): ReentrustTreeNode | null {
  if (root.contractDocumentRowId === rowId) return root;
  for (const child of root.children ?? []) {
    const found = findNodeByRowId(child, rowId);
    if (found) return found;
  }
  return null;
}

function findParentNodeByChildRowId(
  root: ReentrustTreeNode,
  childRowId: string,
): ReentrustTreeNode | null {
  for (const child of root.children ?? []) {
    if (child.contractDocumentRowId === childRowId) return root;
    const found = findParentNodeByChildRowId(child, childRowId);
    if (found) return found;
  }
  return null;
}

const CORP_PARENT_ROW_ID: Record<string, string> = {
  'corp-1': '2', // 한국메디컬
  'corp-2': '1', // (주)사이닝위탁
  'corp-3': '4', // (주)케어파마
  'corp-4': '11', // D법인
};

/**
 * parentRowId(ContractDocumentRow.id) 아래의 "직계 자식" ContractDocumentRow 목록 반환.
 */
export function getDirectChildContractDocumentRowsByParentRowId(
  parentRowId: string,
): ContractDocumentRow[] {
  const parentNode = findNodeByRowId(MOCK_REENTRUST_ROOT, parentRowId);
  const childRowIds = (parentNode?.children ?? [])
    .map((n) => n.contractDocumentRowId)
    .filter((id): id is string => Boolean(id));

  return childRowIds
    .map((id) => CONTRACT_ROW_BY_ID.get(id))
    .filter((row): row is ContractDocumentRow => Boolean(row));
}

/**
 * 데모용 매핑: selected corp에 대응되는 "부모 CSO" rowId를 찾고, 그 직계 자식들을 반환.
 */
export function getDirectChildContractDocumentRowsByCorpId(
  corpId: string | null | undefined,
): ContractDocumentRow[] {
  if (!corpId) return [];
  const parentRowId = CORP_PARENT_ROW_ID[corpId];
  if (!parentRowId) return [];
  return getDirectChildContractDocumentRowsByParentRowId(parentRowId);
}

/**
 * 데모: 선택 법인에 매핑된 본인(직접) 계약 ContractDocumentRow — 재위탁처 목록의 부모 CSO 행.
 */
export function getCorpOwnContractDocumentRow(
  corpId: string | null | undefined,
): ContractDocumentRow | undefined {
  if (!corpId) return undefined;
  const rowId = CORP_PARENT_ROW_ID[corpId];
  if (!rowId) return undefined;
  return CONTRACT_ROW_BY_ID.get(rowId);
}

/**
 * rowId(ContractDocumentRow.id)의 "상위 CSO" 표시용.
 * (루트 직속은 루트 이름 그대로 반환: 샘플제약)
 */
export function getParentCsoNameByContractDocumentRowId(rowId: string): string {
  const parentNode = findParentNodeByChildRowId(MOCK_REENTRUST_ROOT, rowId);
  return parentNode?.name ?? '-';
}

export { MOCK_REENTRUST_ROOT };
