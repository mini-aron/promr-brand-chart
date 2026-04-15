'use client';

import { clsx } from 'clsx';
import CardWrapper from '@/shared/components/layout/CardWrapper/CardWrapper';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import * as s from './CorpListSidebar.css';

export type CorpListSidebarItem = {
  id: string;
  name: string;
  isPromr?: boolean;
};

export type CorpListSidebarProps = {
  corporations: CorpListSidebarItem[];
  selectedCorpId: string | null;
  corpSearch: string;
  onSelectCorp: (id: string) => void;
  onCorpSearchChange: (value: string) => void;
  title?: string;
  searchPlaceholder?: string;
  /** 재위탁 건수 등 — 0보다 클 때만 배지 표시 */
  countByCorpId?: Map<string, number>;
  /** 재위탁 여부 배지 표시용(맵이 있으면 O/X를 함께 표시) */
  reentrustFlagByCorpId?: Map<string, boolean>;
  /** 검색란 위 라벨(예: 법인 검색). 없으면 라벨 없이 `aria-label`만 사용 */
  searchLabel?: string;
  searchInputId?: string;
  /** 레이아웃 폭 등 — `corpListSidebarLayout`에 병합 */
  className?: string;
};

export function CorpListSidebar({
  corporations,
  selectedCorpId,
  corpSearch,
  onSelectCorp,
  onCorpSearchChange,
  title = '법인 리스트',
  searchPlaceholder = '법인명 검색',
  countByCorpId,
  reentrustFlagByCorpId,
  searchLabel,
  searchInputId = 'corp-list-search',
  className,
}: CorpListSidebarProps) {
  return (
    <CardWrapper title={title} className={clsx(s.corpListSidebarLayout, className)} padding={0}>
      <div className={s.corpListSidebar}>
        <div className={s.sidebarSearchWrap}>
          {searchLabel != null && searchLabel !== '' && (
            <label htmlFor={searchInputId}>{searchLabel}</label>
          )}
          <Input
            id={searchInputId}
            size="large"
            type="search"
            placeholder={searchPlaceholder}
            value={corpSearch}
            onChange={(e) => onCorpSearchChange(e.target.value)}
            aria-label={searchLabel ? undefined : '법인 검색'}
          />
        </div>
        <div className={s.corpList}>
          {corporations.map((c) => {
            const count = countByCorpId?.get(c.id) ?? 0;
            const reentrustFlag = reentrustFlagByCorpId?.get(c.id);
            return (
              <Button
                key={c.id}
                variant="menu"
                size="menu"
                active={selectedCorpId === c.id}
                onClick={() => onSelectCorp(c.id)}
              >
                {c.name}
                {c.isPromr && <span className={s.promrBadge}>프로엠알</span>}
                {reentrustFlag && <span className={s.reentrustBadgeYes}>재</span>}
                {count > 0 && <span className={s.dealerCountBadge}>{count}</span>}
              </Button>
            );
          })}
        </div>
      </div>
    </CardWrapper>
  );
}
