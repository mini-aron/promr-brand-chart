'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import {
  GitBranch,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';
import { clsx } from 'clsx';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import { SingleSelect } from '@/shared/components/ui/Select';
import { DataTable } from '@/shared/components/ui/DataTable';
import * as s from './index.css';
import { DOCUMENT_ITEMS } from '@/features/contract/mockData';
import {
  DEMO_REPORT_CERTIFICATE_SAMPLE_URL,
  DEMO_SUBCONTRACT_CONTRACT_SAMPLE_URL,
  demoContractPlaceholderUrl,
} from '@/features/contract/lib/contractManagementMock';
import type { ReentrustTreeNode, ReentrustNodeStatus } from './types';
import {
  getReEntrusContractDetail,
  getReEntrusContractGraph,
} from '@/api/services/contractService';
import type {
  ContractStatus,
  GetReEntrusContractDetailResponse,
  GetReEntrusContractGraphResponse,
} from '@/types/services/contractService';

type RequestDocKey = Exclude<(typeof DOCUMENT_ITEMS)[number]['key'], 'contract'>;

/** 재위탁 확인 화면에서는 계약서(contract) 항목 제외 */
const REQUEST_DOCUMENT_ITEMS = DOCUMENT_ITEMS.filter(
  (i): i is { key: RequestDocKey; label: string } => i.key !== 'contract',
);

const STATUS_DETAIL_LABEL: Record<ReentrustNodeStatus, string> = {
  complete: '완료',
  warning: '검토필요',
  error: '불가',
};

const CONTRACT_STATUS_LABEL: Record<ContractStatus, string> = {
  REQUESTED: '요청중',
  SUBMITTED: '제출완료',
  APPROVED: '완료',
  REJECTED: '불가',
  RESUBMIT_REQUESTED: '재제출요청',
};

function toNodeStatus(status: ContractStatus): ReentrustNodeStatus {
  if (status === 'APPROVED') return 'complete';
  if (status === 'REJECTED') return 'error';
  return 'warning';
}

type SelectedDetailDocs = Record<RequestDocKey, boolean>;

function buildSelectedDetailDocs(detail: GetReEntrusContractDetailResponse): SelectedDetailDocs {
  return {
    reportCert: Boolean(detail.documents.salesDeclarationCertificateFileName),
    subcontractContract: Boolean(detail.reEntrustContractFileName),
    businessLicense: Boolean(detail.documents.businessRegistrationFileName),
    csoTrainingCert: Boolean(detail.documents.csoTraningCompletionCertificateFileName),
  };
}

function buildTreeFromGraph(
  graphList: GetReEntrusContractGraphResponse['list'],
): ReentrustTreeNode {
  const statusPriority: Record<ReentrustNodeStatus, number> = {
    complete: 0,
    warning: 1,
    error: 2,
  };

  const mergeNodeStatus = (
    prev: ReentrustNodeStatus,
    next: ReentrustNodeStatus,
  ): ReentrustNodeStatus => {
    return statusPriority[next] > statusPriority[prev] ? next : prev;
  };

  const toNode = (
    corporationId: number,
    corporationName: string,
    contractStatus: ContractStatus,
    depth: number,
  ): ReentrustTreeNode => ({
    id: `${corporationId}-${depth}`,
    name: corporationName,
    status: toNodeStatus(contractStatus),
    children: [],
  });

  const rootsByKey = new Map<string, ReentrustTreeNode>();

  const mergeChildren = (target: ReentrustTreeNode, sourceChildren: ReentrustTreeNode[]) => {
    sourceChildren.forEach((sourceChild) => {
      const sameNode = target.children?.find(
        (child) => child.id === sourceChild.id && child.name === sourceChild.name,
      );

      if (sameNode) {
        sameNode.status = mergeNodeStatus(sameNode.status, sourceChild.status);
        mergeChildren(sameNode, sourceChild.children ?? []);
        return;
      }

      target.children = [...(target.children ?? []), sourceChild];
    });
  };

  graphList.forEach((rootItem) => {
    const firstNode = toNode(
      rootItem.corporationId,
      rootItem.corporationName,
      rootItem.contractStatus,
      1,
    );

    const descendants = [...rootItem.child].sort((a, b) => a.depth - b.depth);
    const levelTail = new Map<number, ReentrustTreeNode>([[1, firstNode]]);

    descendants.forEach((child) => {
      const childNode = toNode(
        child.corporationId,
        child.corporationName,
        child.contractStatus,
        child.depth,
      );
      const parentDepth = Math.max(1, child.depth - 1);
      const parentNode = levelTail.get(parentDepth) ?? firstNode;
      parentNode.children = [...(parentNode.children ?? []), childNode];
      levelTail.set(child.depth, childNode);
    });

    const rootKey = `${rootItem.corporationId}-${rootItem.corporationName}`;
    const existingRoot = rootsByKey.get(rootKey);
    if (!existingRoot) {
      rootsByKey.set(rootKey, firstNode);
      return;
    }

    existingRoot.status = mergeNodeStatus(existingRoot.status, firstNode.status);
    mergeChildren(existingRoot, firstNode.children ?? []);
  });

  const roots = [...rootsByKey.values()];

  return {
    id: 'pharma-root',
    name: '제약사',
    status: 'complete',
    childCount: roots.length,
    children: roots,
  };
}

/** 매트릭스 `[검토]` 열 — 좁은 폭용 짧은 표기(전체는 title·툴팁) */
const MATRIX_REVIEW_SHORT: Record<ReentrustNodeStatus, string> = {
  complete: '완료',
  warning: '검토',
  error: '불가',
};

const DOC_PREVIEW_PLACEHOLDER: Record<RequestDocKey, { title: string; url: string }> = {
  reportCert: {
    title: '신고필증 미리보기(데모)',
    url: DEMO_REPORT_CERTIFICATE_SAMPLE_URL,
  },
  subcontractContract: {
    title: '재위탁계약서 미리보기',
    url: DEMO_SUBCONTRACT_CONTRACT_SAMPLE_URL,
  },
  businessLicense: {
    title: '사업자등록증 미리보기(데모)',
    url: demoContractPlaceholderUrl('Business License'),
  },
  csoTrainingCert: {
    title: 'CSO교육이수증 미리보기(데모)',
    url: demoContractPlaceholderUrl('CSO교육이수증'),
  },
};

function findNodeById(root: ReentrustTreeNode, id: string): ReentrustTreeNode | null {
  if (root.id === id) return root;
  if (!root.children) return null;
  for (const c of root.children) {
    const f = findNodeById(c, id);
    if (f) return f;
  }
  return null;
}

function findNodeDepthById(node: ReentrustTreeNode, id: string, depth = 0): number | null {
  if (node.id === id) return depth;
  if (!node.children?.length) return null;
  for (const child of node.children) {
    const found = findNodeDepthById(child, id, depth + 1);
    if (found != null) return found;
  }
  return null;
}

type TreeStatusFilter = 'all' | ReentrustNodeStatus;
type TierFilter = number;
type RequestViewMode = 'matrix' | 'tree';

function filterTree(
  node: ReentrustTreeNode,
  query: string,
  status: TreeStatusFilter,
  ancestorTextMatched = false,
): ReentrustTreeNode | null {
  const q = query.trim().toLowerCase();
  // 상위에서 텍스트가 매치됐으면 자신은 텍스트 검사를 건너뜀
  const textMatched = ancestorTextMatched || !q || node.name.toLowerCase().includes(q);
  const matchStatus = status === 'all' || node.status === status;
  const matchSelf = textMatched && matchStatus;

  if (!node.children?.length) return matchSelf ? node : null;

  const filteredChildren = node.children
    .map((c) => filterTree(c, query, status, textMatched))
    .filter((v): v is ReentrustTreeNode => Boolean(v));

  if (matchSelf || filteredChildren.length) {
    return { ...node, children: filteredChildren };
  }

  return null;
}

type MatrixCell = {
  nodeId: string;
  name: string;
  status: ReentrustNodeStatus;
  tier: number;
  contractDate?: string;
};

type MatrixRow = {
  id: string;
  cells: Array<MatrixCell | null>;
};

function toMatrixCell(node: ReentrustTreeNode, tier: number): MatrixCell {
  return {
    nodeId: node.id,
    name: node.name,
    status: node.status,
    tier,
    contractDate: node.contractDate,
  };
}

function collectExpandableNodeIds(node: ReentrustTreeNode, acc: string[] = []): string[] {
  if (!node.children?.length) return acc;

  acc.push(node.id);
  node.children.forEach((child) => collectExpandableNodeIds(child, acc));

  return acc;
}

function findPathToNode(node: ReentrustTreeNode, id: string, path: string[] = []): string[] | null {
  const nextPath = [...path, node.id];
  if (node.id === id) return nextPath;
  if (!node.children?.length) return null;

  for (const child of node.children) {
    const childPath = findPathToNode(child, id, nextPath);
    if (childPath) return childPath;
  }

  return null;
}

function findFirstVisibleTreeCell(root: ReentrustTreeNode): MatrixCell | null {
  const firstNode = root.children?.[0];
  if (!firstNode) return null;
  return toMatrixCell(firstNode, 1);
}

function collectLeafPaths(
  node: ReentrustTreeNode,
  path: ReentrustTreeNode[] = [],
  acc: ReentrustTreeNode[][] = [],
): ReentrustTreeNode[][] {
  const nextPath = [...path, node];

  if (!node.children?.length) {
    acc.push(nextPath);
    return acc;
  }

  for (const child of node.children) {
    collectLeafPaths(child, nextPath, acc);
  }

  return acc;
}

function buildMatrixRows(root: ReentrustTreeNode): MatrixRow[] {
  const paths: ReentrustTreeNode[][] = [];

  if (root.children?.length) {
    root.children.forEach((child) => collectLeafPaths(child, [], paths));
  } else {
    collectLeafPaths(root, [], paths);
  }

  return paths.map((path, rowIndex) => ({
    id: `row-${rowIndex}-${path.map((v) => v.id).join('-')}`,
    cells: path.map((node, index) => toMatrixCell(node, index + 1)),
  }));
}

export function ContractRequestPage() {
  const [treeRoot, setTreeRoot] = useState<ReentrustTreeNode | null>(null);
  const [viewMode, setViewMode] = useState<RequestViewMode>('matrix');
  const [selectedId, setSelectedId] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});
  /** 매트릭스에서 클릭한 차수(1-based). 해당 열에만 선택 스타일을 적용하고, 같은 nodeId를 가진 모든 행을 묶어 표시 */
  const [selectedMatrixTier, setSelectedMatrixTier] = useState(1);
  const [filterQuery, setFilterQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<TreeStatusFilter>('all');
  const [tierFilter, setTierFilter] = useState<TierFilter>(1);
  /** 매트릭스 `[검토]` 열 표시 — 필터에서 숨기기/표시 토글 */
  const [hideReviewColumn, setHideReviewColumn] = useState(false);
  const [activeDocKey, setActiveDocKey] = useState<RequestDocKey | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);
  const [previewPan, setPreviewPan] = useState({ x: 0, y: 0 });
  const [isPreviewDragging, setIsPreviewDragging] = useState(false);
  const [finePointer, setFinePointer] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<GetReEntrusContractDetailResponse | null>(
    null,
  );
  const previewDragRef = useRef({ startX: 0, startY: 0, originX: 0, originY: 0 });

  const selected = useMemo(() => {
    if (!treeRoot || !selectedId) return null;
    return findNodeById(treeRoot, selectedId);
  }, [selectedId, treeRoot]);

  const selectedDepth = useMemo(() => {
    if (!treeRoot || !selectedId) return 0;
    const depth = findNodeDepthById(treeRoot, selectedId);
    return depth ?? 0;
  }, [selectedId, treeRoot]);

  const selectedDetailDocs = useMemo(() => {
    if (!selectedDetail) return null;
    return buildSelectedDetailDocs(selectedDetail);
  }, [selectedDetail]);

  useEffect(() => {
    if (!selectedDetailDocs) {
      setActiveDocKey(null);
      return;
    }
    const firstSubmitted =
      REQUEST_DOCUMENT_ITEMS.find(({ key }) => selectedDetailDocs[key])?.key ?? null;
    setActiveDocKey(firstSubmitted);
  }, [selectedDetailDocs]);

  const activeDocPreview = useMemo(() => {
    if (!activeDocKey) return null;
    const preview = DOC_PREVIEW_PLACEHOLDER[activeDocKey];
    return { title: preview.title, src: preview.url };
  }, [activeDocKey]);

  const activeDocLabel = useMemo(() => {
    if (!activeDocKey) return '';
    return REQUEST_DOCUMENT_ITEMS.find((d) => d.key === activeDocKey)?.label ?? '';
  }, [activeDocKey]);

  const submittedDocKeys = useMemo(() => {
    if (!selectedDetailDocs) return [] as RequestDocKey[];
    return REQUEST_DOCUMENT_ITEMS.filter(({ key }) => selectedDetailDocs[key]).map(
      ({ key }) => key,
    );
  }, [selectedDetailDocs]);

  const docNavIndex = activeDocKey ? submittedDocKeys.indexOf(activeDocKey) : -1;
  const canPrevDoc = docNavIndex > 0;
  const canNextDoc = docNavIndex >= 0 && docNavIndex < submittedDocKeys.length - 1;

  const goPrevDoc = useCallback(() => {
    setActiveDocKey((prev) => {
      if (prev == null) return prev;
      const idx = submittedDocKeys.indexOf(prev);
      if (idx <= 0) return prev;
      return submittedDocKeys[idx - 1]!;
    });
  }, [submittedDocKeys]);

  const goNextDoc = useCallback(() => {
    setActiveDocKey((prev) => {
      if (prev == null) return prev;
      const idx = submittedDocKeys.indexOf(prev);
      if (idx < 0 || idx >= submittedDocKeys.length - 1) return prev;
      return submittedDocKeys[idx + 1]!;
    });
  }, [submittedDocKeys]);

  const closePreviewModal = useCallback(() => {
    setIsPreviewModalOpen(false);
    setPreviewScale(1);
    setPreviewPan({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    let mounted = true;
    void getReEntrusContractGraph()
      .then(({ data }) => {
        if (!mounted) return;
        const nextRoot = buildTreeFromGraph(data.list);
        setTreeRoot(nextRoot);
        setExpandedNodes({});
        const firstChild = nextRoot.children?.[0];
        if (firstChild) {
          setSelectedId(firstChild.id);
          setSelectedMatrixTier(1);
        }
      })
      .catch(() => {
        if (!mounted) return;
        setTreeRoot({
          id: 'pharma-root',
          name: '제약사',
          status: 'complete',
          children: [],
        });
      });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selected) {
      setSelectedDetail(null);
      return;
    }
    const [corporationIdRaw] = selected.id.split('-');
    const corporationId = Number(corporationIdRaw);
    if (Number.isNaN(corporationId)) {
      setSelectedDetail(null);
      return;
    }
    let mounted = true;
    void getReEntrusContractDetail(corporationId)
      .then(({ data }) => {
        if (!mounted) return;
        setSelectedDetail(data);
      })
      .catch(() => {
        if (!mounted) return;
        setSelectedDetail(null);
      });
    return () => {
      mounted = false;
    };
  }, [selected]);

  useEffect(() => {
    if (!isPreviewDragging) return;

    const onMove = (e: PointerEvent) => {
      setPreviewPan({
        x: previewDragRef.current.originX + (e.clientX - previewDragRef.current.startX),
        y: previewDragRef.current.originY + (e.clientY - previewDragRef.current.startY),
      });
    };
    const onUp = () => setIsPreviewDragging(false);

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, [isPreviewDragging]);

  useEffect(() => {
    if (!isPreviewModalOpen) return;
    setPreviewPan({ x: 0, y: 0 });
    setPreviewScale(1);
    setIsPreviewDragging(false);
  }, [isPreviewModalOpen, activeDocKey]);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const sync = () => setFinePointer(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!isPreviewModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closePreviewModal();
        return;
      }
      if (submittedDocKeys.length <= 1) return;
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrevDoc();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNextDoc();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [closePreviewModal, goNextDoc, goPrevDoc, isPreviewModalOpen, submittedDocKeys.length]);

  const filteredRoot = useMemo(() => {
    if (!treeRoot) return null;
    return filterTree(treeRoot, filterQuery, filterStatus) ?? treeRoot;
  }, [filterQuery, filterStatus, treeRoot]);

  const expandedTreeNodeIds = useMemo(() => {
    if (!filteredRoot) return new Set<string>();

    if (filterQuery.trim() || filterStatus !== 'all') {
      return new Set(collectExpandableNodeIds(filteredRoot));
    }

    return new Set(
      Object.entries(expandedNodes)
        .filter(([, isExpanded]) => isExpanded)
        .map(([nodeId]) => nodeId),
    );
  }, [expandedNodes, filterQuery, filterStatus, filteredRoot]);

  const allMatrixRows = useMemo(() => (treeRoot ? buildMatrixRows(treeRoot) : []), [treeRoot]);
  const matrixRows = useMemo(
    () => (filteredRoot ? buildMatrixRows(filteredRoot) : []),
    [filteredRoot],
  );

  const maxDepth = useMemo(() => {
    return allMatrixRows.reduce((max, row) => Math.max(max, row.cells.length), 0);
  }, [allMatrixRows]);

  /** n차부터: 경로 깊이가 n 미만인 행 제외 */
  const matrixRowsForTable = useMemo(() => {
    return matrixRows.filter((row) => row.cells.length >= tierFilter);
  }, [matrixRows, tierFilter]);

  const tierStartIndex = useMemo(() => Math.max(0, tierFilter - 1), [tierFilter]);

  /** 매트릭스 하단: 보이는 행 기준 차수별 업체 수·상태 합 */
  const matrixTierAggregates = useMemo(() => {
    const list: {
      tier: number;
      total: number;
      complete: number;
      warning: number;
      error: number;
    }[] = [];
    for (let colIndex = tierStartIndex; colIndex < maxDepth; colIndex += 1) {
      const tierNum = colIndex + 1;
      let total = 0;
      let complete = 0;
      let warning = 0;
      let error = 0;
      for (const row of matrixRowsForTable) {
        const c = row.cells[colIndex];
        if (!c) continue;
        total += 1;
        if (c.status === 'complete') complete += 1;
        else if (c.status === 'warning') warning += 1;
        else error += 1;
      }
      list.push({ tier: tierNum, total, complete, warning, error });
    }
    return list;
  }, [matrixRowsForTable, maxDepth, tierStartIndex]);

  const firstVisibleNode = useMemo(() => {
    if (!filteredRoot) return null;

    if (viewMode === 'tree') {
      return findFirstVisibleTreeCell(filteredRoot);
    }

    return (
      matrixRowsForTable[0]?.cells.filter((cell): cell is MatrixCell => Boolean(cell)).at(-1) ??
      matrixRowsForTable[0]?.cells.find((cell): cell is MatrixCell => Boolean(cell)) ??
      null
    );
  }, [filteredRoot, matrixRowsForTable, viewMode]);

  useEffect(() => {
    if (!filteredRoot) return;
    if (findNodeById(filteredRoot, selectedId)) return;

    if (firstVisibleNode) {
      setSelectedId(firstVisibleNode.nodeId);
      setSelectedMatrixTier(firstVisibleNode.tier);
    }
  }, [filteredRoot, firstVisibleNode, selectedId]);

  /** n차만으로 바꿨을 때 선택 차수가 숨겨지면 보이는 첫 노드로 맞춤 */
  useEffect(() => {
    if (viewMode !== 'matrix') return;
    if (selectedMatrixTier >= tierFilter) return;

    if (firstVisibleNode) {
      setSelectedId(firstVisibleNode.nodeId);
      setSelectedMatrixTier(firstVisibleNode.tier);
    }
  }, [firstVisibleNode, selectedMatrixTier, tierFilter, viewMode]);

  const matrixColumns = useMemo<ColumnDef<MatrixRow, unknown>[]>(() => {
    const columns: ColumnDef<MatrixRow, unknown>[] = [];

    for (let i = tierStartIndex; i < maxDepth; i += 1) {
      const colIndex = i;
      const tierNum = i + 1;
      const groupMinWidth = hideReviewColumn ? 188 : 232;

      const leafColumns: ColumnDef<MatrixRow, unknown>[] = [
        {
          id: `tier-${tierNum}`,
          header: '차수',
          accessorFn: (row) => row.cells[colIndex]?.tier ?? '',
          size: 48,
          meta: {
            thStyle: { width: 48, minWidth: 48, maxWidth: 48 },
            tdStyle: { width: 48, minWidth: 48, maxWidth: 48 },
          },
          cell: ({ row }) => {
            const cell = row.original.cells[colIndex];
            return cell ? `${cell.tier}차` : '';
          },
        },
      ];

      if (!hideReviewColumn) {
        leafColumns.push({
          id: `review-${tierNum}`,
          header: '[검토]',
          accessorFn: (row) => row.cells[colIndex]?.status ?? '',
          size: 44,
          meta: {
            thStyle: {
              width: 44,
              minWidth: 44,
              maxWidth: 44,
              fontSize: 9,
              letterSpacing: '-0.04em',
            },
            tdStyle: { width: 44, minWidth: 44, maxWidth: 44 },
          },
          cell: ({ row }) => {
            const cell = row.original.cells[colIndex];
            if (!cell) return '';
            const label = STATUS_DETAIL_LABEL[cell.status];
            return (
              <span className={s.matrixReviewCellInner} title={label}>
                <span className={clsx(s.statusDot[cell.status], s.matrixReviewDot)} aria-hidden />
                <span className={s.matrixReviewAbbrev}>{MATRIX_REVIEW_SHORT[cell.status]}</span>
              </span>
            );
          },
        });
      }

      leafColumns.push({
        id: `name-${tierNum}`,
        header: '업체명',
        accessorFn: (row) => row.cells[colIndex]?.name ?? '',
        size: 140,
        meta: {
          thStyle: { width: 140, minWidth: 140, maxWidth: 140 },
          tdStyle: { width: 140, minWidth: 140, maxWidth: 140 },
        },
        cell: ({ row }) => {
          const cell = row.original.cells[colIndex];
          return cell?.name ?? '';
        },
      });

      columns.push({
        id: `tier-group-${tierNum}`,
        header: `${tierNum}차`,
        meta: {
          thStyle: { width: groupMinWidth, minWidth: groupMinWidth },
        },
        columns: leafColumns,
      });
    }

    return columns;
  }, [hideReviewColumn, maxDepth, tierStartIndex]);

  const handleCellSelect = useCallback((nodeId: string, tier: number) => {
    setSelectedId(nodeId);
    setSelectedMatrixTier(tier);
  }, []);

  const toggleExpandedNode = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  }, []);

  useEffect(() => {
    if (!treeRoot || !selectedId) return;

    const nodePath = findPathToNode(treeRoot, selectedId);
    if (!nodePath) return;

    setExpandedNodes((prev) => {
      const next = { ...prev };
      let changed = false;

      nodePath.slice(0, -1).forEach((nodeId) => {
        if (!next[nodeId]) {
          next[nodeId] = true;
          changed = true;
        }
      });

      return changed ? next : prev;
    });
  }, [selectedId, treeRoot]);

  const renderTreeNodes = useCallback(
    (nodes: ReentrustTreeNode[], depth = 1) =>
      nodes.map((node) => {
        const hasChildren = Boolean(node.children?.length);
        const isExpanded = hasChildren && expandedTreeNodeIds.has(node.id);
        const isSelected = node.id === selectedId;

        return (
          <div key={node.id} className={s.treeNodeGroup}>
            <div
              className={s.treeNodeRow}
              style={{ paddingLeft: `${Math.max(0, depth - 1) * 18}px` }}
            >
              {hasChildren ? (
                <button
                  type="button"
                  className={s.expandBtn}
                  aria-label={isExpanded ? '하위 조직 접기' : '하위 조직 펼치기'}
                  aria-expanded={isExpanded}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpandedNode(node.id);
                  }}
                >
                  {isExpanded ? (
                    <ChevronDown size={16} strokeWidth={2} aria-hidden />
                  ) : (
                    <ChevronRight size={16} strokeWidth={2} aria-hidden />
                  )}
                </button>
              ) : (
                <span className={s.expandPlaceholder} aria-hidden />
              )}

              <button
                type="button"
                className={clsx(s.treeRow, isSelected && s.treeRowSelected)}
                onClick={() => handleCellSelect(node.id, depth)}
                aria-pressed={isSelected}
              >
                <span className={s.treeIconWrap}>
                  <span className={s.tierLogoBadge}>{depth}차</span>
                </span>

                <div className={s.treeBody}>
                  <span className={clsx(s.statusDot[node.status], s.treeStatusDot)} aria-hidden />
                  <div className={s.treeTextColumn}>
                    <span className={s.treeName}>{node.name}</span>
                    <span className={s.treeMeta}>
                      {`${depth}차 · ${STATUS_DETAIL_LABEL[node.status]}${hasChildren ? ` · 하위 ${node.children?.length ?? 0}개` : ''}`}
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {hasChildren && isExpanded ? (
              <div className={s.treeChildren}>
                {renderTreeNodes(node.children ?? [], depth + 1)}
              </div>
            ) : null}
          </div>
        );
      }),
    [expandedTreeNodeIds, handleCellSelect, selectedId, toggleExpandedNode],
  );

  return (
    <div className={s.page}>
      <PageHeader
        title="재위탁 확인"
        description="재위탁 구조를 확인하고, 선택한 CSO의 계약 정보를 검토합니다."
      />

      <div className={s.main}>
        <div className={s.layout}>
          <aside className={s.leftPanel}>
            <h2 className={s.panelTitle}>재위탁 구조</h2>

            <div className={s.treeFilterWrap}>
              <div className={s.viewModeRow}>
                <span className={s.viewModeLabel}>보기 방식</span>
                <div className={s.viewModeSwitch} role="tablist" aria-label="보기 방식 선택">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={viewMode === 'matrix'}
                    className={clsx(
                      s.viewModeButton,
                      viewMode === 'matrix' && s.viewModeButtonActive,
                    )}
                    onClick={() => setViewMode('matrix')}
                  >
                    표 보기
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={viewMode === 'tree'}
                    className={clsx(
                      s.viewModeButton,
                      viewMode === 'tree' && s.viewModeButtonActive,
                    )}
                    onClick={() => setViewMode('tree')}
                  >
                    트리 보기
                  </button>
                </div>
              </div>

              <div className={s.treeFilterRow}>
                <Input
                  size="default"
                  className={s.treeFilterInput}
                  aria-label="업체명 검색"
                  value={filterQuery}
                  placeholder="업체명 검색"
                  onChange={(e) => setFilterQuery(e.target.value)}
                />

                <div className={s.treeFilterSelect}>
                  <SingleSelect
                    options={[
                      { label: '전체', value: '' },
                      { label: '완료', value: 'complete' },
                      { label: '검토필요', value: 'warning' },
                      { label: '불가', value: 'error' },
                    ]}
                    selected={filterStatus === 'all' ? '' : filterStatus}
                    onChange={(v) => setFilterStatus(v === '' ? 'all' : (v as ReentrustNodeStatus))}
                    aria-label="상태 필터"
                    size="default"
                  />
                </div>

                {viewMode === 'matrix' && (
                  <div className={s.treeFilterSelect}>
                    <SingleSelect
                      options={[
                        { label: '1차부터', value: '1' },
                        { label: '2차부터', value: '2' },
                        { label: '3차부터', value: '3' },
                        { label: '4차부터', value: '4' },
                        { label: '5차부터', value: '5' },
                      ]}
                      selected={String(tierFilter)}
                      onChange={(v) => setTierFilter(Number(v))}
                      aria-label="차수 필터"
                      size="default"
                    />
                  </div>
                )}

                {viewMode === 'matrix' && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="small"
                    className={s.treeFilterReviewToggle}
                    onClick={() => setHideReviewColumn((v) => !v)}
                    aria-pressed={hideReviewColumn}
                    title={
                      hideReviewColumn
                        ? '매트릭스에 검토 열을 다시 표시합니다'
                        : '매트릭스에서 검토 열을 숨깁니다'
                    }
                  >
                    {hideReviewColumn ? '검토여부 표시' : '검토여부 숨기기'}
                  </Button>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  size="small"
                  onClick={() => {
                    setFilterQuery('');
                    setFilterStatus('all');
                    setTierFilter(1);
                  }}
                >
                  초기화
                </Button>
              </div>
            </div>

            <div className={s.treeScroll}>
              {viewMode === 'matrix' ? (
                <DataTable<MatrixRow>
                  variant="plain"
                  className={s.matrixTableWrap}
                  tableClassName={s.matrixTable}
                  columns={matrixColumns}
                  data={matrixRowsForTable}
                  getRowId={(row) => row.id}
                  emptyMessage="표시할 데이터가 없습니다."
                  getTdProps={(cell, row) => {
                    const match = cell.column.id.match(/^(tier|review|name)-(\d+)$/);
                    if (!match) return {};

                    const [, kind, rawIndex] = match;
                    const index = Number(rawIndex) - 1;
                    const rowCell = row.original.cells[index];

                    if (!rowCell) {
                      if (kind === 'tier') return { className: s.matrixTierEmptyCell };
                      if (kind === 'review') return { className: s.matrixReviewEmptyCell };
                      return { className: s.matrixNameEmptyCell };
                    }

                    const nodeAtSelectedTier = row.original.cells[selectedMatrixTier - 1];
                    const isSelectedGroupCell =
                      index === selectedMatrixTier - 1 &&
                      nodeAtSelectedTier != null &&
                      nodeAtSelectedTier.nodeId === selectedId;

                    const cellClass =
                      kind === 'tier'
                        ? s.matrixTierCell
                        : kind === 'review'
                          ? s.matrixReviewCell
                          : s.matrixNameCell;
                    const cellSelectedClass =
                      kind === 'tier'
                        ? s.matrixTierCellSelected
                        : kind === 'review'
                          ? s.matrixReviewCellSelected
                          : s.matrixNameCellSelected;

                    return {
                      onClick: () => handleCellSelect(rowCell.nodeId, rowCell.tier),
                      className: clsx(cellClass, isSelectedGroupCell && cellSelectedClass),
                      title: kind === 'review' ? STATUS_DETAIL_LABEL[rowCell.status] : rowCell.name,
                    };
                  }}
                  renderFooter={() =>
                    matrixRowsForTable.length === 0 ? null : (
                      <tr className={s.matrixFooterRow}>
                        {matrixTierAggregates.flatMap((agg) => [
                          <td key={`ft-${agg.tier}`} className={s.matrixFooterTier}>
                            합
                          </td>,
                          ...(hideReviewColumn
                            ? []
                            : [
                                <td
                                  key={`fr-${agg.tier}`}
                                  className={s.matrixFooterReview}
                                  title={`완료 ${agg.complete}, 검토필요 ${agg.warning}, 불가 ${agg.error}`}
                                >
                                  {`완${agg.complete}·검${agg.warning}·불${agg.error}`}
                                </td>,
                              ]),
                          <td
                            key={`fn-${agg.tier}`}
                            className={s.matrixFooterName}
                            title={`${agg.tier}차 업체 수`}
                          >
                            {agg.total}건
                          </td>,
                        ])}
                      </tr>
                    )
                  }
                />
              ) : filteredRoot?.children?.length ? (
                <div className={s.treeViewport}>{renderTreeNodes(filteredRoot.children)}</div>
              ) : (
                <div className={s.treeEmpty}>표시할 조직이 없습니다.</div>
              )}
            </div>
          </aside>

          <section className={s.rightPanel}>
            {selected ? (
              <div className={s.detailSplit}>
                <div className={s.leftInfo}>
                  <div className={s.detailHeader}>
                    <div className={s.detailHeaderIcon}>
                      {selectedDepth > 0 ? (
                        <span className={s.tierLogoBadgeLarge}>{selectedDepth}차</span>
                      ) : (
                        <GitBranch size={26} strokeWidth={1.75} aria-hidden />
                      )}
                    </div>

                    <div className={s.detailHeaderText}>
                      <h3 className={s.detailTitle}>{selected.name}</h3>
                      <span className={s.statusBadge[selected.status]}>
                        {STATUS_DETAIL_LABEL[selected.status]}
                      </span>
                    </div>
                  </div>

                  <div className={s.detailTable}>
                    <div className={s.detailRow}>
                      <span className={s.detailKey}>계약일</span>
                      <span className={s.detailVal}>
                        {selectedDetail?.startDate ?? selected.contractDate ?? '—'}
                      </span>
                    </div>

                    <div className={s.detailRow}>
                      <span className={s.detailKey}>만료일</span>
                      <span className={s.detailVal}>
                        {selectedDetail?.expireDate ?? selected.expiryDate ?? '—'}
                      </span>
                    </div>

                    {selectedDetail && (
                      <>
                        <div className={s.detailRow}>
                          <span className={s.detailKey}>계약서 상태</span>
                          <span className={s.detailVal}>
                            {CONTRACT_STATUS_LABEL[selectedDetail.contractStatus]}
                          </span>
                        </div>

                        <div className={s.detailRow}>
                          <span className={s.detailKey}>재위탁</span>
                          <span className={s.detailVal}>
                            {selected.children?.length ? '예' : '아니오'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className={s.rightDocs}>
                  {selectedDetailDocs && (
                    <div className={s.docSection}>
                      <h4 className={s.subSectionTitle}>제출 서류</h4>

                      <div className={s.docMenuRow} role="tablist" aria-label="제출 서류 메뉴">
                        {REQUEST_DOCUMENT_ITEMS.map(({ key, label }) => {
                          const submitted = selectedDetailDocs[key];
                          const isActive = activeDocKey === key;

                          return (
                            <button
                              key={key}
                              type="button"
                              className={clsx(
                                s.docMenuItem,
                                isActive && s.docMenuItemActive,
                                !submitted && s.docMenuItemDisabled,
                              )}
                              role="tab"
                              aria-selected={isActive}
                              aria-disabled={!submitted}
                              disabled={!submitted}
                              onClick={() => setActiveDocKey(key)}
                            >
                              <span className={s.docMenuLabel}>{label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {selectedDetailDocs && (
                    <div className={s.docPreviewPanel} aria-live="polite">
                      <div className={s.docPreviewTitle}>
                        {activeDocPreview ? activeDocPreview.title : '상단에서 서류를 선택하세요.'}
                      </div>

                      {activeDocPreview ? (
                        <div className={s.docPreviewImageWrap}>
                          <img
                            className={s.docPreviewImage}
                            src={activeDocPreview.src}
                            alt={activeDocPreview.title}
                            onClick={() => setIsPreviewModalOpen(true)}
                          />
                        </div>
                      ) : (
                        <div className={s.docPreviewEmpty}>선택된 서류가 없습니다.</div>
                      )}
                    </div>
                  )}

                  {selected.children && selected.children.length > 0 && (
                    <div className={s.subSection}>
                      <h4 className={s.subSectionTitle}>재위탁 (직계)</h4>
                      <div className={s.subTableViewport}>
                        <table className={s.subTable}>
                          <thead>
                            <tr>
                              <th scope="col" className={s.subTableTh}>
                                업체명
                              </th>
                              <th scope="col" className={clsx(s.subTableTh, s.subTableThStatus)}>
                                상태
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {selected.children.map((ch) => {
                              const childTier = selectedDepth + 1;
                              const isRowSelected = ch.id === selectedId;
                              return (
                                <tr
                                  key={ch.id}
                                  className={clsx(
                                    s.subTableRow,
                                    isRowSelected && s.subTableRowSelected,
                                  )}
                                  role="button"
                                  tabIndex={0}
                                  aria-selected={isRowSelected}
                                  aria-label={`${ch.name}, ${STATUS_DETAIL_LABEL[ch.status]}`}
                                  onClick={() => handleCellSelect(ch.id, childTier)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.preventDefault();
                                      handleCellSelect(ch.id, childTier);
                                    }
                                  }}
                                >
                                  <td className={clsx(s.subTableTd, s.subTableTdName)}>
                                    {ch.name}
                                  </td>
                                  <td className={clsx(s.subTableTd, s.subTableTdStatus)}>
                                    <span
                                      className={clsx(s.statusDot[ch.status], s.subTableStatusDot)}
                                      aria-hidden
                                    />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={s.detailTable}>
                <p className={s.detailVal}>목록에서 항목을 선택하세요.</p>
              </div>
            )}
          </section>
        </div>
      </div>

      {isPreviewModalOpen && activeDocPreview && (
        <div
          className={s.previewModalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label={activeDocLabel ? `${activeDocLabel} 미리보기` : '서류 미리보기'}
          onClick={(e) => {
            if (e.target === e.currentTarget) closePreviewModal();
          }}
        >
          <div className={s.previewModalBox}>
            <div className={s.previewModalHeader}>
              <div className={s.previewModalTitleBlock}>
                <div className={s.previewModalDocKind}>{activeDocLabel}</div>
                <div className={s.previewModalTitleSub}>
                  <span>서류 상세보기</span>
                  {submittedDocKeys.length > 1 && docNavIndex >= 0 && (
                    <span className={s.previewModalDocIndex}>
                      {' '}
                      · {docNavIndex + 1} / {submittedDocKeys.length}
                    </span>
                  )}
                </div>
              </div>

              <div className={s.previewModalActions}>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="줌 아웃"
                  title="줌 아웃"
                  onClick={() =>
                    setPreviewScale((scale) => Math.max(0.5, Number((scale - 0.25).toFixed(2))))
                  }
                >
                  <ZoomOut size={18} aria-hidden />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="줌 인"
                  title="줌 인"
                  onClick={() =>
                    setPreviewScale((scale) => Math.min(3, Number((scale + 0.25).toFixed(2))))
                  }
                >
                  <ZoomIn size={18} aria-hidden />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="줌·위치 초기화"
                  title="줌·위치 초기화"
                  onClick={() => {
                    setPreviewScale(1);
                    setPreviewPan({ x: 0, y: 0 });
                  }}
                >
                  <RotateCcw size={18} aria-hidden />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="닫기"
                  title="닫기"
                  onClick={closePreviewModal}
                >
                  <X size={18} aria-hidden />
                </Button>
              </div>
            </div>

            <div
              className={s.previewModalBody}
              onWheel={(e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.12 : 0.12;
                setPreviewScale((scale) => {
                  const next = Math.min(3, Math.max(0.5, scale + delta));
                  return Number(next.toFixed(2));
                });
              }}
            >
              <div className={s.previewModalBodyInner}>
                <img
                  className={clsx(
                    s.previewModalImage,
                    isPreviewDragging && s.previewModalImageDragging,
                    !finePointer && s.previewModalImageNoPan,
                  )}
                  src={activeDocPreview.src}
                  alt={activeDocLabel ? `${activeDocLabel} 샘플 이미지` : activeDocPreview.title}
                  style={{
                    transform: `translate(${previewPan.x}px, ${previewPan.y}px) scale(${previewScale})`,
                  }}
                  draggable={false}
                  onPointerDown={(e) => {
                    if (!finePointer || e.button !== 0) return;
                    e.preventDefault();
                    previewDragRef.current = {
                      startX: e.clientX,
                      startY: e.clientY,
                      originX: previewPan.x,
                      originY: previewPan.y,
                    };
                    setIsPreviewDragging(true);
                  }}
                />

                {submittedDocKeys.length > 1 && (
                  <>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={clsx(s.previewModalNavBtn, s.previewModalNavPrev)}
                      aria-label={
                        canPrevDoc && docNavIndex > 0
                          ? `이전: ${REQUEST_DOCUMENT_ITEMS.find((d) => d.key === submittedDocKeys[docNavIndex - 1])?.label ?? '서류'}`
                          : '이전 서류'
                      }
                      title="이전 서류"
                      disabled={!canPrevDoc}
                      onClick={(e) => {
                        e.stopPropagation();
                        goPrevDoc();
                      }}
                    >
                      <ChevronLeft size={36} strokeWidth={2.25} aria-hidden />
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className={clsx(s.previewModalNavBtn, s.previewModalNavNext)}
                      aria-label={
                        canNextDoc && docNavIndex >= 0
                          ? `다음: ${REQUEST_DOCUMENT_ITEMS.find((d) => d.key === submittedDocKeys[docNavIndex + 1])?.label ?? '서류'}`
                          : '다음 서류'
                      }
                      title="다음 서류"
                      disabled={!canNextDoc}
                      onClick={(e) => {
                        e.stopPropagation();
                        goNextDoc();
                      }}
                    >
                      <ChevronRight size={36} strokeWidth={2.25} aria-hidden />
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
