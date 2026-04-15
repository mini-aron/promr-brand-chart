import { clsx } from 'clsx';
import { ChannelIcon } from '../ChannelIcon';
import { formatRelativeTime } from '../../lib/utils';
import { CONTRACT_STATUS_LABEL, SEND_TYPE_CHANNEL } from '../../lib/constants';
import type { ContractStatus } from '@/types/services/contractService';
import type { ContractRequestResponse } from '@/types/services/contractService';
import * as b from '../../contractReviewBadges.css';
import * as s from './ContractReviewListSection.css';

type Props = {
  items: ContractRequestResponse[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

function contractBadgeClass(status: ContractStatus): string {
  if (status === 'SUBMITTED') return b.statusBadge.needReview;
  if (status === 'REJECTED') return clsx(b.reentrustStatusBadge.error, b.listRowReentrustStatusBadge);
  return b.statusBadge.done;
}

export function ReceivedContractList({ items, selectedId, onSelect }: Props) {
  return (
    <>
      <div
        className={s.listStatusLegend}
        role="note"
        aria-label="목록 우측 상태: 초록 완료, 주황 검토필요, 빨강 불가"
      >
        <div className={s.listStatusLegendRow}>
          <span className={s.listStatusLegendTitle}>목록 상태</span>
          <div className={s.listStatusLegendItems}>
            <span className={s.listStatusLegendItem}>
              <span className={clsx(s.listStatusLegendDot, s.listStatusLegendDotComplete)} aria-hidden />
              완료
            </span>
            <span className={s.listStatusLegendItem}>
              <span className={clsx(s.listStatusLegendDot, s.listStatusLegendDotNeedReview)} aria-hidden />
              검토필요
            </span>
            <span className={s.listStatusLegendItem}>
              <span className={clsx(s.listStatusLegendDot, s.listStatusLegendDotDenied)} aria-hidden />
              불가
            </span>
          </div>
        </div>
      </div>

      <div className={s.listWrap}>
        {items.length === 0 ? (
          <p className={s.emptyList}>조건에 맞는 계약서가 없습니다.</p>
        ) : (
          items.map((item) => (
            <button
              key={item.contractRequestId}
              type="button"
              className={clsx(s.listItem, selectedId === item.contractRequestId && s.listItemSelected)}
              onClick={() => onSelect(item.contractRequestId)}
            >
              <ChannelIcon channel={SEND_TYPE_CHANNEL[item.sendType]} />
              <div className={s.listItemBody}>
                <div className={s.listItemTitle}>
                  {item.alias || `계약 요청 #${item.contractRequestId}`}
                </div>
                <div className={s.listItemSub}>
                  {item.email ?? item.phoneNumber ?? SEND_TYPE_CHANNEL[item.sendType]}
                </div>
              </div>
              <div className={s.listItemRight}>
                <span className={s.listItemTime}>{formatRelativeTime(item.createdAt)}</span>
                <span className={contractBadgeClass(item.contractStatus)}>
                  {CONTRACT_STATUS_LABEL[item.contractStatus]}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </>
  );
}
