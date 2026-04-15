import { clsx } from 'clsx';
import { formatRelativeTime } from '../../lib/utils';
import { CONTRACT_STATUS_LABEL } from '../../lib/constants';
import type { ContractStatus, GetReEntrusContractListResponse } from '@/types/services/contractService';
import * as b from '../../contractReviewBadges.css';
import * as s from './ContractReviewListSection.css';

type ReEntrustListItem = GetReEntrusContractListResponse['list'][number];

type Props = {
  items: ReEntrustListItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
};

function reentrustBadgeClass(status: ContractStatus): string {
  if (status === 'SUBMITTED') return clsx(b.reentrustStatusBadge.warning, b.listRowReentrustStatusBadge);
  if (status === 'REJECTED') return clsx(b.reentrustStatusBadge.error, b.listRowReentrustStatusBadge);
  if (status === 'APPROVED') return clsx(b.reentrustStatusBadge.complete, b.listRowReentrustStatusBadge);
  return b.statusBadge.done;
}

export function ReentrustContractList({ items, selectedId, onSelect }: Props) {
  return (
    <>
      <div
        className={s.listStatusLegend}
        role="note"
        aria-label="재위탁 목록 상태: 초록 완료, 주황 경고, 빨강 오류"
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
              경고
            </span>
            <span className={s.listStatusLegendItem}>
              <span className={clsx(s.listStatusLegendDot, s.listStatusLegendDotDenied)} aria-hidden />
              오류
            </span>
          </div>
        </div>
      </div>

      <div className={s.listWrap}>
        {items.length === 0 ? (
          <p className={s.emptyList}>검토할 재위탁 계약서가 없습니다.</p>
        ) : (
          items.map((item) => (
            <button
              key={item.reEntrustContractId}
              type="button"
              className={clsx(s.listItem, selectedId === item.reEntrustContractId && s.listItemSelected)}
              onClick={() => onSelect(item.reEntrustContractId)}
            >
              <div className={s.listItemBody}>
                <div className={s.listItemTitle}>{item.contracteeName}</div>
                <div className={s.listItemSub}>{item.contractorName} → {item.contracteeName}</div>
                <div className={s.listItemMeta}>
                  시작일: {item.startDate}, 종료일: {item.expireDate}
                </div>
              </div>
              <div className={s.listItemRight}>
                <span className={s.listItemTime}>{formatRelativeTime(item.createdAt)}</span>
                <span className={reentrustBadgeClass(item.contractStatus)}>
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
