'use client';

import Link from 'next/link';
import * as s from './index.css';

export function UploadNoticePage() {
  return (
    <div className={s.page}>
      <h1>공지사항</h1>
      <p>실적 등록 관련 공지사항입니다.</p>
      <p>
        <Link href="/upload" className={s.backLink}>
          ← 실적 등록으로 돌아가기
        </Link>
      </p>
    </div>
  );
}
