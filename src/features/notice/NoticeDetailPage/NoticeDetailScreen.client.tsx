'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { ArrowLeft, Pencil } from 'lucide-react';
import { page } from '@/style/PageStyles.css';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { Column } from '@/shared/components/ui/Flex';
import { Button } from '@/shared/components/ui/Button';
import { useApp } from '@/store/appStore';
import { useDemoPlayStore } from '@/store/demoPlayStore';
import type { NoticeDetail } from '@/types';
import * as shared from '../EditNoticePage/index.css';
import * as detail from './index.css';

const MarkdownPreviewLazy = dynamic(
  () => import('@/shared/components/ui/MarkdownPreview').then((m) => m.MarkdownPreview),
  {
    ssr: false,
    loading: () => <div className={detail.detailMarkdownLoading}>본문을 불러오는 중…</div>,
  },
);

export type NoticeDetailScreenProps = {
  listPath?: string;
  noticeId: string;
};

export function NoticeDetailScreen({
  listPath = '/corporation/upload/notice',
  noticeId: id,
}: NoticeDetailScreenProps) {
  const router = useRouter();
  const { userRole, currentPharmaId } = useApp();
  const noticeDetails = useDemoPlayStore((st) => st.noticeDetails);

  const [notice, setNotice] = useState<NoticeDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    const found = noticeDetails.find((n) => n.id === id);
    setNotice(found ?? null);
  }, [id, noticeDetails]);

  const canEdit = useMemo(() => {
    if (!notice) return false;
    if (userRole === 'corporation') return false;
    if (notice.noticeScope === 'system') return userRole === 'admin';
    if (notice.noticeScope === 'pharma') {
      return userRole === 'pharma' && notice.pharmaId === currentPharmaId;
    }
    return false;
  }, [notice, userRole, currentPharmaId]);

  const handleBack = useCallback(() => {
    router.push(listPath);
  }, [router, listPath]);

  const handleGoEdit = useCallback(() => {
    if (!id) return;
    router.push(`${listPath}/${id}/edit`);
  }, [router, listPath, id]);

  if (!id) {
    return (
      <div className={page}>
        <PageHeader title="공지사항" description="잘못된 경로입니다." />
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft size={16} aria-hidden style={{ marginRight: 6 }} />
          목록으로
        </Button>
      </div>
    );
  }

  if (!notice) {
    return (
      <div className={page}>
        <PageHeader title="공지사항" description="공지를 찾을 수 없습니다." />
        <Button variant="ghost" onClick={handleBack}>
          목록으로
        </Button>
      </div>
    );
  }

  const scopeLabel = notice.noticeScope === 'system' ? '시스템 공지' : '제약사 공지';

  return (
    <div className={page}>
      <PageHeader title="공지사항" />
      <Column className={detail.detailCard}>
        <div className={detail.detailToolbar}>
          <button
            type="button"
            className={shared.backButton}
            onClick={handleBack}
            aria-label="목록으로 돌아가기"
          >
            <ArrowLeft size={18} strokeWidth={2} aria-hidden />
            목록으로
          </button>
        </div>

        <div className={detail.detailHeader}>
          <div className={detail.detailHeaderTop}>
            <span
              className={clsx(
                detail.detailBadge,
                notice.noticeScope === 'system'
                  ? detail.detailBadgeSystem
                  : detail.detailBadgePharma,
              )}
            >
              {scopeLabel}
            </span>
            {canEdit && (
              <div className={shared.editButtonWrap}>
                <Button variant="primary" size="default" type="button" onClick={handleGoEdit}>
                  <Pencil size={20} strokeWidth={2} aria-hidden />
                  수정
                </Button>
              </div>
            )}
          </div>

          <h1 className={detail.detailTitle}>{notice.title}</h1>

          <div className={detail.detailMeta}>
            <span className={detail.detailAuthor}>{notice.author}</span>
            <span className={detail.detailDates}>
              작성 {notice.createdAt}
              {notice.updatedAt !== notice.createdAt && (
                <>
                  {' · '}
                  수정 {notice.updatedAt}
                </>
              )}
            </span>
          </div>
        </div>

        <div className={detail.detailContent}>
          <MarkdownPreviewLazy source={notice.content} />
        </div>
      </Column>
    </div>
  );
}
