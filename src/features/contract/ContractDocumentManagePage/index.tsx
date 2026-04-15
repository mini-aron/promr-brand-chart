'use client';

import { useCallback, useMemo, useState } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import CardWrapper from '@/shared/components/layout/CardWrapper/CardWrapper';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { DataTable } from '@/shared/components/ui/DataTable';
import { Button } from '@/shared/components/ui/Button';
import { Row } from '@/shared/components/ui/Flex';
import { ContractUploadShareActions } from '@/shared/components/ui/ContractUploadShareActions';
import { useDemoPlayStore } from '@/store/demoPlayStore';
import { Input } from '@/shared/components/ui/Input';
import { SingleSelect, MultipleSelect } from '@/shared/components/ui/Select';
import * as s from './index.css';
import {
  DOCUMENT_ITEMS,
  mockContractDocumentRows,
  STATUS_LABEL,
} from '@/features/contract/mockData';
import type { ContractDocumentRow } from './types';
import { Download } from 'lucide-react';
import { getParentCsoNameByContractDocumentRowId } from '@/features/contract/lib/contractManagementMock';

export type { ContractDocumentRow, ContractDocumentStatus } from './types';

const columnHelper = createColumnHelper<ContractDocumentRow>();

const DOCUMENT_FILTER_OPTIONS = DOCUMENT_ITEMS.map((d) => ({
  label: d.label,
  value: d.key,
}));

export function ContractDocumentManagePage() {
  const dealers = useDemoPlayStore((st) => st.dealers);
  const demoShareTarget = useMemo(() => {
    const d = dealers.find((x) => x.corporationId === 'corp-1') ?? dealers[0];
    return d ? { organizationId: d.corporationId } : null;
  }, [dealers]);

  const [csoSearch, setCsoSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | number>('');
  const [docTypeFilter, setDocTypeFilter] = useState<(string | number)[]>([]);
  const [subcontractFilter, setSubcontractFilter] = useState<string | number>('');

  const filteredRows = useMemo(() => {
    const q = csoSearch.trim().toLowerCase();
    return mockContractDocumentRows.filter((row) => {
      if (q && !row.csoName.toLowerCase().includes(q)) return false;
      if (statusFilter !== '' && row.status !== statusFilter) return false;
      if (docTypeFilter.length > 0) {
        const keys = docTypeFilter.map(String) as (keyof ContractDocumentRow['documents'])[];
        if (!keys.every((k) => row.documents[k])) return false;
      }
      if (subcontractFilter !== '') {
        const wantYes = subcontractFilter === 'yes';
        if (row.subcontracting !== wantYes) return false;
      }
      return true;
    });
  }, [csoSearch, statusFilter, docTypeFilter, subcontractFilter]);

  const emptyMessage =
    filteredRows.length === 0 && mockContractDocumentRows.length > 0
      ? '조건에 맞는 계약서가 없습니다.'
      : '등록된 계약서가 없습니다.';

  const handleDownload = useCallback((row: ContractDocumentRow) => {
    alert(`${row.csoName} 계약서 다운로드는 추후 API 연동 예정입니다.`);
  }, []);

  const handleEdit = useCallback((row: ContractDocumentRow) => {
    alert(`${row.csoName} 계약서 수정은 추후 API 연동 예정입니다.`);
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.accessor('csoName', { header: 'CSO명' }),
      columnHelper.display({
        id: 'parentCsoName',
        header: '상위 CSO',
        cell: ({ row }) => {
          return <span>{getParentCsoNameByContractDocumentRowId(row.original.id)}</span>;
        },
      }),
      columnHelper.accessor('contractDate', { header: '계약일' }),
      columnHelper.accessor('expiryDate', { header: '만료일' }),
      columnHelper.accessor('status', {
        header: '상태',
        cell: (info) => {
          const v = info.getValue();
          return <span className={s.statusBadge[v]}>{STATUS_LABEL[v]}</span>;
        },
      }),
      columnHelper.display({
        id: 'registeredDocs',
        header: '등록 계약서',
        size: 380,
        minSize: 300,
        meta: { className: s.docBadgeCell },
        cell: ({ row }) => {
          const docs = row.original.documents;
          return (
            <div className={s.docBadgeRow}>
              {DOCUMENT_ITEMS.map((item) =>
                docs[item.key] ? (
                  <span key={item.key} className={s.docBadge}>
                    {item.label}
                  </span>
                ) : (
                  <span key={item.key} className={s.docBadgeMissing}>
                    {item.label}
                  </span>
                ),
              )}
            </div>
          );
        },
      }),
      columnHelper.accessor('subcontracting', {
        header: '재위탁여부',
        cell: (info) => {
          const v = info.getValue();
          return (
            <span className={v ? s.subcontractBadge.yes : s.subcontractBadge.no}>
              {v ? '예' : '아니오'}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: 'actions',
        header: '액션',
        meta: { className: s.actionCell },
        cell: ({ row }) => (
          <Row gap={6} alignItems="center">
            <Button
              variant="secondary"
              size="icon"
              type="button"
              aria-label="다운로드"
              title="다운로드"
              onClick={(e) => {
                e.stopPropagation();
                handleDownload(row.original);
              }}
            >
              <Download className={s.actionIconSvg} size={18} strokeWidth={2} aria-hidden />
            </Button>
            <Button
              variant="primary"
              size="small"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(row.original);
              }}
            >
              수정
            </Button>
          </Row>
        ),
      }),
    ],
    [handleDownload, handleEdit],
  );

  return (
    <div className={s.page}>
      <div className={s.pageTopRow}>
        <div className={s.pageHeaderLeft}>
          <PageHeader
            title="계약서 관리"
            description="계약서 목록을 조회하고 버전·상태를 관리합니다."
          />
        </div>
        {demoShareTarget && (
          <div className={s.pageHeaderActions}>
            <ContractUploadShareActions
              organizationId={demoShareTarget.organizationId}
              triggerVariant="primary"
              triggerSize="default"
            />
          </div>
        )}
      </div>
      <div className={s.filterSection}>
        <div className={s.filterRow}>
          <div className={s.filterField}>
            <label htmlFor="contract-doc-cso">CSO명</label>
            <Input
              id="contract-doc-cso"
              type="search"
              size="default"
              placeholder="CSO명 검색"
              value={csoSearch}
              onChange={(e) => setCsoSearch(e.target.value)}
              aria-label="CSO명"
            />
          </div>
          <div className={s.filterField}>
            <label htmlFor="contract-doc-status">상태</label>
            <SingleSelect
              id="contract-doc-status"
              options={[
                { label: '전체', value: '' },
                { label: STATUS_LABEL.valid, value: 'valid' },
                { label: STATUS_LABEL.expired, value: 'expired' },
              ]}
              selected={statusFilter}
              onChange={(v) => setStatusFilter(v)}
              placeholder="전체"
              aria-label="상태"
            />
          </div>
          <div className={s.filterField}>
            <label htmlFor="contract-doc-docs">등록 계약서</label>
            <MultipleSelect
              id="contract-doc-docs"
              options={DOCUMENT_FILTER_OPTIONS}
              selectedItems={docTypeFilter}
              onChange={setDocTypeFilter}
              placeholder="전체"
              aria-label="등록 계약서"
            />
          </div>
          <div className={s.filterField}>
            <label htmlFor="contract-doc-sub">재위탁여부</label>
            <SingleSelect
              id="contract-doc-sub"
              options={[
                { label: '전체', value: '' },
                { label: '예', value: 'yes' },
                { label: '아니오', value: 'no' },
              ]}
              selected={subcontractFilter}
              onChange={(v) => setSubcontractFilter(v)}
              placeholder="전체"
              aria-label="재위탁여부"
            />
          </div>
        </div>
      </div>
      <div className={s.tableSection}>
        <CardWrapper padding={0}>
          <div className={s.tableCardInner}>
            <DataTable<ContractDocumentRow>
              columns={columns}
              data={filteredRows}
              getRowId={(row) => row.id}
              emptyMessage={emptyMessage}
            />
          </div>
        </CardWrapper>
      </div>
    </div>
  );
}
