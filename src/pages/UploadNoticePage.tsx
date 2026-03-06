/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Navigate, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { theme } from '@/theme';

const pageStyles = css({
  '& h1': { marginBottom: theme.spacing(2), color: theme.colors.text },
  '& p': { color: theme.colors.textMuted, marginBottom: theme.spacing(4) },
});

export function UploadNoticePage() {
  const { userRole } = useApp();

  if (userRole === 'pharma') return <Navigate to="/" replace />;

  return (
    <div css={pageStyles}>
      <h1>공지사항</h1>
      <p>실적 등록 관련 공지사항입니다.</p>
      <p>
        <Link to="/upload" css={css({ color: theme.colors.primary, fontWeight: 600 })}>
          ← 실적 등록으로 돌아가기
        </Link>
      </p>
    </div>
  );
}
