'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { Bell } from 'lucide-react';
import type { AppNotification } from '@/types';
import { useDemoPlayStore } from '@/store/demoPlayStore';
import { NotificationCenterModal } from './NotificationCenterModal';
import * as s from './NotificationBell.css';

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

export function NotificationBell() {
  const router = useRouter();
  const appNotifications = useDemoPlayStore((st) => st.appNotifications);
  const markNotificationRead = useDemoPlayStore((st) => st.markNotificationRead);
  const markAllNotificationsRead = useDemoPlayStore((st) => st.markAllNotificationsRead);

  const [open, setOpen] = useState(false);
  const [centerOpen, setCenterOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const unreadCount = appNotifications.filter((n: AppNotification) => !n.read).length;
  const hasUnread = unreadCount > 0;

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const root = wrapRef.current;
      if (root && !root.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);

  useEffect(() => {
    if (!centerOpen) return;
    setSelectedId((prev) => {
      if (prev && appNotifications.some((n) => n.id === prev)) return prev;
      return null;
    });
  }, [centerOpen, appNotifications]);

  return (
    <div className={s.wrap} ref={wrapRef}>
      <button
        type="button"
        className={s.trigger}
        data-unread={hasUnread ? 'true' : undefined}
        aria-label="알림"
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
      >
        <span className={clsx(s.bellIcon, hasUnread && s.bellIconWiggle)} aria-hidden>
          <Bell size={22} strokeWidth={2} aria-hidden />
        </span>
        {hasUnread && (
          <span className={s.badge} aria-hidden>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className={s.panel} role="dialog" aria-label="알림 목록">
          {appNotifications.length > 0 && (
            <div className={s.panelActions}>
              {unreadCount > 0 ? (
                <button
                  type="button"
                  className={s.markAllBtn}
                  onClick={() => markAllNotificationsRead()}
                >
                  모두 읽음
                </button>
              ) : (
                <span className={s.panelActionsSpacer} aria-hidden />
              )}
              <button
                type="button"
                className={s.viewAllBtn}
                onClick={() => {
                  setOpen(false);
                  setSelectedId(null);
                  setCenterOpen(true);
                }}
              >
                전체보기
              </button>
            </div>
          )}
          {appNotifications.length === 0 ? (
            <p className={s.empty}>알림이 없습니다.</p>
          ) : (
            <ul className={s.list}>
              {appNotifications.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    className={clsx(s.item, !n.read && s.itemUnread)}
                    onClick={() => {
                      markNotificationRead(n.id);
                      setOpen(false);
                      if (n.href) router.push(n.href);
                    }}
                  >
                    <div className={s.itemTitle}>{n.title}</div>
                    <div className={s.itemBody}>{n.body}</div>
                    <div className={s.itemTime}>{formatNotificationTime(n.createdAt)}</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <NotificationCenterModal
        open={centerOpen}
        onClose={() => {
          setCenterOpen(false);
          setSelectedId(null);
        }}
        notifications={appNotifications}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onMarkRead={markNotificationRead}
        onMarkAllRead={markAllNotificationsRead}
        onGoHref={(href) => router.push(href)}
      />
    </div>
  );
}
