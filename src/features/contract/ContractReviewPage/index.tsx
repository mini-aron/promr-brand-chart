'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import CardWrapper from '@/shared/components/layout/CardWrapper/CardWrapper';
import { queryKeys } from '@/api/queryKey';
import {
  getContractRequest,
  getContractRequestDetail,
  getReEntrusContractList,
  getReEntrusContractDetail,
  approveContractRequest,
  rejectContractRequest,
} from '@/api/services/contractService';
import type { ContractReviewChannelFilter, ContractReviewStatusFilter } from './types';
import { SEND_TYPE_CHANNEL, CONTRACT_STATUS_LABEL } from './lib/constants';
import { isReceivedToday, buildImageUrl } from './lib/utils';
import {
  mainLayout,
  page,
  reviewRightCard,
  reviewRightInner,
  rightColumn,
} from './contractReviewLayout.css';
import { ContractReviewDashboard } from './widgets/dashboard/ContractReviewDashboard';
import { ContractReviewListSection } from './widgets/list/ContractReviewListSection';
import { ContractReviewRightPanel } from './widgets/panels/ContractReviewRightPanel';
import {
  DocumentPreviewModal,
  type PreviewSidebarItem,
} from './widgets/modals/DocumentPreviewModal';
import { ContractRequestModal } from '@/shared/components/ui/ContractRequestModal';
import * as b from './contractReviewBadges.css';
import { clsx } from 'clsx';

type ListType = '수신목록' | '재위탁목록';

type ListUiState = {
  listType: ListType;
  channelFilter: ContractReviewChannelFilter;
  reviewStatusFilter: ContractReviewStatusFilter;
  selectedId: number | null;
};

type PreviewModalState = {
  isOpen: boolean;
  previewUrl: string;
  corporationName: string;
  documentName: string;
};

function contractBadgeClass(status: string): string {
  if (status === 'SUBMITTED') return b.statusBadge.needReview;
  if (status === 'REJECTED')
    return clsx(b.reentrustStatusBadge.error, b.listRowReentrustStatusBadge);
  return b.statusBadge.done;
}

function reentrustBadgeClass(status: string): string {
  if (status === 'SUBMITTED')
    return clsx(b.reentrustStatusBadge.warning, b.listRowReentrustStatusBadge);
  if (status === 'REJECTED')
    return clsx(b.reentrustStatusBadge.error, b.listRowReentrustStatusBadge);
  return clsx(b.reentrustStatusBadge.complete, b.listRowReentrustStatusBadge);
}

export function ContractReviewPage() {
  const queryClient = useQueryClient();

  const [listUiState, setListUiState] = useState<ListUiState>({
    listType: '수신목록',
    channelFilter: '전체',
    reviewStatusFilter: '전체',
    selectedId: null,
  });

  const [previewModal, setPreviewModal] = useState<PreviewModalState>({
    isOpen: false,
    previewUrl: '',
    corporationName: '',
    documentName: '',
  });

  const [isContractRequestModalOpen, setIsContractRequestModalOpen] = useState(false);

  const { listType, channelFilter, reviewStatusFilter, selectedId } = listUiState;
  const isReentrustView = listType === '재위탁목록';

  // ─── 리스트 쿼리 ──────────────────────────────────────────────
  const { data: contractListData, isFetching: isContractListFetching } = useQuery({
    queryKey: queryKeys.contract.requestList(),
    queryFn: () => getContractRequest().then((r) => r.data.list),
  });

  const { data: reEntrustListData, isFetching: isReEntrustListFetching } = useQuery({
    queryKey: queryKeys.contract.reEntrustList(),
    queryFn: () => getReEntrusContractList().then((r) => r.data.list),
  });

  // ─── 필터 적용 ────────────────────────────────────────────────
  const filteredContractItems = useMemo(() => {
    const items = (contractListData ?? []).filter((item) => item.contractStatus !== 'REQUESTED');
    const byChannel =
      channelFilter === '전체'
        ? items
        : items.filter((item) => SEND_TYPE_CHANNEL[item.sendType] === channelFilter);

    if (reviewStatusFilter === '전체') return byChannel;
    const statusMap: Record<Exclude<ContractReviewStatusFilter, '전체'>, string[]> = {
      검토필요: ['SUBMITTED'],
      불가: ['REJECTED'],
    };
    return byChannel.filter((item) =>
      statusMap[reviewStatusFilter as Exclude<ContractReviewStatusFilter, '전체'>].includes(
        item.contractStatus,
      ),
    );
  }, [contractListData, channelFilter, reviewStatusFilter]);

  const filteredReEntrustItems = useMemo(() => reEntrustListData ?? [], [reEntrustListData]);

  // ─── 사이드바 아이템 ──────────────────────────────────────────
  const contractSidebarItems = useMemo<PreviewSidebarItem[]>(
    () =>
      filteredContractItems.map((item) => ({
        id: item.contractRequestId,
        title: item.alias || `계약 요청 #${item.contractRequestId}`,
        receivedAt: item.createdAt,
        badgeLabel: CONTRACT_STATUS_LABEL[item.contractStatus],
        badgeClass: contractBadgeClass(item.contractStatus),
      })),
    [filteredContractItems],
  );

  const reEntrustSidebarItems = useMemo<PreviewSidebarItem[]>(
    () =>
      filteredReEntrustItems.map((item) => ({
        id: item.reEntrustContractId,
        title: item.contracteeName,
        receivedAt: item.createdAt,
        badgeLabel: CONTRACT_STATUS_LABEL[item.contractStatus],
        badgeClass: reentrustBadgeClass(item.contractStatus),
      })),
    [filteredReEntrustItems],
  );

  // ─── 대시보드 통계 ────────────────────────────────────────────
  const dashboard = useMemo(() => {
    const items = contractListData ?? [];
    const needReview = items.filter((i) => i.contractStatus === 'SUBMITTED').length;
    const todayReceived = items.filter((i) => isReceivedToday(i.createdAt)).length;
    const newCount = items.filter(
      (i) => i.contractStatus === 'SUBMITTED' && isReceivedToday(i.createdAt),
    ).length;
    return { needReview, todayReceived, newCount };
  }, [contractListData]);

  // ─── 첫 항목 자동 선택 (리스트 페칭 완료 후에만 실행) ────────
  useEffect(() => {
    if (selectedId !== null || isReentrustView || isContractListFetching) return;
    const first = filteredContractItems[0];
    if (first) setListUiState((prev) => ({ ...prev, selectedId: first.contractRequestId }));
  }, [filteredContractItems, selectedId, isReentrustView, isContractListFetching]);

  useEffect(() => {
    if (selectedId !== null || !isReentrustView || isReEntrustListFetching) return;
    const first = filteredReEntrustItems[0];
    if (first) setListUiState((prev) => ({ ...prev, selectedId: first.reEntrustContractId }));
  }, [filteredReEntrustItems, selectedId, isReentrustView, isReEntrustListFetching]);

  // ─── 상세 쿼리 ────────────────────────────────────────────────
  const { data: contractDetail } = useQuery({
    queryKey: queryKeys.contract.requestDetail(selectedId!),
    queryFn: () => getContractRequestDetail(selectedId!).then((r) => r.data),
    enabled: !isReentrustView && selectedId !== null,
  });

  const { data: reEntrustDetail } = useQuery({
    queryKey: queryKeys.contract.reEntrustDetail(selectedId!),
    queryFn: () => getReEntrusContractDetail(selectedId!).then((r) => r.data),
    enabled: isReentrustView && selectedId !== null,
  });

  // ─── 미리보기 URL ─────────────────────────────────────────────
  const previewUrl = useMemo(() => {
    if (!isReentrustView && contractDetail) {
      return buildImageUrl(contractDetail.contract.contractFileName);
    }
    if (isReentrustView && reEntrustDetail) {
      return buildImageUrl(reEntrustDetail.reEntrustContractFileName);
    }
    return null;
  }, [isReentrustView, contractDetail, reEntrustDetail]);

  // ─── 승인 / 반려 뮤테이션 ────────────────────────────────────
  const approveMutation = useMutation({
    mutationFn: (id: number) => approveContractRequest(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.contract.requestList() });
      if (selectedId !== null) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.contract.requestDetail(selectedId),
        });
      }
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => rejectContractRequest(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.contract.requestList() });
      if (selectedId !== null) {
        void queryClient.invalidateQueries({
          queryKey: queryKeys.contract.requestDetail(selectedId),
        });
      }
    },
  });

  // ─── 이벤트 핸들러 ───────────────────────────────────────────
  const handleListTypeChange = useCallback(
    (nextListType: ListType) => {
      setListUiState({
        listType: nextListType,
        channelFilter: '전체',
        reviewStatusFilter: '전체',
        selectedId: null,
      });
      // 탭 전환 시 해당 리스트를 재요청 → 리스트 API가 디테일 API보다 먼저 호출되도록 보장
      if (nextListType === '수신목록') {
        void queryClient.invalidateQueries({ queryKey: queryKeys.contract.requestList() });
      } else {
        void queryClient.invalidateQueries({ queryKey: queryKeys.contract.reEntrustList() });
      }
    },
    [queryClient],
  );

  const handleChannelChange = useCallback((tab: ContractReviewChannelFilter) => {
    setListUiState((prev) => ({
      ...prev,
      channelFilter: tab,
      reviewStatusFilter: '전체',
      selectedId: null,
    }));
  }, []);

  const handleReviewStatusFilterChange = useCallback((next: ContractReviewStatusFilter) => {
    setListUiState((prev) => ({ ...prev, reviewStatusFilter: next, selectedId: null }));
  }, []);

  const handleSelect = useCallback((id: number) => {
    setListUiState((prev) => ({ ...prev, selectedId: id }));
  }, []);

  const handleApprove = useCallback(() => {
    if (selectedId === null) return;
    approveMutation.mutate(selectedId);
    setPreviewModal((prev) => ({ ...prev, isOpen: false }));
  }, [approveMutation, selectedId]);

  const handleReject = useCallback(() => {
    if (selectedId === null) return;
    rejectMutation.mutate(selectedId);
    setPreviewModal((prev) => ({ ...prev, isOpen: false }));
  }, [rejectMutation, selectedId]);

  const handleOpenPreview = useCallback(() => {
    if (!previewUrl) return;
    const corporationName = !isReentrustView
      ? (contractDetail?.corporation.businessName ?? '')
      : (reEntrustDetail?.corporationName ?? '');
    const documentName = !isReentrustView
      ? (contractDetail?.contract.contractFileName ?? '')
      : (reEntrustDetail?.reEntrustContractFileName ?? '');
    setPreviewModal({ isOpen: true, previewUrl, corporationName, documentName });
  }, [previewUrl, isReentrustView, contractDetail, reEntrustDetail]);

  useEffect(() => {
    if (!previewModal.isOpen || !previewUrl) return;

    const corporationName = !isReentrustView
      ? (contractDetail?.corporation.businessName ?? '')
      : (reEntrustDetail?.corporationName ?? '');
    const documentName = !isReentrustView
      ? (contractDetail?.contract.contractFileName ?? '')
      : (reEntrustDetail?.reEntrustContractFileName ?? '');

    setPreviewModal((prev) => {
      if (
        prev.previewUrl === previewUrl &&
        prev.corporationName === corporationName &&
        prev.documentName === documentName
      ) {
        return prev;
      }
      return { ...prev, previewUrl, corporationName, documentName };
    });
  }, [previewModal.isOpen, previewUrl, isReentrustView, contractDetail, reEntrustDetail]);

  const handleClosePreview = useCallback(() => {
    setPreviewModal((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleSidebarSelect = useCallback((id: number) => {
    setListUiState((prev) => ({ ...prev, selectedId: id }));
  }, []);

  const invalidateContractRequestList = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.contract.requestList() });
  }, [queryClient]);

  return (
    <div className={page}>
      <PageHeader
        title="계약서 검토"
        description="법인에서 제출된 계약서를 채널별로 확인하고 검토합니다."
      />

      <ContractReviewDashboard
        needReview={dashboard.needReview}
        todayReceived={dashboard.todayReceived}
        newCount={dashboard.newCount}
      />

      <div className={mainLayout}>
        <ContractReviewListSection
          listType={listType}
          channelFilter={channelFilter}
          reviewStatusFilter={reviewStatusFilter}
          contractItems={filteredContractItems}
          reEntrustItems={filteredReEntrustItems}
          selectedId={selectedId}
          onListTypeChange={handleListTypeChange}
          onChannelChange={handleChannelChange}
          onReviewStatusFilterChange={handleReviewStatusFilterChange}
          onSelect={handleSelect}
          onOpenContractRequest={() => setIsContractRequestModalOpen(true)}
        />

        <div className={rightColumn}>
          <CardWrapper fill padding={8} className={reviewRightCard}>
            <div className={reviewRightInner}>
              <ContractReviewRightPanel
                isReentrustView={isReentrustView}
                contractDetail={contractDetail}
                reEntrustDetail={reEntrustDetail}
                previewUrl={previewUrl}
                onOpenPreview={handleOpenPreview}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            </div>
          </CardWrapper>
        </div>
      </div>

      {isContractRequestModalOpen && (
        <ContractRequestModal
          onClose={() => setIsContractRequestModalOpen(false)}
          onSuccess={invalidateContractRequestList}
          onExcelSuccess={invalidateContractRequestList}
        />
      )}

      {previewModal.isOpen && (
        <DocumentPreviewModal
          previewUrl={previewModal.previewUrl}
          previewCorporationName={previewModal.corporationName}
          previewDocumentName={previewModal.documentName}
          contractStartDate={!isReentrustView ? contractDetail?.contract.startDate : undefined}
          contractEndDate={!isReentrustView ? contractDetail?.contract.endDate : undefined}
          sidebarItems={isReentrustView ? reEntrustSidebarItems : contractSidebarItems}
          selectedSidebarId={selectedId}
          onSelectSidebar={handleSidebarSelect}
          onClose={handleClosePreview}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
