'use client';

import { useEffect } from 'react';
import {
  ensureAppNotificationsMigrated,
  ensureNoticesMigrated,
  migrateFilterApprovalDeadlinesFromLegacy,
  useDemoPlayStore,
} from '@/store/demoPlayStore';

/**
 * Zustand persist가 localStorage에서 복원되도록 클라이언트에서 한 번 호출합니다.
 */
export function DemoPlayRehydrate({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const p = useDemoPlayStore.persist.rehydrate();
    Promise.resolve(p).then(() => {
      migrateFilterApprovalDeadlinesFromLegacy();
      ensureAppNotificationsMigrated();
      ensureNoticesMigrated();
    });
  }, []);
  return <>{children}</>;
}
