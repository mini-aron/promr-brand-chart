import { clsx } from 'clsx';
import CardWrapper from '@/shared/components/layout/CardWrapper/CardWrapper';
import { Column } from '@/shared/components/ui/Flex';
import { SingleSelect } from '@/shared/components/ui/Select';
import type {
  ContractRequestResponse,
  GetReEntrusContractListResponse,
} from '@/types/services/contractService';
import type { ContractReviewChannelFilter, ContractReviewStatusFilter } from '../../types';
import { CHANNEL_TAB_ITEMS, REVIEW_STATUS_FILTER_OPTIONS } from '../../lib/constants';
import { ReceivedContractList } from './ReceivedContractList';
import { ReentrustContractList } from './ReentrustContractList';
import * as s from './ContractReviewListSection.css';

type ListType = '수신목록' | '재위탁목록';
type ReEntrustListItem = GetReEntrusContractListResponse['list'][number];

type Props = {
  listType: ListType;
  channelFilter: ContractReviewChannelFilter;
  reviewStatusFilter: ContractReviewStatusFilter;
  contractItems: ContractRequestResponse[];
  reEntrustItems: ReEntrustListItem[];
  selectedId: number | null;
  onListTypeChange: (t: ListType) => void;
  onChannelChange: (tab: ContractReviewChannelFilter) => void;
  onReviewStatusFilterChange: (next: ContractReviewStatusFilter) => void;
  onSelect: (id: number) => void;
};

const LIST_TYPE_TABS: { type: ListType; label: string }[] = [
  { type: '수신목록', label: '계약서 목록' },
  { type: '재위탁목록', label: '재위탁목록' },
];

const CARD_TITLE: Record<ListType, string> = {
  수신목록: '계약서 목록',
  재위탁목록: '재위탁목록',
};

export function ContractReviewListSection({
  listType,
  channelFilter,
  reviewStatusFilter,
  contractItems,
  reEntrustItems,
  selectedId,
  onListTypeChange,
  onChannelChange,
  onReviewStatusFilterChange,
  onSelect,
}: Props) {
  const isReentrustView = listType === '재위탁목록';

  return (
    <div className={s.leftColumn}>
      <CardWrapper title={CARD_TITLE[listType]} fill padding={8}>
        <Column flex={1} gap={8} style={{ minHeight: 0 }}>
          {/* 목록 탭 */}
          <div className={s.listTypeTabsRow}>
            <div className={s.listTypeTabs} role="tablist" aria-label="계약 검토 목록">
              {LIST_TYPE_TABS.map(({ type, label }) => (
                <button
                  key={type}
                  type="button"
                  role="tab"
                  aria-selected={listType === type}
                  className={clsx(s.listTypeTab, listType === type && s.listTypeTabActive)}
                  onClick={() => onListTypeChange(type)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 채널 필터 + 상태 필터 (계약서 목록 탭에서만 노출) */}
          {!isReentrustView && (
            <div className={s.listFiltersRow}>
              <div className={s.listFiltersChannelGroup}>
                <span className={s.listFiltersFieldLabel} id="contract-review-channel-filter-label">
                  수신 채널
                </span>
                <div
                  className={s.listFiltersGroup}
                  role="tablist"
                  aria-labelledby="contract-review-channel-filter-label"
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
                          s.channelTab,
                          isActive ? s.channelTabActive[key] : s.channelTabInactive,
                        )}
                        onClick={() => onChannelChange(filter)}
                      >
                        <Icon
                          className={clsx(s.channelTabIcon, isActive && s.channelTabIconActive)}
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

              <div className={s.listFiltersStatusGroup}>
                <label className={s.listFiltersFieldLabel} htmlFor="contract-review-status-filter">
                  계약서 상태
                </label>
                <div className={s.reviewStatusSelectWrap}>
                  <SingleSelect
                    id="contract-review-status-filter"
                    aria-label="계약서 상태 필터"
                    options={REVIEW_STATUS_FILTER_OPTIONS}
                    selected={reviewStatusFilter}
                    onChange={(v) => onReviewStatusFilterChange(v as ContractReviewStatusFilter)}
                    size="small"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 탭별 목록 */}
          {isReentrustView ? (
            <ReentrustContractList
              items={reEntrustItems}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          ) : (
            <ReceivedContractList
              items={contractItems}
              selectedId={selectedId}
              onSelect={onSelect}
            />
          )}
        </Column>
      </CardWrapper>
    </div>
  );
}
