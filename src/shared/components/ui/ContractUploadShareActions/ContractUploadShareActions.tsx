'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link2, Trash2, X } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/shared/components/ui/Button';
import type { ContractRequestResponse } from '@/types/services/contractService';
import { ContractRequestModal } from '@/shared/components/ui/ContractRequestModal';
import { CHANNEL_TAB_ITEMS } from '@/features/contract/ContractReviewPage/lib/constants';
import {
  formatRelativeTime,
  formatRequestUrlForDisplay,
} from '@/features/contract/ContractReviewPage/lib/utils';
import type {
  ContractReviewChannel,
  ContractReviewChannelFilter,
  ContractReviewRequestItem,
} from '@/features/contract/ContractReviewPage/types';
import { ChannelIcon } from '@/features/contract/ContractReviewPage/widgets/ChannelIcon';
import * as reviewS from '@/features/contract/ContractReviewPage/index.css';
import * as s from './ContractUploadShareActions.css';

const STATIC_SIGNUP_URL_PATH = '/signup';

export type ContractUploadShareActionsProps = {
  organizationId: string;
  triggerLabel?: string;
  triggerVariant?: 'primary' | 'secondary';
  triggerSize?: 'small' | 'default';
};

export function ContractUploadShareActions({
  organizationId: _organizationId,
  triggerLabel = '계약서 제출 요청',
  triggerVariant = 'secondary',
  triggerSize = 'small',
}: ContractUploadShareActionsProps) {
  const [panelOpen, setPanelOpen] = useState(false);
  const [requestItems, setRequestItems] = useState<ContractReviewRequestItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [channelFilter, setChannelFilter] = useState<ContractReviewChannelFilter>('전체');

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  const buildUploadUrl = useCallback(() => {
    if (typeof window === 'undefined') return STATIC_SIGNUP_URL_PATH;
    return `${window.location.origin}${STATIC_SIGNUP_URL_PATH}`;
  }, []);

  const filteredRequests = useMemo(() => {
    if (channelFilter === '전체') return requestItems;
    return requestItems.filter((i) => i.channel === channelFilter);
  }, [channelFilter, requestItems]);

  const selected = useMemo(() => {
    if (!selectedId) return null;
    return filteredRequests.find((i) => i.id === selectedId) ?? null;
  }, [filteredRequests, selectedId]);

  useEffect(() => {
    if (filteredRequests.length === 0) {
      setSelectedId(null);
      return;
    }
    if (selectedId && !filteredRequests.some((i) => i.id === selectedId)) {
      setSelectedId(filteredRequests[0]?.id ?? null);
    }
  }, [filteredRequests, selectedId]);

  const copyRequestUrl = useCallback(async (url: string) => {
    const text = formatRequestUrlForDisplay(url);
    try {
      await navigator.clipboard.writeText(text);
      alert('제출 링크가 복사되었습니다.');
    } catch {
      alert('복사에 실패했습니다.');
    }
  }, []);

  const handleDeleteRequest = useCallback((id: string) => {
    if (!window.confirm('이 요청을 목록에서 삭제할까요?')) return;
    setRequestItems((prev) => prev.filter((i) => i.id !== id));
    setSelectedId((sel) => (sel === id ? null : sel));
  }, []);

  const openContractRequestModal = useCallback(() => {
    setIsRequestModalOpen(true);
  }, []);

  const closeContractRequestModal = useCallback(() => {
    setIsRequestModalOpen(false);
  }, []);

  const handleContractRequestSuccess = useCallback(
    (res: ContractRequestResponse) => {
      const requestUrl = buildUploadUrl();
      const channel: ContractReviewChannel = res.sendType === 'EMAIL' ? '이메일' : '카카오톡';

      const newItem: ContractReviewRequestItem = {
        id: String(res.contractRequestId),
        alias: res.alias,
        listType: '요청목록',
        channel,
        requestUrl,
        expiryDate: '',
        status: '요청중',
        receivedAt: res.createdAt,
        isNew: true,
        ...(res.email || res.phoneNumber ? { deliveryTarget: res.email ?? res.phoneNumber } : {}),
      };

      setRequestItems((prev) => [newItem, ...prev]);
      setSelectedId(newItem.id);
    },
    [buildUploadUrl],
  );

  useEffect(() => {
    if (!panelOpen && !isRequestModalOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (isRequestModalOpen) closeContractRequestModal();
      else setPanelOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [closeContractRequestModal, isRequestModalOpen, panelOpen]);

  return (
    <div className={s.triggerWrap}>
      <Button
        type="button"
        variant={triggerVariant}
        size={triggerSize}
        onClick={() => setPanelOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={panelOpen}
      >
        {triggerLabel}
      </Button>

      {panelOpen && (
        <div
          className={s.managementOverlay}
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setPanelOpen(false);
          }}
        >
          <div
            className={s.managementBox}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contract-upload-share-panel-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={s.managementHeader}>
              <h2 id="contract-upload-share-panel-title" className={s.managementTitle}>
                계약서 링크 관리
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="닫기"
                onClick={() => setPanelOpen(false)}
              >
                <X size={18} aria-hidden />
              </Button>
            </div>

            <div className={s.managementScroll}>
              <div className={reviewS.listTypeTabsRow}>
                <div className={reviewS.listTypeTabs} role="tablist" aria-label="요청 목록">
                  <span
                    className={clsx(reviewS.listTypeTab, reviewS.listTypeTabActive)}
                    role="tab"
                    aria-selected
                  >
                    요청목록
                  </span>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="default"
                  className={reviewS.listTypeTabsAction}
                  onClick={openContractRequestModal}
                >
                  계약서 요청
                </Button>
              </div>

              <div className={reviewS.listFiltersRow}>
                <div className={reviewS.listFiltersChannelGroup}>
                  <span
                    className={reviewS.listFiltersFieldLabel}
                    id="contract-upload-share-channel-filter-label"
                  >
                    수신 채널
                  </span>
                  <div
                    className={reviewS.listFiltersGroup}
                    role="tablist"
                    aria-labelledby="contract-upload-share-channel-filter-label"
                  >
                    {CHANNEL_TAB_ITEMS.map(({ filter, key, icon: Icon }) => {
                      const isActive = channelFilter === filter;
                      return (
                        <button
                          key={filter}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          className={clsx(
                            reviewS.channelTab,
                            isActive ? reviewS.channelTabActive[key] : reviewS.channelTabInactive,
                          )}
                          onClick={() => setChannelFilter(filter)}
                        >
                          <Icon
                            className={clsx(
                              reviewS.channelTabIcon,
                              isActive && reviewS.channelTabIconActive,
                            )}
                            size={16}
                            strokeWidth={2.25}
                            aria-hidden
                          />
                          {filter}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div
                className={reviewS.listStatusLegend}
                role="note"
                aria-label="요청 목록 상태: 보라색 요청중"
              >
                <div className={reviewS.listStatusLegendRow}>
                  <span className={reviewS.listStatusLegendTitle}>목록 상태</span>
                  <div className={reviewS.listStatusLegendItems}>
                    <span className={reviewS.listStatusLegendItem}>
                      <span
                        className={clsx(
                          reviewS.listStatusLegendDot,
                          reviewS.listStatusLegendDotRequested,
                        )}
                        aria-hidden
                      />
                      요청중
                    </span>
                  </div>
                </div>
              </div>

              <div className={reviewS.listWrap}>
                {filteredRequests.length === 0 ? (
                  <p className={reviewS.emptyList}>해당 채널로 요청한 항목이 없습니다.</p>
                ) : (
                  filteredRequests.map((item) => {
                    const isSelected = selected?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        className={clsx(
                          reviewS.listItemRow,
                          isSelected && reviewS.listItemRowSelected,
                        )}
                      >
                        <div
                          tabIndex={0}
                          className={reviewS.listItemMain}
                          onClick={() => setSelectedId(item.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedId(item.id);
                            }
                          }}
                        >
                          <ChannelIcon channel={item.channel} />
                          <div className={reviewS.listItemBody}>
                            <div className={reviewS.requestItemHeaderRow}>
                              <div className={reviewS.listItemTitle}>
                                {item.alias ??
                                  (item.expiryDate ? `만료일 ${item.expiryDate}` : '계약 요청')}
                              </div>
                              <div className={reviewS.listItemRight}>
                                <span className={reviewS.listItemTime}>
                                  {formatRelativeTime(item.receivedAt)}
                                </span>
                                <span className={reviewS.statusBadge.requested}>{item.status}</span>
                              </div>
                            </div>
                            <div className={reviewS.requestLinkRow}>
                              <span
                                className={reviewS.requestLinkText}
                                title={formatRequestUrlForDisplay(item.requestUrl)}
                              >
                                {formatRequestUrlForDisplay(item.requestUrl)}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className={reviewS.requestLinkCopyBtn}
                                aria-label="제출 링크 복사"
                                title="링크 복사"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  void copyRequestUrl(item.requestUrl);
                                }}
                              >
                                <Link2 size={16} aria-hidden />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className={reviewS.listItemDeleteBtn}
                          aria-label="요청 삭제"
                          title="삭제"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteRequest(item.id);
                          }}
                        >
                          <Trash2 size={16} aria-hidden />
                        </Button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isRequestModalOpen && (
        <ContractRequestModal
          onClose={closeContractRequestModal}
          onSuccess={handleContractRequestSuccess}
        />
      )}
    </div>
  );
}
