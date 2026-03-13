'use client';
import { useCallback, useMemo, useState } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import { mockCorporations, mockDealers } from '@/store/mockData';
import type { Dealer } from '@/types';
import { Button } from '@/components/Common/Button';
import { DataTable } from '@/components/Common/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import { PageHeader } from '@/components/Layout';
import * as s from './index.css';

export function DealerViewPage() {
  const corporations = mockCorporations;
  const dealers = mockDealers;
  const [selectedCorpId, setSelectedCorpId] = useState<string | null>(corporations[0]?.id ?? null);
  const [corpSearch, setCorpSearch] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');

  const filteredCorps = useMemo(() => {
    const query = corpSearch.trim().toLowerCase();
    if (!query) return corporations;
    return corporations.filter((c) => c.name.toLowerCase().includes(query));
  }, [corporations, corpSearch]);

  const dealersForCorp = useMemo(() => {
    if (!selectedCorpId) return [];
    return dealers.filter((d) => d.corporationId === selectedCorpId);
  }, [dealers, selectedCorpId]);

  const selectedCorp = useMemo(
    () => corporations.find((c) => c.id === selectedCorpId),
    [corporations, selectedCorpId]
  );

  const dealerCountByCorpId = useMemo(() => {
    const map = new Map<string, number>();
    dealers.forEach((d) => {
      map.set(d.corporationId, (map.get(d.corporationId) || 0) + 1);
    });
    return map;
  }, [dealers]);

  const handleCorpSelect = useCallback((corpId: string) => {
    setSelectedCorpId(corpId);
  }, []);

  const handlePreview = useCallback((url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
  }, []);

  const closePreviewModal = useCallback(() => {
    setPreviewUrl(null);
    setPreviewTitle('');
  }, []);

  const columnHelper = createColumnHelper<Dealer>();
  const columns = useMemo(() => {
    const renderFileCell = (url: string | undefined, title: string) => {
      if (url) {
        return (
          <div className={s.fileActionGroup}>
            <button type="button" className={s.linkButton} onClick={() => handlePreview(url, title)}>
              미리보기
            </button>
            <span className={s.separator}>|</span>
            <a href={url} download className={s.linkStyles}>다운로드</a>
          </div>
        );
      }
      return '-';
    };
    return [
      columnHelper.accessor('salespersonName', { header: '영업사원명' }),
      columnHelper.accessor('phone', { header: '전화번호' }),
      columnHelper.accessor('email', { header: '이메일' }),
      columnHelper.display({
        id: 'reportCert',
        header: '신고필증',
        cell: (info) => renderFileCell(info.row.original.reportCertUrl, '신고필증 미리보기'),
      }),
      columnHelper.display({
        id: 'contract',
        header: '계약서',
        cell: (info) => renderFileCell(info.row.original.contractUrl, '계약서 미리보기'),
      }),
      columnHelper.display({
        id: 'subcontractContract',
        header: '재위탁계약서',
        cell: (info) => renderFileCell(info.row.original.subcontractContractUrl, '재위탁계약서 미리보기'),
      }),
      columnHelper.display({
        id: 'businessLicense',
        header: '사업자 등록증',
        cell: (info) => renderFileCell(info.row.original.businessLicenseUrl, '사업자 등록증 미리보기'),
      }),
      columnHelper.accessor('createdAt', {
        header: '등록일',
        cell: (info) => info.getValue().slice(0, 10),
      }),
    ];
  }, [columnHelper, handlePreview]);


  return (
    <div className={s.page}>
      <PageHeader
        title="법인별 계약 조회"
        description="법인별 딜러(영업사원) 계약 정보를 조회합니다."
      />

      <div className={s.layoutWrap}>
        <aside className={s.corpListSidebar}>
          <div className="corp-search">
            <input
              type="search"
              placeholder="법인명 검색"
              value={corpSearch}
              onChange={(e) => setCorpSearch(e.target.value)}
              aria-label="법인 검색"
            />
          </div>
          <div className="corp-list">
            {filteredCorps.map((corp) => {
              const dealerCount = dealerCountByCorpId.get(corp.id) || 0;
              return (
                <button
                  key={corp.id}
                  type="button"
                  data-active={selectedCorpId === corp.id}
                  onClick={() => handleCorpSelect(corp.id)}
                >
                  {corp.name}
                  {corp.isPromr && <span className={s.promrBadge}>프로엠알</span>}
                  {dealerCount > 0 && (
                    <span className={s.dealerCountBadge}>{dealerCount}</span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        <div className={s.mainArea}>
          <div className={s.contentWrap}>
            <div className={s.contentHeader}>
              <div>
                <h2>
                  {selectedCorp?.name ?? '법인 선택'}
                  {selectedCorp?.isPromr && <span className={s.promrBadge}>프로엠알</span>}
                </h2>
                <p>
                  {dealersForCorp.length > 0
                    ? `총 ${dealersForCorp.length}명의 딜러가 등록되어 있습니다.`
                    : '등록된 딜러가 없습니다.'}
                </p>
              </div>
              {selectedCorp && dealersForCorp.length > 0 && (
                <Button variant="secondary" className={s.buttonShrink} disabled>
                  법인별 전체 다운로드
                </Button>
              )}
            </div>

            {dealersForCorp.length > 0 ? (
              <DataTable<Dealer>
                columns={columns}
                data={dealersForCorp}
                getRowId={(d) => d.id}
                variant="sticky"
              />
            ) : (
              <div className={s.emptyState}>
                {selectedCorp ? '등록된 딜러가 없습니다.' : '법인을 선택하세요.'}
              </div>
            )}
          </div>
        </div>
      </div>

      {previewUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="preview-modal-title"
          className={s.modalOverlay}
          onClick={closePreviewModal}
        >
          <div className={s.previewModalBox} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalHeader}>
              <h2 id="preview-modal-title">{previewTitle}</h2>
              <Button variant="ghost" size="icon" onClick={closePreviewModal} aria-label="닫기"><HiOutlineX size={18} /></Button>
            </div>
            <div className={s.previewContent}>
              <img src={previewUrl} alt={previewTitle} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
