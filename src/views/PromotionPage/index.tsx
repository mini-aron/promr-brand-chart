'use client';
/** @jsxImportSource @emotion/react */
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { css } from '@emotion/react';
import {
  HiChartBar,
  HiUpload,
  HiDocumentText,
  HiUserGroup,
  HiOfficeBuilding,
  HiCheckCircle,
} from 'react-icons/hi';
import { theme } from '@/theme';
import { Button } from '@/components/Common/Button';

const pageStyles = css({
  minHeight: '100vh',
  backgroundColor: theme.colors.background,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const headerStyles = css({
  width: '100%',
  maxWidth: 1100,
  padding: `${theme.spacing(5)}px ${theme.spacing(6)}px`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxSizing: 'border-box',
});

const logoStyles = css({
  display: 'flex',
  alignItems: 'center',
  fontSize: 26,
  fontWeight: 700,
  letterSpacing: '-0.02em',
  textDecoration: 'none',
  color: theme.colors.text,
  '& .logo-pro': { color: theme.colors.primary },
  '& .logo-pf': { color: theme.colors.text },
});

const heroStyles = css({
  flex: 1,
  width: '100%',
  maxWidth: 1100,
  padding: `${theme.spacing(10)}px ${theme.spacing(6)}px`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
});

const heroTitleStyles = css({
  fontSize: 48,
  fontWeight: 800,
  letterSpacing: '-0.04em',
  color: theme.colors.text,
  marginBottom: theme.spacing(4),
  lineHeight: 1.15,
});

const heroDescStyles = css({
  fontSize: 20,
  color: theme.colors.textMuted,
  marginBottom: theme.spacing(5),
  maxWidth: 640,
  lineHeight: 1.7,
});

const ctaButtonStyles = css({
  padding: `${theme.spacing(3)}px ${theme.spacing(6)}px`,
  fontSize: 17,
  fontWeight: 600,
  marginBottom: theme.spacing(12),
});

const sectionTitleStyles = css({
  fontSize: 24,
  fontWeight: 700,
  color: theme.colors.text,
  marginBottom: theme.spacing(6),
});

const featuresStyles = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: theme.spacing(5),
  width: '100%',
  maxWidth: 1100,
  marginBottom: theme.spacing(12),
});

const featureCardStyles = css({
  padding: theme.spacing(6),
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.colors.border}`,
  boxShadow: theme.shadow.sm,
  textAlign: 'center',
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadow.md,
  },
  '& svg': {
    fontSize: 44,
    color: theme.colors.primary,
    marginBottom: theme.spacing(3),
  },
  '& h3': {
    fontSize: 18,
    fontWeight: 600,
    color: theme.colors.text,
    marginBottom: theme.spacing(2),
  },
  '& p': {
    fontSize: 15,
    color: theme.colors.textMuted,
    lineHeight: 1.6,
  },
});

const benefitsSectionStyles = css({
  width: '100%',
  maxWidth: 1100,
  padding: `${theme.spacing(8)}px ${theme.spacing(6)}px`,
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radius.lg,
  border: `1px solid ${theme.colors.border}`,
  marginBottom: theme.spacing(10),
});

const benefitsListStyles = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: theme.spacing(4),
  '& li': {
    display: 'flex',
    alignItems: 'flex-start',
    gap: theme.spacing(2),
    fontSize: 15,
    color: theme.colors.text,
    lineHeight: 1.6,
  },
  '& svg': {
    flexShrink: 0,
    marginTop: 2,
    color: theme.colors.success,
    fontSize: 20,
  },
});

const bottomCtaStyles = css({
  textAlign: 'center',
  padding: theme.spacing(8),
  '& p': {
    fontSize: 18,
    color: theme.colors.textMuted,
    marginBottom: theme.spacing(4),
  },
});

export function PromotionPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/home');
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return null;
  if (isAuthenticated) return null;

  return (
    <div css={pageStyles}>
      <header css={headerStyles}>
        <Link href="/promotion" css={logoStyles} aria-label="PROPF 홈">
          <span className="logo-pro">PRO</span>
          <span className="logo-pf">PF</span>
        </Link>
        <Link href="/login">
          <Button variant="primary" size="default" css={css({ padding: `${theme.spacing(2)}px ${theme.spacing(4)}px`, fontSize: 15 })}>
            로그인
          </Button>
        </Link>
      </header>
      <section css={heroStyles}>
        <h1 css={heroTitleStyles}>Promr Brand Chart</h1>
        <p css={heroDescStyles}>
          법인 실적을 정산하는 제약사를 위한 통합 플랫폼입니다.
          <br />
          법인 제출 실적 검수부터 정산·필터링 승인까지 한 곳에서 처리하세요.
        </p>
        <Link href="/login">
          <Button variant="primary" size="default" css={ctaButtonStyles}>
            무료로 시작하기
          </Button>
        </Link>

        <h2 css={sectionTitleStyles}>주요 기능</h2>
        <div css={featuresStyles}>
          <div css={featureCardStyles}>
            <HiChartBar />
            <h3>실적 대시보드</h3>
            <p>법인들이 제출한 실적을 한눈에 조회하고, 월별·법인별 매출 추이를 파악할 수 있습니다.</p>
          </div>
          <div css={featureCardStyles}>
            <HiDocumentText />
            <h3>법인별 정산</h3>
            <p>법인별 정산 금액을 확인하고, 필터링 승인·거래처 설정을 통합 관리합니다.</p>
          </div>
          <div css={featureCardStyles}>
            <HiUserGroup />
            <h3>법인 계약 조회</h3>
            <p>법인별 딜러(영업사원) 계약 현황을 조회하고 검증할 수 있습니다.</p>
          </div>
          <div css={featureCardStyles}>
            <HiOfficeBuilding />
            <h3>거래처·병의원 관리</h3>
            <p>정산 대상 거래처와 병의원 정보를 관리하고, 수수료를 설정합니다.</p>
          </div>
          <div css={featureCardStyles}>
            <HiUpload />
            <h3>필터링 승인</h3>
            <p>법인의 필터링(병의원 추가) 요청을 검토하고 승인·반려 처리합니다.</p>
          </div>
        </div>

        <div css={benefitsSectionStyles}>
          <h2 css={[sectionTitleStyles, css({ marginBottom: theme.spacing(4) })]}>이런 제약사 담당자를 위해</h2>
          <ul css={benefitsListStyles}>
            <li>
              <HiCheckCircle /> 법인 실적을 정산·검수하는 담당자
            </li>
            <li>
              <HiCheckCircle /> 법인별 정산액 산정 및 필터링 승인 업무 담당자
            </li>
            <li>
              <HiCheckCircle /> 거래처·병의원 마스터 데이터를 관리하는 담당자
            </li>
            <li>
              <HiCheckCircle /> 법인 계약 및 딜러 정보를 확인해야 하는 담당자
            </li>
          </ul>
        </div>

        <div css={bottomCtaStyles}>
          <p>법인 정산 업무를 효율적으로 관리해 보세요.</p>
          <Link href="/login">
            <Button variant="primary" size="default" css={ctaButtonStyles}>
              로그인하여 시작하기
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
