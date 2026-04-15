'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createColumnHelper } from '@tanstack/react-table';
import { clsx } from 'clsx';
import { page } from '@/style/PageStyles.css';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { DataTable } from '@/shared/components/ui/DataTable';
import { Column } from '@/shared/components/ui/Flex';
import { useApp } from '@/store/appStore';
import { useDemoPlayStore } from '@/store/demoPlayStore';
import type { Notice } from '@/types';
import * as s from './index.css';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';
import { Search } from 'lucide-react';
import { SingleSelect } from '@/shared/components/ui/Select';

export type NoticeListScopeMode = 'system' | 'dual';
export type PharmaNoticeScope = 'single' | 'linked';

type NoticeListPageProps = {
  detailBasePath?: string;
  scopeMode?: NoticeListScopeMode;
  /** `scopeMode === 'dual'` 이고 제약사 공지 탭일 때 제약사 필터 방식 */
  pharmaNoticeScope?: PharmaNoticeScope;
  /** `scopeMode === 'system'` 일 때만(관리자 시스템 공지 작성) */
  composerHref?: string;
  description?: string;
};

export function NoticeListPage({
  detailBasePath = '/corporation/upload/notice',
  scopeMode = 'system',
  pharmaNoticeScope = 'single',
  composerHref,
  description = '공지와 안내를 확인하세요.',
}: NoticeListPageProps) {
  const router = useRouter();
  const { currentPharmaId, userRole, currentCorporationId } = useApp();
  const mockNotices = useDemoPlayStore((st) => st.notices);
  const corpInvitations = useDemoPlayStore((st) => st.corpInvitations);
  const pharmas = useDemoPlayStore((st) => st.pharmas);
  const [searchDraft, setSearchDraft] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [listTab, setListTab] = useState<'system' | 'pharma'>('pharma');

  const linkedPharmas = useMemo(() => {
    if (pharmaNoticeScope !== 'linked') return [];
    const idSet = new Set(
      corpInvitations
        .filter((i) => i.corporationId === currentCorporationId && i.status === 'accepted')
        .map((i) => i.pharmaId),
    );
    return pharmas.filter((p) => idSet.has(p.id));
  }, [pharmaNoticeScope, corpInvitations, currentCorporationId, pharmas]);

  const [linkedPharmaNoticeId, setLinkedPharmaNoticeId] = useState<string | null>(null);

  useEffect(() => {
    if (pharmaNoticeScope !== 'linked') return;
    const ids = linkedPharmas.map((p) => p.id);
    if (ids.length === 0) {
      setLinkedPharmaNoticeId(null);
      return;
    }
    setLinkedPharmaNoticeId((prev) => {
      if (prev && ids.includes(prev)) return prev;
      if (currentPharmaId && ids.includes(currentPharmaId)) return currentPharmaId;
      return ids[0];
    });
  }, [pharmaNoticeScope, linkedPharmas, currentPharmaId]);

  const applySearch = useCallback(() => {
    setSearchQuery(searchDraft.trim());
  }, [searchDraft]);

  const scopeFiltered = useMemo(() => {
    if (scopeMode === 'system') {
      return mockNotices.filter((n) => n.noticeScope === 'system');
    }
    if (listTab === 'system') {
      return mockNotices.filter((n) => n.noticeScope === 'system');
    }
    const pid = pharmaNoticeScope === 'linked' ? linkedPharmaNoticeId : currentPharmaId;
    if (!pid) return [];
    return mockNotices.filter((n) => n.noticeScope === 'pharma' && n.pharmaId === pid);
  }, [mockNotices, scopeMode, listTab, currentPharmaId, pharmaNoticeScope, linkedPharmaNoticeId]);

  const filteredNotices = useMemo(() => {
    if (!searchQuery) return scopeFiltered;
    const q = searchQuery.toLowerCase();
    return scopeFiltered.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.author.toLowerCase().includes(q) ||
        String(n.no).includes(q),
    );
  }, [scopeFiltered, searchQuery]);

  const columnHelper = createColumnHelper<Notice>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('no', {
        header: 'No.',
        size: 30,
        enableSorting: true,
        meta: { className: s.colNo },
      }),
      columnHelper.accessor('title', {
        header: '제목',
        meta: { className: s.colTitle },
        cell: (info) => <span className={s.colTitleText}>{info.getValue()}</span>,
      }),
      columnHelper.accessor('author', {
        header: '작성자',
        size: 120,
        cell: (info) => <span className={s.colMuted}>{info.getValue()}</span>,
      }),
      columnHelper.accessor('createdAt', {
        header: '작성일',
        size: 112,
        cell: (info) => <span className={s.colMuted}>{info.getValue()}</span>,
      }),
    ],
    [columnHelper],
  );

  const handleRowClick = (row: Notice) => {
    router.push(`${detailBasePath}/${row.id}`);
  };

  const showPharmaComposer = scopeMode === 'dual' && listTab === 'pharma' && userRole === 'pharma';
  const showToolbarCompose = (composerHref != null && composerHref !== '') || showPharmaComposer;

  const showCorpPharmaPicker =
    scopeMode === 'dual' && listTab === 'pharma' && pharmaNoticeScope === 'linked';

  const toolbarAndTable = (
    <>
      <div className={s.toolBarRow}>
        <div className={s.toolBarLeft}>
          {showCorpPharmaPicker && (
            <div className={s.pharmaToolbarField}>
              <span className={s.pharmaToolbarLabel}>제약사</span>
              {linkedPharmas.length === 0 ? (
                <span className={s.pharmaToolbarEmpty}>연결된 제약사가 없습니다.</span>
              ) : (
                <div className={s.pharmaSelectWrap}>
                  <SingleSelect
                    options={linkedPharmas.map((p) => ({ label: p.name, value: p.id }))}
                    selected={linkedPharmaNoticeId}
                    onChange={(v) => setLinkedPharmaNoticeId(String(v))}
                    aria-label="제약사별 공지 보기"
                    size="default"
                  />
                </div>
              )}
            </div>
          )}
          <div className={s.searchCluster}>
            <div className={s.searchInputWrap}>
              <Input
                size="default"
                id="notice-search"
                type="search"
                placeholder="검색"
                value={searchDraft}
                onChange={(e) => setSearchDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    applySearch();
                  }
                }}
                aria-label="공지 검색 (제목·작성자)"
              />
            </div>
            <Button variant="secondary" size="default" type="button" onClick={applySearch}>
              조회
              <Search size={16} strokeWidth={2} className={s.searchIcon} aria-hidden />
            </Button>
          </div>
        </div>
        {showToolbarCompose && (
          <div className={s.actionGroup}>
            {scopeMode === 'dual' && showPharmaComposer && (
              <Link href="/pharma/notices/new">
                <Button variant="primary" size="default">
                  작성
                </Button>
              </Link>
            )}
            {scopeMode === 'system' && composerHref != null && composerHref !== '' && (
              <Link href={composerHref}>
                <Button variant="primary" size="default">
                  작성
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
      <DataTable<Notice>
        columns={columns}
        data={filteredNotices}
        getRowId={(r) => r.id}
        variant="default"
        className={s.noticeTableWrap}
        onRowClick={handleRowClick}
        emptyMessage={searchQuery ? '검색 결과가 없습니다.' : '등록된 공지사항이 없습니다.'}
      />
    </>
  );

  return (
    <div className={page}>
      <PageHeader title="공지사항" description={description} />
      <Column className={s.mainColumn}>
        {scopeMode === 'dual' && (
          <div className={s.tabRow} role="tablist" aria-label="공지 구분">
            <button
              type="button"
              role="tab"
              aria-selected={listTab === 'pharma'}
              className={clsx(s.tab, listTab === 'pharma' && s.tabActive)}
              onClick={() => setListTab('pharma')}
            >
              제약사 공지사항
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={listTab === 'system'}
              className={clsx(s.tab, listTab === 'system' && s.tabActive)}
              onClick={() => setListTab('system')}
            >
              시스템 공지사항
            </button>
          </div>
        )}
        {toolbarAndTable}
      </Column>
    </div>
  );
}

/** @deprecated `NoticeListPage` 사용 */
export const UploadNoticePage = NoticeListPage;
