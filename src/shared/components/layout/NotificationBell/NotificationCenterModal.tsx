'use client';

import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { clsx } from 'clsx';
import { RefreshCw, X } from 'lucide-react';
import { Button } from '@/shared/components/ui/Button';
import { Input } from '@/shared/components/ui/Input';
import type { AppNotification } from '@/types';
import * as s from './NotificationCenterModal.css';

function formatNotificationTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('ko-KR', {
      dateStyle: 'short',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

/** 상대 시각 (예: 2시간 전) */
function formatRelativeTime(iso: string): string {
  try {
    const d = new Date(iso);
    const now = Date.now();
    const diffMs = now - d.getTime();
    const sec = Math.floor(diffMs / 1000);
    if (sec < 45) return '방금 전';
    const min = Math.floor(sec / 60);
    if (min < 60) return `${min}분 전`;
    const hr = Math.floor(min / 60);
    if (hr < 24) return `${hr}시간 전`;
    const day = Math.floor(hr / 24);
    if (day < 14) return `${day}일 전`;
    return formatNotificationTime(iso);
  } catch {
    return formatNotificationTime(iso);
  }
}

export type NotificationFilterTab = 'all' | 'unread' | 'read';

export type NotificationCenterModalProps = {
  open: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onGoHref: (href: string) => void;
};

export function NotificationCenterModal({
  open,
  onClose,
  notifications,
  selectedId,
  onSelect,
  onMarkRead,
  onMarkAllRead,
  onGoHref,
}: NotificationCenterModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<NotificationFilterTab>('all');
  const [refreshSpinKey, setRefreshSpinKey] = useState(0);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      setSearchQuery('');
      setFilterTab('all');
      setRefreshSpinKey(0);
    }
  }, [open]);

  const counts = useMemo(() => {
    const total = notifications.length;
    const unread = notifications.filter((n) => !n.read).length;
    return { total, unread, read: total - unread };
  }, [notifications]);

  const tabFiltered = useMemo(() => {
    if (filterTab === 'all') return notifications;
    if (filterTab === 'unread') return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.read);
  }, [notifications, filterTab]);

  const filteredNotifications = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return tabFiltered;
    return tabFiltered.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        (n.category ?? '').toLowerCase().includes(q),
    );
  }, [tabFiltered, searchQuery]);

  useEffect(() => {
    if (!open || !selectedId) return;
    if (filteredNotifications.some((n) => n.id === selectedId)) return;
    onSelect(null);
  }, [open, filteredNotifications, selectedId, onSelect]);

  if (!open || typeof document === 'undefined') return null;

  const unreadCount = counts.unread;
  const selected = notifications.find((n) => n.id === selectedId) ?? null;

  const node = (
    <div
      className={s.overlay}
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={s.box}
        role="dialog"
        aria-modal="true"
        aria-labelledby="notification-center-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={s.toolbar}>
          <h2 id="notification-center-title" className={s.visuallyHidden}>
            알림 센터
          </h2>
          <div className={s.toolbarMain}>
            <Button
              type="button"
              variant="secondary"
              size="default"
              disabled={unreadCount === 0}
              onClick={() => {
                if (unreadCount > 0) onMarkAllRead();
              }}
            >
              일괄 읽음
            </Button>
            <div className={s.filterTabsTrack} role="tablist" aria-label="알림 필터">
              <button
                type="button"
                role="tab"
                aria-selected={filterTab === 'all'}
                className={clsx(s.filterTab, filterTab === 'all' && s.filterTabActive)}
                onClick={() => setFilterTab('all')}
              >
                전체 ({counts.total})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filterTab === 'unread'}
                className={clsx(s.filterTab, filterTab === 'unread' && s.filterTabActive)}
                onClick={() => setFilterTab('unread')}
              >
                읽지 않음 ({counts.unread})
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={filterTab === 'read'}
                className={clsx(s.filterTab, filterTab === 'read' && s.filterTabActive)}
                onClick={() => setFilterTab('read')}
              >
                읽음 ({counts.read})
              </button>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              aria-label="새로고침"
              onClick={() => {
                setSearchQuery('');
                setFilterTab('all');
                setRefreshSpinKey((k) => k + 1);
              }}
            >
              <RefreshCw
                key={refreshSpinKey}
                size={16}
                strokeWidth={2}
                aria-hidden
                className={refreshSpinKey > 0 ? s.refreshIconSpin : undefined}
              />
            </Button>
          </div>
          <Button type="button" variant="ghost" size="icon" aria-label="닫기" onClick={onClose}>
            <X size={18} strokeWidth={2} aria-hidden />
          </Button>
        </div>

        {notifications.length === 0 ? (
          <p className={s.empty}>알림이 없습니다.</p>
        ) : (
          <div className={s.body}>
            <div className={s.listCol}>
              <div className={s.listColHeader}>
                <span className={s.listColTitle}>전체 알림</span>
                <span className={s.listColBadge}>{filteredNotifications.length}</span>
              </div>
              <div className={s.listSearchSlot}>
                <Input
                  type="search"
                  size="default"
                  placeholder="알림 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="알림 검색"
                  autoComplete="off"
                />
              </div>
              <ul className={s.listScroll}>
                {filteredNotifications.length === 0 ? (
                  <li className={s.listNoResults}>검색 결과가 없습니다.</li>
                ) : (
                  filteredNotifications.map((n) => (
                    <li key={n.id}>
                      <button
                        type="button"
                        className={clsx(
                          s.cardBtn,
                          n.id === selectedId && s.cardBtnSelected,
                          !n.read && n.id !== selectedId && s.cardBtnUnread,
                        )}
                        onClick={() => {
                          onMarkRead(n.id);
                          onSelect(n.id);
                        }}
                      >
                        <div className={s.cardTop}>
                          <span className={s.cardTag}>{n.category ?? '알림'}</span>
                          <span className={s.cardRelTime}>{formatRelativeTime(n.createdAt)}</span>
                        </div>
                        <div className={s.cardTitle}>{n.title}</div>
                        <div className={s.cardPreview}>{n.body}</div>
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className={s.detailCol}>
              {selected ? (
                <>
                  <div className={s.detailScroll}>
                    <div className={s.detailMeta}>
                      <span className={s.detailTag}>{selected.category ?? '알림'}</span>
                      <span className={s.detailRelTime}>
                        {formatRelativeTime(selected.createdAt)}
                      </span>
                    </div>
                    <h3 className={s.detailTitle}>{selected.title}</h3>
                    <p className={s.detailBody}>{selected.body}</p>
                  </div>
                  {selected.href ? (
                    <div className={s.detailFooter}>
                      <Button
                        type="button"
                        variant="primary"
                        size="default"
                        onClick={() => {
                          onGoHref(selected.href!);
                          onClose();
                        }}
                      >
                        해당 페이지로 이동
                      </Button>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className={s.detailPlaceholder}>
                  <p className={s.detailEmpty}>알림을 선택하여 내용을 확인하세요</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
