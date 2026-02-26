/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { theme } from '@/theme';

const pageStyles = css({
  '& h1': { marginBottom: theme.spacing(2), color: theme.colors.text },
  '& p': { color: theme.colors.textMuted, marginBottom: theme.spacing(4) },
});

const cardGridStyles = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: theme.spacing(4),
});

const cardStyles = css({
  padding: theme.spacing(4),
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.colors.border}`,
  boxShadow: theme.shadow.sm,
  '& a': {
    color: theme.colors.primary,
    fontWeight: 600,
    textDecoration: 'none',
  },
  '& a:hover': { textDecoration: 'underline' },
  '& h2': { fontSize: 18, marginBottom: theme.spacing(2) },
  '& p': { fontSize: 14, margin: 0, color: theme.colors.textMuted },
});

export function HomePage() {
  const { userRole } = useApp();

  return (
    <div css={pageStyles}>
      <h1>Promr Brand Chart</h1>
      <p>법인 실적·처방사진 업로드 및 제약사 법인 정산 확인</p>
      <div css={cardGridStyles}>
        {userRole === 'corporation' && (
          <>
            <div css={cardStyles}>
              <h2>실적 등록</h2>
              <p>실적 업로드(엑셀)와 처방사진 업로드를 진행합니다.</p>
              <Link to="/upload/sales">실적 등록 페이지로 →</Link>
            </div>
            <div css={cardStyles}>
              <h2>계약관리</h2>
              <p>딜러(영업사원) 정보를 관리합니다.</p>
              <Link to="/dealer-manage">계약관리 페이지로 →</Link>
            </div>
          </>
        )}
        {userRole === 'pharma' && (
          <>
            <div css={cardStyles}>
              <h2>거래처관리</h2>
              <p>거래처(병의원) 목록을 검색하고 확인합니다.</p>
              <Link to="/accounts">거래처관리 페이지로 →</Link>
            </div>
            <div css={cardStyles}>
              <h2>수수료관리</h2>
              <p>월별·품목별 수수료율을 설정합니다.</p>
              <Link to="/fees">수수료관리 페이지로 →</Link>
            </div>
            <div css={cardStyles}>
              <h2>정산확인</h2>
              <p>전체 법인·병의원 실적을 필터로 조회하고 정산합니다.</p>
              <Link to="/aggregate">정산확인 페이지로 →</Link>
            </div>
            <div css={cardStyles}>
              <h2>법인별 정산확인</h2>
              <p>법인을 선택하여 해당 법인의 실적 표를 확인합니다.</p>
              <Link to="/settlement">법인별 정산확인 페이지로 →</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
