'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

/** debugger 전후 시간차로 DevTools 열림 추정(우회·오탐 가능) */
const ALLOW_MS = 100;
const THROTTLE_MS = 200;

/**
 * 타이밍 기반 DevTools 감지. 프로덕션만. 이벤트 스로틀 적용.
 */
export function DevToolsTimingDetector() {
  const [blocked, setBlocked] = useState(false);
  const lastRun = useRef(0);

  const detect = useCallback(() => {
    if (process.env.NODE_ENV !== 'production') return;

    const now = Date.now();
    if (now - lastRun.current < THROTTLE_MS) return;
    lastRun.current = now;

    const start = performance.now();
    // eslint-disable-next-line no-debugger -- DevTools 열림 추정용
    debugger;
    const end = performance.now();

    setBlocked(end - start > ALLOW_MS);
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;

    if (document.readyState === 'complete') detect();
    else window.addEventListener('load', detect);

    window.addEventListener('resize', detect);
    window.addEventListener('mousemove', detect);
    window.addEventListener('focus', detect);
    window.addEventListener('blur', detect);

    return () => {
      window.removeEventListener('load', detect);
      window.removeEventListener('resize', detect);
      window.removeEventListener('mousemove', detect);
      window.removeEventListener('focus', detect);
      window.removeEventListener('blur', detect);
    };
  }, [detect]);

  if (!blocked) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2147483647,
        background: 'rgba(0,0,0,0.92)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        textAlign: 'center',
        fontSize: 16,
        lineHeight: 1.6,
      }}
      role="alertdialog"
      aria-live="assertive"
    >
      <p>
        개발자 도구 사용이 감지되었습니다.
        <br />
        서비스 이용을 계속하려면 개발자 도구를 닫아 주세요.
      </p>
    </div>
  );
}
