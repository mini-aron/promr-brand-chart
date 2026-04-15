'use client';
import { useCallback, useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import { useDemoPlayStore } from '@/store/demoPlayStore';
import type { ContractDocumentRow } from '@/features/contract/ContractDocumentManagePage/types';
import { DOCUMENT_ITEMS, STATUS_LABEL } from '@/features/contract/mockData';
import { ContractImagePreviewModal } from '@/shared/components/ui/ContractImagePreviewModal';
import { DataTable } from '@/shared/components/ui/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import { CorpListSidebar, PageHeader } from '@/shared/components/layout';
import * as s from './index.css';
import {
  DEMO_CONTRACT_DOCUMENT_FILE_URLS,
  getCorpOwnContractDocumentRow,
  getDirectChildContractDocumentRowsByCorpId,
} from '@/features/contract/lib/contractManagementMock';

export function DealerViewPage() {
  const corporations = useDemoPlayStore((s) => s.corporations);
  const [selectedCorpId, setSelectedCorpId] = useState<string | null>(corporations[0]?.id ?? null);
  const [corpSearch, setCorpSearch] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');

  const filteredCorps = useMemo(() => {
    const query = corpSearch.trim().toLowerCase();
    if (!query) return corporations;
    return corporations.filter((c) => c.name.toLowerCase().includes(query));
  }, [corporations, corpSearch]);

  const selectedCorp = useMemo(
    () => corporations.find((c) => c.id === selectedCorpId),
    [corporations, selectedCorpId],
  );

  const dealerCountByCorpId = useMemo(() => {
    const map = new Map<string, number>();
    corporations.forEach((c) => {
      map.set(c.id, getDirectChildContractDocumentRowsByCorpId(c.id).length);
    });
    return map;
  }, [corporations]);

  const reentrustFlagByCorpId = useMemo(() => {
    const map = new Map<string, boolean>();
    corporations.forEach((c) => {
      map.set(c.id, (dealerCountByCorpId.get(c.id) ?? 0) > 0);
    });
    return map;
  }, [corporations, dealerCountByCorpId]);

  const subCsoRows = useMemo(() => {
    return getDirectChildContractDocumentRowsByCorpId(selectedCorpId);
  }, [selectedCorpId]);

  const corpOwnRow = useMemo(() => getCorpOwnContractDocumentRow(selectedCorpId), [selectedCorpId]);

  /** 사이드바「재」배지(재위탁처 보유) 법인은 직접 계약 행에서 재위탁계약서 미제출 허용 */
  const corpOwnSubcontractExempt = useMemo(() => {
    if (!selectedCorpId) return false;
    return reentrustFlagByCorpId.get(selectedCorpId) === true;
  }, [selectedCorpId, reentrustFlagByCorpId]);

  const handleCorpSelect = useCallback((corpId: string) => {
    setSelectedCorpId(corpId);
  }, []);

  const handlePreview = useCallback((url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
  }, []);

  const openDocPreview = useCallback(
    (row: ContractDocumentRow, docKey: keyof ContractDocumentRow['documents']) => {
      const url = row.documentUrls?.[docKey] ?? DEMO_CONTRACT_DOCUMENT_FILE_URLS[docKey];
      const label = DOCUMENT_ITEMS.find((i) => i.key === docKey)?.label ?? String(docKey);
      handlePreview(url, `${row.csoName} · ${label}`);
    },
    [handlePreview],
  );

  const closePreviewModal = useCallback(() => {
    setPreviewUrl(null);
    setPreviewTitle('');
  }, []);

  const contractColumnHelper = createColumnHelper<ContractDocumentRow>();
  /** 직접 계약·재위탁처 공통(등록 서류 면제 로직은 직접 계약 행에만 적용) */
  const contractColumnsShared = useMemo(() => {
    return [
      contractColumnHelper.accessor('contractDate', { header: '계약일' }),
      contractColumnHelper.accessor('expiryDate', { header: '만료일' }),
      contractColumnHelper.accessor('status', {
        header: '상태',
        cell: (info) => {
          const v = info.getValue();
          return <span className={s.contractStatusBadge[v]}>{STATUS_LABEL[v]}</span>;
        },
      }),
      contractColumnHelper.display({
        id: 'registeredDocs',
        header: '등록 서류',
        size: 380,
        minSize: 300,
        meta: { className: s.docBadgeCell },
        cell: ({ row }) => {
          const r = row.original;
          const docs = r.documents;
          const isCorpOwnRow = corpOwnRow != null && r.id === corpOwnRow.id;
          /** 재위탁처 행에는 재위탁계약서 항목 자체를 두지 않음(직접 계약 행만 네 종류) */
          const docItemsForRow = isCorpOwnRow
            ? DOCUMENT_ITEMS
            : DOCUMENT_ITEMS.filter((item) => item.key !== 'subcontractContract');
          return (
            <div className={s.contractDocBadgeRow}>
              {docItemsForRow.map((item) => {
                const hasDoc = docs[item.key];
                const exemptSubcontract =
                  isCorpOwnRow &&
                  corpOwnSubcontractExempt &&
                  item.key === 'subcontractContract' &&
                  !hasDoc;
                if (exemptSubcontract) {
                  return (
                    <span
                      key={item.key}
                      className={s.docBadgeExempt}
                      title="재위탁 대상 법인은 생략 가능"
                    >
                      {item.label} 면제
                    </span>
                  );
                }
                return hasDoc ? (
                  <button
                    key={item.key}
                    type="button"
                    className={s.docBadgeYesBtn}
                    aria-label={`${item.label} 미리보기`}
                    title="미리보기"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDocPreview(r, item.key);
                    }}
                  >
                    <span className={s.docBadgeYesBtnInner}>
                      <span className={s.docBadgeYesBtnLabel}>{item.label}</span>
                      <span className={s.docBadgeYesBtnIcon}>
                        <Eye size={14} strokeWidth={2} aria-hidden />
                      </span>
                    </span>
                  </button>
                ) : (
                  <span key={item.key} className={s.docBadgeNo}>
                    {item.label}
                  </span>
                );
              })}
            </div>
          );
        },
      }),
    ];
  }, [contractColumnHelper, corpOwnRow, corpOwnSubcontractExempt, openDocPreview]);

  /** 상단: 법인 직접 계약 — CSO명 없음 */
  const contractColumnsOwn = contractColumnsShared;

  /** 재위탁처: CSO명 포함 */
  const contractColumnsSub = useMemo(
    () => [contractColumnHelper.accessor('csoName', { header: 'CSO명' }), ...contractColumnsShared],
    [contractColumnHelper, contractColumnsShared],
  );

  return (
    <div className={s.page}>
      <PageHeader
        title="법인별 계약 조회"
        description="법인별 직접 계약·재위탁처 계약을 조회하고, 등록 서류를 미리보기할 수 있습니다."
      />

      <div className={s.layoutWrap}>
        <CorpListSidebar
          corporations={filteredCorps}
          selectedCorpId={selectedCorpId}
          corpSearch={corpSearch}
          onSelectCorp={handleCorpSelect}
          onCorpSearchChange={setCorpSearch}
          countByCorpId={dealerCountByCorpId}
          reentrustFlagByCorpId={reentrustFlagByCorpId}
          searchInputId="dealer-view-corp-search"
        />

        <div className={s.mainArea}>
          <div className={s.contentWrap}>
            <div className={s.contentHeader}>
              <div>
                <h2>
                  {selectedCorp?.name ?? '법인 선택'}
                  {selectedCorp?.isPromr && <span className={s.promrBadge}>프로엠알</span>}
                </h2>
              </div>
            </div>

            <div className={s.contentTablesWrap}>
              {selectedCorp && (
                <>
                  <div className={s.subCsoSection}>
                    {corpOwnRow ? (
                      <DataTable<ContractDocumentRow>
                        columns={contractColumnsOwn}
                        data={[corpOwnRow]}
                        getRowId={(r) => r.id}
                        variant="plain"
                      />
                    ) : (
                      <div className={s.emptyStateInline}>
                        데모 매핑이 없는 법인이거나, 등록된 직접 계약 행이 없습니다.
                      </div>
                    )}
                  </div>

                  <div className={s.subCsoSection}>
                    <h3 className={s.subCsoTitle}>
                      재위탁처
                      {subCsoRows.length > 0 ? (
                        <span className={s.dealerCountBadge}>{subCsoRows.length}</span>
                      ) : null}
                    </h3>
                    {subCsoRows.length > 0 ? (
                      <DataTable<ContractDocumentRow>
                        columns={contractColumnsSub}
                        data={subCsoRows}
                        getRowId={(r) => r.id}
                        variant="plain"
                      />
                    ) : (
                      <div className={s.emptyStateInline}>재위탁처가 없습니다.</div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {previewUrl && (
        <ContractImagePreviewModal
          previewUrl={previewUrl}
          previewTitle={previewTitle}
          onClose={closePreviewModal}
        />
      )}
    </div>
  );
}
