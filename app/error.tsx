'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h2>오류가 발생했습니다</h2>
      <pre style={{ textAlign: 'left', overflow: 'auto', maxWidth: 600 }}>
        {error.message}
      </pre>
      <button onClick={() => reset()}>다시 시도</button>
    </div>
  );
}
