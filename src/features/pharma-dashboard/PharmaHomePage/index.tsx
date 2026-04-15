'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { clsx } from 'clsx';
import { Bell, ChevronRight, FileSearch, GitBranch, MapPin, Send } from 'lucide-react';
import { useApp } from '@/store/appStore';
import { useDemoPlayStore } from '@/store/demoPlayStore';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import CardWrapper from '@/shared/components/layout/CardWrapper/CardWrapper';
import { computeAccountHeading } from '@/features/home/HomePage/stats';
import {
  countOutstandingContractRequestsMock,
  countPendingContractReviewMock,
  countReentrustAttentionPendingMock,
  getPendingContractReviewPreviewMock,
} from './lib/pharmaHomeContractMock';
import type { ContractReviewReceivedItem } from '@/features/contract/ContractReviewPage/types';
import * as s from './index.css';

const NOTICE_PREVIEW_LIMIT = 5;
const CONTRACT_PREVIEW_LIMIT = 4;
const REGION_TOP_N = 5;

function formatReceivedDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

function formatWon(n: number): string {
  return `${n.toLocaleString('ko-KR')}원`;
}

export function PharmaHomePage() {
  const { userRole, currentCorporationId, currentPharmaId } = useApp();
  const corporations = useDemoPlayStore((s) => s.corporations);
  const pharmas = useDemoPlayStore((s) => s.pharmas);
  const notices = useDemoPlayStore((s) => s.notices);
  const regionStats = useDemoPlayStore((s) => s.regionStats);

  const accountHeading = useMemo(() => {
    return computeAccountHeading({
      userRole,
      currentCorporationId,
      currentPharmaId,
      corporations,
      pharmas,
    });
  }, [userRole, currentCorporationId, currentPharmaId, corporations, pharmas]);

  const pendingReviewCount = useMemo(() => countPendingContractReviewMock(), []);
  const reentrustAttentionCount = useMemo(() => countReentrustAttentionPendingMock(), []);
  const outstandingRequestCount = useMemo(() => countOutstandingContractRequestsMock(), []);

  const scopedNoticeCount = useMemo(() => {
    return notices.filter((n) => {
      if (n.noticeScope === 'system') return true;
      if (n.noticeScope === 'pharma' && n.pharmaId === currentPharmaId) return true;
      return false;
    }).length;
  }, [notices, currentPharmaId]);

  const contractPreviewRows = useMemo(
    () => getPendingContractReviewPreviewMock(CONTRACT_PREVIEW_LIMIT),
    [],
  );

  const noticePreview = useMemo(() => {
    const scoped = notices.filter((n) => {
      if (n.noticeScope === 'system') return true;
      if (n.noticeScope === 'pharma' && n.pharmaId === currentPharmaId) return true;
      return false;
    });
    return [...scoped].sort((a, b) => b.no - a.no).slice(0, NOTICE_PREVIEW_LIMIT);
  }, [notices, currentPharmaId]);

  const topRegions = useMemo(() => {
    return [...regionStats].sort((a, b) => b.amount - a.amount).slice(0, REGION_TOP_N);
  }, [regionStats]);

  const topRegion = topRegions[0];

  return (
    <div className={clsx(s.page, s.dashboard)}>
      <PageHeader title="대시보드" description="계약·서류·공지 현황을 한눈에 확인하세요." />

      <div className={s.profileCard} role="status">
        <div className={s.greetingLabel}>안녕하세요</div>
        <div className={s.greetingLine}>
          <span className={s.accountName}>{accountHeading.name}</span>
          {' 님'}
          {accountHeading.roleLabel ? (
            <span className={s.accountRoleTag}> · {accountHeading.roleLabel}</span>
          ) : null}
        </div>
      </div>

      <div className={s.kpiGrid}>
        <div className={s.kpiCard}>
          <div className={clsx(s.kpiIconWrap, s.kpiIconWrapPending)}>
            <FileSearch size={22} strokeWidth={1.75} aria-hidden />
          </div>
          <div className={s.kpiText}>
            <div className={s.kpiTitle}>검토 대기</div>
            <div className={s.kpiSubtitle}>계약서</div>
            <div className={s.kpiValueRow}>
              <span className={clsx(s.kpiValue, s.kpiValuePending)}>{pendingReviewCount}</span>
              <span className={s.kpiUnit}>건</span>
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconWrap}>
            <GitBranch size={22} strokeWidth={1.75} aria-hidden />
          </div>
          <div className={s.kpiText}>
            <div className={s.kpiTitle}>재위탁·서류</div>
            <div className={s.kpiSubtitle}>확인 필요</div>
            <div className={s.kpiValueRow}>
              <span className={s.kpiValue}>{reentrustAttentionCount}</span>
              <span className={s.kpiUnit}>건</span>
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconWrap}>
            <Send size={22} strokeWidth={1.75} aria-hidden />
          </div>
          <div className={s.kpiText}>
            <div className={s.kpiTitle}>서류 요청</div>
            <div className={s.kpiSubtitle}>발송 진행</div>
            <div className={s.kpiValueRow}>
              <span className={s.kpiValue}>{outstandingRequestCount}</span>
              <span className={s.kpiUnit}>건</span>
            </div>
          </div>
        </div>
        <div className={s.kpiCard}>
          <div className={s.kpiIconWrap}>
            <Bell size={22} strokeWidth={1.75} aria-hidden />
          </div>
          <div className={s.kpiText}>
            <div className={s.kpiTitle}>공지</div>
            <div className={s.kpiSubtitle}>노출 건수</div>
            <div className={s.kpiValueRow}>
              <span className={s.kpiValue}>{scopedNoticeCount}</span>
              <span className={s.kpiUnit}>건</span>
            </div>
          </div>
        </div>
      </div>

      <div className={s.midSplit}>
        <CardWrapper
          title="검토 필요 계약"
          titleId="contract-preview-title"
          headerRight={
            <Link href="/pharma/contract-management/review" className={s.panelLink}>
              전체 보기
              <ChevronRight size={16} aria-hidden />
            </Link>
          }
          padding={0}
          flush
        >
          {contractPreviewRows.length > 0 ? (
            <div className={s.tableScroll}>
              <table className={s.dataTable}>
                <thead>
                  <tr>
                    <th scope="col" className={s.th}>
                      계약(법인)
                    </th>
                    <th scope="col" className={s.th}>
                      상태
                    </th>
                    <th scope="col" className={s.thDate}>
                      접수일
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contractPreviewRows.map((row: ContractReviewReceivedItem) => (
                    <tr key={row.id}>
                      <td className={s.tdStrong}>{row.corporationName}</td>
                      <td className={s.td}>
                        <span className={s.badgeGroup}>
                          <span className={s.badgeReview}>검토필요</span>
                          {row.isNew ? <span className={s.badgeNew}>신규</span> : null}
                        </span>
                      </td>
                      <td className={s.tdMuted}>{formatReceivedDate(row.receivedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={s.emptyText}>검토 대기 중인 계약이 없습니다.</p>
          )}
          <div className={s.panelFooter}>
            <Link href="/pharma/contract-management/review" className={s.footerLink}>
              전체 보기
              <ChevronRight size={16} aria-hidden />
            </Link>
          </div>
        </CardWrapper>

        <CardWrapper
          title="공지사항"
          titleId="notice-preview-title"
          headerRight={
            <Link href="/pharma/notices" className={s.panelLink}>
              전체 보기
              <ChevronRight size={16} aria-hidden />
            </Link>
          }
          padding={0}
          flush
        >
          {noticePreview.length > 0 ? (
            <ul className={s.noticeList}>
              {noticePreview.map((n) => (
                <li key={n.id} className={s.noticeItem}>
                  <Link href={`/pharma/notices/${n.id}`} className={s.noticeLink}>
                    <span className={s.noticeTag}>
                      {n.noticeScope === 'system' ? '[시스템]' : '[제약사]'}
                    </span>
                    <span className={s.noticeTitle}>{n.title}</span>
                    <span className={s.noticeDate}>{n.createdAt}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className={s.emptyText}>등록된 공지가 없습니다.</p>
          )}
        </CardWrapper>
      </div>

      <section className={s.regionSection} aria-labelledby="region-stats-title">
        <CardWrapper title="영역별 통계" titleId="region-stats-title" padding={0} flush>
          <div className={clsx(s.regionCard, s.regionCardInWrapper)}>
            <div className={s.regionHighlight}>
            <div className={s.regionPill}>
              <MapPin size={14} aria-hidden />
              상위 지역
            </div>
            <p className={s.regionLead}>
              {topRegion
                ? `${topRegion.regionName} 지역이 가장 높은 실적 금액을 보이고 있습니다.`
                : '지역별 실적을 요약해 보여줍니다.'}
            </p>
            <p className={s.regionHint}>상세 집계는 정산·실적 메뉴에서 확인할 수 있습니다.</p>
            </div>
            <ul className={s.regionList}>
              {topRegions.map((r) => (
                <li key={r.regionCode} className={s.regionRow}>
                  <span className={s.regionName}>{r.regionName}</span>
                  <span className={s.regionAmount}>{formatWon(r.amount)}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardWrapper>
      </section>
    </div>
  );
}
