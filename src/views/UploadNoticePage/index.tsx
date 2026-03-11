'use client';
/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Link from 'next/link';
import { theme } from '@/theme';

const pageStyles = css({
  '& h1': { marginBottom: theme.spacing(2) },
  '& p': { marginBottom: theme.spacing(4) },
});

export function UploadNoticePage() {
  return (
    <div css={pageStyles}>
      <h1>공지사항</h1>
      <p>실적 등록 관련 공지사항입니다.</p>
      <p>
        <Link href="/upload" css={css({ color: theme.colors.primary, fontWeight: 600 })}>
          ← 실적 등록으로 돌아가기
        </Link>
      </p>
    </div>
  );
}
