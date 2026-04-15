'use client';

import { useEffect, useState, type ReactNode } from 'react';

/** `.env.example`의 `NEXT_PUBLIC_ENABLE_MSW` 또는 기존 `NEXT_PUBLIC_MSW_ENABLED` 둘 다 허용 */
const mswEnabled =
  process.env.NEXT_PUBLIC_ENABLE_MSW === 'true' || process.env.NEXT_PUBLIC_MSW_ENABLED === 'true';

export function MswProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(() => !mswEnabled);

  useEffect(() => {
    if (!mswEnabled) return;

    let cancelled = false;
    void (async () => {
      const { worker } = await import('@/mocks/browser');
      await worker.start({ onUnhandledRequest: 'bypass' });
      if (!cancelled) setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return null;
  return children;
}
