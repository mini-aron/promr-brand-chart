import CardWrapper from '@/shared/components/layout/CardWrapper/CardWrapper';
import * as s from './index.css';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import Link from 'next/link';
import { useMemo } from 'react';
import { MOCK_CONTRACT_REVIEW_ITEMS } from '@/features/contract/mockData';
import {
  MOCK_CONTRACT_DOCUMENT_ROWS,
  MOCK_REENTRUST_ROOT,
} from '@/features/contract/lib/contractManagementMock';
import type { ReentrustTreeNode } from '@/features/contract/ContractRequestPage/types';
import { AlertCircle, ChevronRight, FileText, GitBranch } from 'lucide-react';

const LINK_DESTINATION = {
  review: '계약서 검토',
  request: '재위탁 확인',
  manage: '계약서 관리',
} as const;

export function ContractManagementPage() {
  const dashboard = useMemo(() => {
    const reviewNeedCount = MOCK_CONTRACT_REVIEW_ITEMS.filter(
      (i) => i.listType === '수신목록' && i.status === '검토필요',
    ).length;
    const expiredCount = MOCK_CONTRACT_DOCUMENT_ROWS.filter((r) => r.status === 'expired').length;
    const documentWarningCount = MOCK_CONTRACT_DOCUMENT_ROWS.filter((r) => {
      if (r.status === 'expired') return false;
      const d = r.documents;
      return !(
        d.reportCert &&
        d.contract &&
        d.subcontractContract &&
        d.businessLicense &&
        d.csoTrainingCert
      );
    }).length;

    const countTree = (node: ReentrustTreeNode): { warning: number; error: number } => {
      const self = {
        warning: node.status === 'warning' ? 1 : 0,
        error: node.status === 'error' ? 1 : 0,
      };
      const children = node.children ?? [];
      return children.reduce((acc, c) => {
        const v = countTree(c);
        return { warning: acc.warning + v.warning, error: acc.error + v.error };
      }, self);
    };

    const treeCounts = countTree(MOCK_REENTRUST_ROOT);

    return {
      reviewNeedCount,
      expiredCount,
      documentWarningCount,
      reentrustWarningCount: treeCounts.warning,
      reentrustErrorCount: treeCounts.error,
      totalDocumentCount: MOCK_CONTRACT_DOCUMENT_ROWS.length,
    };
  }, []);

  const missingSubmissionCorps = useMemo(() => {
    return MOCK_CONTRACT_DOCUMENT_ROWS.filter((r) => {
      if (r.status === 'expired') return false;
      const d = r.documents;
      return !(
        d.reportCert &&
        d.contract &&
        d.subcontractContract &&
        d.businessLicense &&
        d.csoTrainingCert
      );
    });
  }, []);

  const expiredContracts = useMemo(() => {
    return MOCK_CONTRACT_DOCUMENT_ROWS.filter((r) => r.status === 'expired');
  }, []);

  return (
    <div className={s.page}>
      <PageHeader
        title="계약관리 대시보드"
        description="계약 조회·검토·재위탁 확인 현황을 한 곳에서 확인할 수 있습니다."
      />
      <div>
        <CardWrapper title="요약" padding={16}>
          <div className={s.summaryGrid}>
            <Link href="/pharma/contract-management/review" className={s.linkCard}>
              <div className={s.statCardLinkable}>
                <div className={s.statCardRow}>
                  <div className={s.statIconWrap} aria-hidden>
                    <AlertCircle size={20} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className={s.statLabel}>대기 검토 계약서</div>
                    <div className={s.statValue}>{dashboard.reviewNeedCount}</div>
                    <div className={s.statDetail}>검토필요</div>
                  </div>
                </div>
                <span className={s.linkCardCta}>
                  <span>{LINK_DESTINATION.review}</span>
                  <ChevronRight className={s.linkCardCtaIcon} size={18} aria-hidden />
                </span>
              </div>
            </Link>

            <Link href="/pharma/contract-management/request" className={s.linkCard}>
              <div className={s.statCardLinkable}>
                <div className={s.statCardRow}>
                  <div className={s.statIconWrap} aria-hidden>
                    <GitBranch size={20} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className={s.statLabel}>재위탁 확인</div>
                    <div className={s.statValue}>{dashboard.reentrustWarningCount}</div>
                    <div className={s.statDetail}>
                      경고 {dashboard.reentrustWarningCount} · 오류 {dashboard.reentrustErrorCount}
                    </div>
                  </div>
                </div>
                <span className={s.linkCardCta}>
                  <span>{LINK_DESTINATION.request}</span>
                  <ChevronRight className={s.linkCardCtaIcon} size={18} aria-hidden />
                </span>
              </div>
            </Link>

            <Link href="/pharma/contract-management/manage" className={s.linkCard}>
              <div className={s.statCardLinkable}>
                <div className={s.statCardRow}>
                  <div className={s.statIconWrap} aria-hidden>
                    <FileText size={20} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className={s.statLabel}>계약서/서류 현황</div>
                    <div className={s.statValue}>{dashboard.totalDocumentCount}</div>
                    <div className={s.statDetail}>
                      누락 {dashboard.documentWarningCount} · 만료 {dashboard.expiredCount}
                    </div>
                  </div>
                </div>
                <span className={s.linkCardCta}>
                  <span>{LINK_DESTINATION.manage}</span>
                  <ChevronRight className={s.linkCardCtaIcon} size={18} aria-hidden />
                </span>
              </div>
            </Link>
          </div>
        </CardWrapper>

        <CardWrapper title="계약관리" padding={0}>
          <div className={s.contractSection}>
            <div className={s.grid}>
              <Link href="/pharma/contract-management/manage" className={s.linkCard}>
                <div className={s.statCardLinkable}>
                  <div className={s.statCardLinkableBody}>
                    <div className={s.statLabel}>미제출 법인</div>
                    <div className={s.statValue}>{missingSubmissionCorps.length}</div>
                    <div className={s.statDetail}>필수 서류 누락</div>
                  </div>
                  <span className={s.linkCardCta}>
                    <span>{LINK_DESTINATION.manage}</span>
                    <ChevronRight className={s.linkCardCtaIcon} size={18} aria-hidden />
                  </span>
                </div>
              </Link>
              <Link href="/pharma/contract-management/manage" className={s.linkCard}>
                <div className={s.statCardLinkable}>
                  <div className={s.statCardLinkableBody}>
                    <div className={s.statLabel}>만료계약서</div>
                    <div className={s.statValue}>{expiredContracts.length}</div>
                    <div className={s.statDetail}>계약 만료</div>
                  </div>
                  <span className={s.linkCardCta}>
                    <span>{LINK_DESTINATION.manage}</span>
                    <ChevronRight className={s.linkCardCtaIcon} size={18} aria-hidden />
                  </span>
                </div>
              </Link>
            </div>

            <div className={s.grid}>
              <div className={s.statCard}>
                <div className={s.listTitleRow} style={{ padding: '12px 12px 0' }}>
                  <div className={s.listTitle}>미제출 법인</div>
                  <div className={s.listMeta}>최대 5개</div>
                </div>
                {missingSubmissionCorps.length > 0 ? (
                  <div className={s.table}>
                    <div className={s.tableHeaderRow}>
                      <span className={s.tableHeaderCell}>법인</span>
                      <span className={s.tableHeaderCell}>상태</span>
                    </div>
                    {missingSubmissionCorps.slice(0, 5).map((row) => (
                      <Link
                        key={row.id}
                        href="/pharma/contract-management/manage"
                        className={s.listItemLink}
                      >
                        <div className={s.tableBodyRow}>
                          <span className={s.listItemName}>{row.csoName}</span>
                          <span className={s.listItemSub}>미제출</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className={s.emptyState}>미제출 법인이 없습니다.</div>
                )}
              </div>

              <div className={s.statCard}>
                <div className={s.listTitleRow} style={{ padding: '12px 12px 0' }}>
                  <div className={s.listTitle}>만료계약서</div>
                  <div className={s.listMeta}>최대 5개</div>
                </div>
                {expiredContracts.length > 0 ? (
                  <div className={s.table}>
                    <div className={s.tableHeaderRow}>
                      <span className={s.tableHeaderCell}>법인</span>
                      <span className={s.tableHeaderCell}>만료일</span>
                    </div>
                    {expiredContracts.slice(0, 5).map((row) => (
                      <Link
                        key={row.id}
                        href="/pharma/contract-management/manage"
                        className={s.listItemLink}
                      >
                        <div className={s.tableBodyRow}>
                          <span className={s.listItemName}>{row.csoName}</span>
                          <span className={s.listItemSub}>{row.expiryDate}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className={s.emptyState}>만료된 계약서가 없습니다.</div>
                )}
              </div>
            </div>
          </div>
        </CardWrapper>
      </div>
    </div>
  );
}
