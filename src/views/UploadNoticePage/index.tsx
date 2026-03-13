'use client';

import Link from 'next/link';
import { PageTitle } from '@/components/Common/Text';
import * as s from './index.css';

export function UploadNoticePage() {
  return (
    <div className={s.page}>
      <PageTitle title="공지사항" />
      <p>실적 등록 관련 공지사항입니다.</p>
      <p>
        <Link href="/corporation/upload" className={s.backLink}>
          ← 실적 등록으로 돌아가기
        </Link>
      </p>
    </div>
  );
}
