'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { clsx } from 'clsx';
import { Building2, Check, ChevronRight, FileSearch, Sparkles } from 'lucide-react';
import { useApp } from '@/store/appStore';
import { useDemoPlayStore } from '@/store/demoPlayStore';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import CardWrapper from '@/shared/components/layout/CardWrapper/CardWrapper';
import { computeAccountHeading } from '@/features/home/HomePage/stats';
import {
  getCorporationContractReviewPreviewMock,
  getCorporationNoticePreviewMock,
  getCorporationProfileDocumentsMock,
  type CorporationProfileDocumentsMock,
} from './lib/corporationHomeMock';
import type { ContractReviewReceivedItem, ContractReviewReceivedStatus } from '@/features/contract/ContractReviewPage/types';
import * as s from '@/features/pharma-dashboard/PharmaHomePage/index.css';
import * as cs from './index.css';

function formatDotDateYmd(ymd: string): string {
  const parts = ymd.split('-');
  if (parts.length !== 3) return ymd;
  const [y, m, d] = parts;
  return `${y}.${m}.${d}`;
}

function formatReceivedDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

function statusBadgeClass(status: ContractReviewReceivedStatus): string {
  if (status === '검토완료') return s.badgeApproved;
  if (status === '불가') return s.badgeRejected;
  return s.badgeReview;
}

function ApprovalStatusBadges({ row }: { row: ContractReviewReceivedItem }) {
  return (
    <span className={s.badgeGroup}>
      <span className={statusBadgeClass(row.status)}>{row.status}</span>
      {row.isNew ? <span className={s.badgeNew}>신규</span> : null}
    </span>
  );
}

const PROFILE_DOC_FIELDS: { key: keyof CorporationProfileDocumentsMock; label: string }[] = [
  { key: 'businessLicense', label: '사업자등록증' },
  { key: 'reportCert', label: '신고필증' },
  { key: 'csoTrainingCert', label: '교육이수증' },
];

export function CorporationHomePage() {
  const { userRole, currentCorporationId, currentPharmaId } = useApp();
  const corporations = useDemoPlayStore((st) => st.corporations);
  const pharmas = useDemoPlayStore((st) => st.pharmas);
  const notices = useDemoPlayStore((st) => st.notices);
  const corpInvitations = useDemoPlayStore((st) => st.corpInvitations);

  const accountHeading = useMemo(() => {
    return computeAccountHeading({
      userRole,
      currentCorporationId,
      currentPharmaId,
      corporations,
      pharmas,
    });
  }, [userRole, currentCorporationId, currentPharmaId, corporations, pharmas]);

  const corporationName = useMemo(() => {
    const c = corporations.find((x) => x.id === currentCorporationId);
    return c?.name ?? '';
  }, [corporations, currentCorporationId]);

  const acceptedPharmaIds = useMemo(() => {
    return corpInvitations
      .filter((i) => i.corporationId === currentCorporationId && i.status === 'accepted')
      .map((i) => i.pharmaId);
  }, [corpInvitations, currentCorporationId]);

  const noticePreview = useMemo(
    () => getCorporationNoticePreviewMock({ notices, acceptedPharmaIds }),
    [notices, acceptedPharmaIds],
  );

  const contractPreviewRows = useMemo(
    () => getCorporationContractReviewPreviewMock(corporationName),
    [corporationName],
  );

  const profileDocs = useMemo(
    () => getCorporationProfileDocumentsMock(corporationName),
    [corporationName],
  );

  const reviewingCount = useMemo(
    () => contractPreviewRows.filter((r) => r.status === '검토필요').length,
    [contractPreviewRows],
  );

  const newCount = useMemo(
    () => contractPreviewRows.filter((r) => r.isNew).length,
    [contractPreviewRows],
  );

  const noticeHeaderRight = (
    <Link href="/corporation/upload/notice" className={s.panelLink}>
      전체 보기
      <ChevronRight size={16} aria-hidden />
    </Link>
  );

  const approvalHeaderRight = (
    <Link href="/corporation/contract-manage" className={s.panelLink}>
      전체 보기
      <ChevronRight size={16} aria-hidden />
    </Link>
  );

  return (
    <div className={clsx(s.page, s.dashboard)}>
      <PageHeader title="대시보드" description="계약·서류·공지 현황을 한눈에 확인하세요." />

      <main className={cs.layoutGrid} aria-label="법인 대시보드 요약">
        <div className={clsx(s.profileCard, cs.welcomeFull)} role="status">
          <div className={s.greetingLabel}>안녕하세요</div>
          <div className={s.greetingLine}>
            <span className={s.accountName}>{accountHeading.name}</span>
            {' 님'}
            {accountHeading.roleLabel ? (
              <span className={s.accountRoleTag}> · {accountHeading.roleLabel}</span>
            ) : null}
          </div>
        </div>

        <CardWrapper
          className={cs.cardAreaDocs}
          title="제출 서류"
          titleId="corp-docs-title"
          padding={16}
          flush
        >
          {PROFILE_DOC_FIELDS.map(({ key, label }) => {
            const ok = profileDocs?.[key];
            return (
              <div key={key} className={cs.docRowWithIcon}>
                <span className={cs.docLabel}>{label}</span>
                {profileDocs ? (
                  ok ? (
                    <span className={cs.docCheckWrap}>
                      <Check size={16} strokeWidth={2.5} aria-hidden />
                      제출
                    </span>
                  ) : (
                    <span className={cs.docMuted}>미제출</span>
                  )
                ) : (
                  <span className={cs.docMuted}>등록 정보 없음</span>
                )}
              </div>
            );
          })}
        </CardWrapper>

        <CardWrapper
          className={cs.cardAreaStatus}
          title="계약 상태"
          titleId="corp-contract-status-title"
          padding={16}
          flush
        >
          {contractPreviewRows.length > 0 ? (
            <>
              <div className={cs.statusKpiGrid}>
                <div className={s.kpiCard}>
                  <div className={clsx(s.kpiIconWrap, s.kpiIconWrapPending)}>
                    <FileSearch size={22} strokeWidth={1.75} aria-hidden />
                  </div>
                  <div className={s.kpiText}>
                    <div className={s.kpiTitle}>검토중</div>
                    <div className={s.kpiSubtitle}>계약 건</div>
                    <div className={s.kpiValueRow}>
                      <span className={clsx(s.kpiValue, s.kpiValuePending)}>{reviewingCount}</span>
                      <span className={s.kpiUnit}>건</span>
                    </div>
                  </div>
                </div>
                <div className={s.kpiCard}>
                  <div className={s.kpiIconWrap}>
                    <Sparkles size={22} strokeWidth={1.75} aria-hidden />
                  </div>
                  <div className={s.kpiText}>
                    <div className={s.kpiTitle}>신규</div>
                    <div className={s.kpiSubtitle}>표시 건</div>
                    <div className={s.kpiValueRow}>
                      <span className={s.kpiValue}>{newCount}</span>
                      <span className={s.kpiUnit}>건</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={cs.statusLatestWrap}>
                <p className={cs.statusLatestSectionLabel}>최근 제출</p>
                <div className={cs.statusLatestCard}>
                  <div className={cs.statusLatestLeft}>
                    <span className={cs.statusLatestIconWrap}>
                      <Building2 size={18} strokeWidth={2} aria-hidden />
                    </span>
                    <span className={cs.statusLatestPharmaName}>
                      {contractPreviewRows[0].submittedTo ?? contractPreviewRows[0].summary}
                    </span>
                  </div>
                  <div className={cs.statusLatestDateCol}>
                    <span className={cs.statusLatestDateCaption}>접수일</span>
                    <time
                      className={cs.statusLatestDateValue}
                      dateTime={contractPreviewRows[0].receivedAt}
                    >
                      {formatReceivedDate(contractPreviewRows[0].receivedAt)}
                    </time>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <p className={clsx(s.emptyText, cs.emptyAlignLeft)}>제출된 계약이 없습니다.</p>
          )}
        </CardWrapper>

        <CardWrapper
          className={cs.cardAreaNotices}
          title="공지사항"
          titleId="corp-notice-preview-title"
          headerRight={noticeHeaderRight}
          padding={0}
          fill
          flush
        >
          <div className={cs.noticesBody}>
            {noticePreview.length > 0 ? (
              <div className={cs.noticesScroll}>
                <ul className={s.noticeList}>
                  {noticePreview.map((n) => (
                    <li key={n.id} className={s.noticeItem}>
                      <Link href={`/corporation/upload/notice/${n.id}`} className={s.noticeLink}>
                        <span className={s.noticeTag}>
                          {n.noticeScope === 'system' ? '[시스템]' : '[제약사]'}
                        </span>
                        <span className={s.noticeTitle}>{n.title}</span>
                        <span className={s.noticeDate}>{n.createdAt}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className={s.emptyText}>등록된 공지가 없습니다.</p>
            )}
          </div>
        </CardWrapper>

        <CardWrapper
          className={cs.cardAreaApproval}
          title="계약 승인 현황"
          titleId="corp-contract-approval-title"
          headerRight={approvalHeaderRight}
          padding={0}
          flush
        >
          {contractPreviewRows.length > 0 ? (
            <div className={s.tableScroll}>
              <table className={s.dataTable}>
                <thead>
                  <tr>
                    <th scope="col" className={s.th}>
                      제출한 곳
                    </th>
                    <th scope="col" className={s.th}>
                      승인여부
                    </th>
                    <th scope="col" className={s.thDate}>
                      만료일
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {contractPreviewRows.map((row) => (
                    <tr key={row.id}>
                      <td className={s.tdStrong}>{row.submittedTo ?? '—'}</td>
                      <td className={s.td}>
                        <ApprovalStatusBadges row={row} />
                      </td>
                      <td className={s.tdMuted}>{formatDotDateYmd(row.endDate)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className={s.emptyText}>검토 대기 중인 계약이 없습니다.</p>
          )}
          <div className={s.panelFooter}>
            <Link href="/corporation/contract-manage" className={s.footerLink}>
              전체 보기
              <ChevronRight size={16} aria-hidden />
            </Link>
          </div>
        </CardWrapper>
      </main>
    </div>
  );
}
