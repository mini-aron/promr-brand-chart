'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import {
  HiChartBar,
  HiUpload,
  HiDocumentText,
  HiUserGroup,
  HiOfficeBuilding,
  HiCheckCircle,
} from 'react-icons/hi';
import { Button } from '@/components/Common/Button';
import * as s from './index.css';

export function PromotionPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading && isAuthenticated) router.replace('/home');
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return null;
  if (isAuthenticated) return null;

  return (
    <div className={s.page}>
      <header className={s.header}>
        <Link href="/promotion" className={s.logo} aria-label="PROPF 홈">
          <span className={s.logoPro}>PRO</span>
          <span className={s.logoPf}>PF</span>
        </Link>
        <Link href="/login">
          <Button variant="primary" size="default" className={s.headerLoginButton}>
            로그인
          </Button>
        </Link>
      </header>
      <section className={s.hero}>
        <h1 className={s.heroTitle}>Promr Brand Chart</h1>
        <p className={s.heroDesc}>
          법인 실적을 정산하는 제약사를 위한 통합 플랫폼입니다.
          <br />
          법인 제출 실적 검수부터 정산·필터링 승인까지 한 곳에서 처리하세요.
        </p>
        <Link href="/login">
          <Button variant="primary" size="default" className={s.ctaButton}>
            무료로 시작하기
          </Button>
        </Link>

        <h2 className={s.sectionTitle}>주요 기능</h2>
        <div className={s.features}>
          <div className={s.featureCard}>
            <HiChartBar />
            <h3>실적 대시보드</h3>
            <p>법인들이 제출한 실적을 한눈에 조회하고, 월별·법인별 매출 추이를 파악할 수 있습니다.</p>
          </div>
          <div className={s.featureCard}>
            <HiDocumentText />
            <h3>법인별 정산</h3>
            <p>법인별 정산 금액을 확인하고, 필터링 승인·거래처 설정을 통합 관리합니다.</p>
          </div>
          <div className={s.featureCard}>
            <HiUserGroup />
            <h3>법인 계약 조회</h3>
            <p>법인별 딜러(영업사원) 계약 현황을 조회하고 검증할 수 있습니다.</p>
          </div>
          <div className={s.featureCard}>
            <HiOfficeBuilding />
            <h3>거래처·병의원 관리</h3>
            <p>정산 대상 거래처와 병의원 정보를 관리하고, 수수료를 설정합니다.</p>
          </div>
          <div className={s.featureCard}>
            <HiUpload />
            <h3>필터링 승인</h3>
            <p>법인의 필터링(병의원 추가) 요청을 검토하고 승인·반려 처리합니다.</p>
          </div>
        </div>

        <div className={s.benefitsSection}>
          <h2 className={s.benefitsSectionTitle}>이런 제약사 담당자를 위해</h2>
          <ul className={s.benefitsList}>
            <li className={s.benefitsItem}>
              <HiCheckCircle /> 법인 실적을 정산·검수하는 담당자
            </li>
            <li className={s.benefitsItem}>
              <HiCheckCircle /> 법인별 정산액 산정 및 필터링 승인 업무 담당자
            </li>
            <li className={s.benefitsItem}>
              <HiCheckCircle /> 거래처·병의원 마스터 데이터를 관리하는 담당자
            </li>
            <li className={s.benefitsItem}>
              <HiCheckCircle /> 법인 계약 및 딜러 정보를 확인해야 하는 담당자
            </li>
          </ul>
        </div>

        <div className={s.bottomCta}>
          <p>법인 정산 업무를 효율적으로 관리해 보세요.</p>
          <Link href="/login">
            <Button variant="primary" size="default" className={s.ctaButton}>
              로그인하여 시작하기
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
