'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Eye } from 'lucide-react';
import {
  getContractRequest,
  getReEntrusContractList,
  getUploadedContractList,
} from '@/api/services/contractService';
import { clsx } from 'clsx';
import { Button } from '@/shared/components/ui/Button';
import { ContractImagePreviewModal } from '@/shared/components/ui/ContractImagePreviewModal';
import { ContractRequestModal } from '@/shared/components/ui/ContractRequestModal';
import { DataTable } from '@/shared/components/ui/DataTable';
import { FileInput } from '@/shared/components/ui/Input';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import { createColumnHelper } from '@tanstack/react-table';
import * as s from './index.css';
import {
  formatRelativeTime,
  buildImageUrl,
} from '@/features/contract/ContractReviewPage/lib/utils';
import type {
  ContractRequestResponse,
  ContractStatus,
  GetReEntrusContractListResponse,
  GetUploadedContractListResponse,
} from '@/types/services/contractService';

type DealerTab = 'contract' | 'reentrust';
type ContractSubTab = 'uploaded' | 'requests';
type OwnDocumentKey = 'reportCert' | 'businessLicense' | 'csoTrainingCert';
type ReentrustListItem = GetReEntrusContractListResponse['list'][number];
type UploadedContractListItem = GetUploadedContractListResponse['list'][number];

type RequestListItem = {
  id: string;
  alias?: string;
  channel: string;
  requestUrl: string;
  status: string;
  receivedAt: string;
};

const DEALER_TABS: Array<{ key: DealerTab; label: string }> = [
  { key: 'contract', label: '계약서' },
  { key: 'reentrust', label: '재위탁' },
];

const CONTRACT_SUB_TABS: Array<{ key: ContractSubTab; label: string }> = [
  { key: 'uploaded', label: '내 계약서' },
  { key: 'requests', label: '계약서 요청 목록' },
];

const OWN_DOCUMENT_ITEMS: { key: OwnDocumentKey; label: string }[] = [
  { key: 'reportCert', label: '신고필증' },
  { key: 'businessLicense', label: '사업자등록증' },
  { key: 'csoTrainingCert', label: 'CSO 교육이수증' },
];

const STATIC_SIGNUP_URL_PATH = '/signup';

const CONTRACT_API_STATUS_TO_LABEL: Record<ContractStatus, string> = {
  REQUESTED: '요청중',
  SUBMITTED: '제출완료',
  APPROVED: '승인',
  REJECTED: '반려',
  RESUBMIT_REQUESTED: '재제출요청',
};

const REQUEST_LIST_STATUS_BADGE: Record<string, 'complete' | 'warning' | 'error'> = {
  요청중: 'warning',
  제출완료: 'warning',
  승인: 'complete',
  반려: 'error',
  재제출요청: 'warning',
};

const CONTRACT_STATUS_BADGE: Record<ContractStatus, 'complete' | 'warning' | 'error'> = {
  REQUESTED: 'warning',
  SUBMITTED: 'warning',
  APPROVED: 'complete',
  REJECTED: 'error',
  RESUBMIT_REQUESTED: 'warning',
};

const requestItemColHelper = createColumnHelper<RequestListItem>();
const reentrustColHelper = createColumnHelper<ReentrustListItem>();
const uploadedContractColHelper = createColumnHelper<UploadedContractListItem>();

function formatRequestUrlForDisplay(url: string): string {
  if (typeof window === 'undefined') return url;
  if (url.startsWith('/')) return `${window.location.origin}${url}`;
  return url;
}

function mapContractRequestResponseToItem(res: ContractRequestResponse): RequestListItem {
  const channel = res.sendType === 'EMAIL' ? '이메일' : '카카오톡';
  const requestUrl =
    typeof window === 'undefined'
      ? `${STATIC_SIGNUP_URL_PATH}?contractRequestId=${String(res.contractRequestId)}`
      : `${window.location.origin}${STATIC_SIGNUP_URL_PATH}?contractRequestId=${String(
          res.contractRequestId,
        )}`;

  return {
    id: String(res.contractRequestId),
    alias: res.alias,
    channel,
    requestUrl,
    status: CONTRACT_API_STATUS_TO_LABEL[res.contractStatus],
    receivedAt: res.createdAt,
  };
}

export function DealerManagePage() {
  const [activeTab, setActiveTab] = useState<DealerTab>('contract');
  const [contractSubTab, setContractSubTab] = useState<ContractSubTab>('uploaded');
  const [corpOwnDocUploads, setCorpOwnDocUploads] = useState<
    Partial<Record<OwnDocumentKey, string>>
  >({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState('');
  const [requestItems, setRequestItems] = useState<RequestListItem[]>([]);
  const [requestListLoading, setRequestListLoading] = useState(false);
  const [requestListError, setRequestListError] = useState<string | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [uploadedContractItems, setUploadedContractItems] = useState<UploadedContractListItem[]>(
    [],
  );
  const [uploadedContractLoading, setUploadedContractLoading] = useState(false);
  const [uploadedContractError, setUploadedContractError] = useState<string | null>(null);
  const [reentrustItems, setReentrustItems] = useState<ReentrustListItem[]>([]);
  const [reentrustLoading, setReentrustLoading] = useState(false);
  const [reentrustError, setReentrustError] = useState<string | null>(null);
  const [selectedPharmaceuticalName, setSelectedPharmaceuticalName] = useState<string | null>(null);
  const blobUrlsRef = useRef<string[]>([]);

  useEffect(() => {
    const urls = blobUrlsRef.current;
    return () => {
      urls.forEach(URL.revokeObjectURL);
    };
  }, []);

  const handleCorpOwnDocUpload = useCallback((docKey: OwnDocumentKey, file: File) => {
    const url = URL.createObjectURL(file);
    blobUrlsRef.current.push(url);
    setCorpOwnDocUploads((prev) => ({ ...prev, [docKey]: url }));
  }, []);

  const handlePreview = useCallback((url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
  }, []);

  const closePreviewModal = useCallback(() => {
    setPreviewUrl(null);
    setPreviewTitle('');
  }, []);

  const fetchContractRequestList = useCallback(async () => {
    setRequestListLoading(true);
    setRequestListError(null);
    try {
      const { data } = await getContractRequest();
      setRequestItems(data.list.map(mapContractRequestResponseToItem));
    } catch {
      setRequestListError('계약서 요청 목록을 불러오지 못했습니다.');
    } finally {
      setRequestListLoading(false);
    }
  }, []);

  const fetchUploadedContractList = useCallback(async () => {
    setUploadedContractLoading(true);
    setUploadedContractError(null);
    try {
      const { data } = await getUploadedContractList();
      setUploadedContractItems(data.list);
    } catch {
      setUploadedContractError('업로드한 계약서 목록을 불러오지 못했습니다.');
    } finally {
      setUploadedContractLoading(false);
    }
  }, []);

  const fetchReentrustList = useCallback(async () => {
    setReentrustLoading(true);
    setReentrustError(null);
    try {
      const { data } = await getReEntrusContractList();
      setReentrustItems(data.list);
    } catch {
      setReentrustError('재위탁 목록을 불러오지 못했습니다.');
    } finally {
      setReentrustLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab !== 'contract' || contractSubTab !== 'uploaded') return;
    void fetchUploadedContractList();
  }, [activeTab, contractSubTab, fetchUploadedContractList]);

  useEffect(() => {
    if (activeTab !== 'contract' || contractSubTab !== 'requests') return;
    void fetchContractRequestList();
  }, [activeTab, contractSubTab, fetchContractRequestList]);

  useEffect(() => {
    if (activeTab !== 'reentrust') return;
    void fetchReentrustList();
  }, [activeTab, fetchReentrustList]);

  const reentrustPharmaceuticalNames = useMemo(
    () => Array.from(new Set(reentrustItems.map((item) => item.pharmaceuticalName))),
    [reentrustItems],
  );

  useEffect(() => {
    if (
      selectedPharmaceuticalName &&
      reentrustPharmaceuticalNames.includes(selectedPharmaceuticalName)
    ) {
      return;
    }
    setSelectedPharmaceuticalName(reentrustPharmaceuticalNames[0] ?? null);
  }, [reentrustPharmaceuticalNames, selectedPharmaceuticalName]);

  const selectedReentrustRows = useMemo(() => {
    if (!selectedPharmaceuticalName) return reentrustItems;
    return reentrustItems.filter((item) => item.pharmaceuticalName === selectedPharmaceuticalName);
  }, [reentrustItems, selectedPharmaceuticalName]);

  const reentrustCountByPharmaceutical = useMemo(() => {
    const countMap = new Map<string, number>();
    reentrustItems.forEach((item) => {
      countMap.set(item.pharmaceuticalName, (countMap.get(item.pharmaceuticalName) ?? 0) + 1);
    });
    return countMap;
  }, [reentrustItems]);

  const requestItemColumns = useMemo(
    () => [
      requestItemColHelper.display({
        id: 'alias',
        header: '요청명',
        size: 180,
        cell: ({ row }) => (
          <span style={{ fontWeight: 600, fontSize: 13 }}>
            {row.original.alias || '계약서 요청'}
          </span>
        ),
      }),
      requestItemColHelper.accessor('channel', {
        header: '채널',
        size: 100,
      }),
      requestItemColHelper.display({
        id: 'requestUrl',
        header: '요청 링크',
        size: 320,
        cell: ({ row }) => {
          const url = row.original.requestUrl;
          return (
            <div className={s.requestLinkCell}>
              <span className={s.requestLinkText} title={formatRequestUrlForDisplay(url)}>
                {formatRequestUrlForDisplay(url)}
              </span>
            </div>
          );
        },
      }),
      requestItemColHelper.display({
        id: 'status',
        header: '상태',
        size: 100,
        cell: ({ row }) => (
          <span className={s.reentrustStatusBadge[REQUEST_LIST_STATUS_BADGE[row.original.status]]}>
            {row.original.status}
          </span>
        ),
      }),
      requestItemColHelper.display({
        id: 'receivedAt',
        header: '요청일',
        size: 110,
        cell: ({ row }) => (
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            {formatRelativeTime(row.original.receivedAt)}
          </span>
        ),
      }),
    ],
    [],
  );

  const uploadedContractColumns = useMemo(
    () => [
      uploadedContractColHelper.accessor('contracteeName', {
        header: '계약 상대',
        size: 180,
      }),
      uploadedContractColHelper.accessor('contractorName', {
        header: '계약 주체',
        size: 180,
      }),
      uploadedContractColHelper.accessor('startDate', {
        header: '시작일',
        size: 110,
      }),
      uploadedContractColHelper.accessor('endDate', {
        header: '종료일',
        size: 110,
      }),
      uploadedContractColHelper.display({
        id: 'registeredDocument',
        header: '등록서류',
        size: 100,
        cell: ({ row }) => {
          const fileName = row.original.contractFileName;
          const previewUrl = fileName ? buildImageUrl(fileName) : '';

          if (!previewUrl) {
            return <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>미등록</span>;
          }

          return (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="계약서 미리보기"
              onClick={() => handlePreview(previewUrl, `계약서 - ${fileName}`)}
            >
              <Eye size={14} strokeWidth={2} aria-hidden />
            </Button>
          );
        },
      }),
      uploadedContractColHelper.display({
        id: 'status',
        header: '상태',
        size: 100,
        cell: ({ row }) => (
          <span
            className={s.reentrustStatusBadge[CONTRACT_STATUS_BADGE[row.original.contractStatus]]}
          >
            {CONTRACT_API_STATUS_TO_LABEL[row.original.contractStatus]}
          </span>
        ),
      }),
      uploadedContractColHelper.display({
        id: 'createdAt',
        header: '등록일',
        size: 110,
        cell: ({ row }) => (
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            {formatRelativeTime(row.original.createdAt)}
          </span>
        ),
      }),
    ],
    [handlePreview],
  );

  const reentrustColumns = useMemo(
    () => [
      reentrustColHelper.accessor('contracteeName', {
        header: '위탁사명',
        size: 180,
      }),
      reentrustColHelper.accessor('contractorName', {
        header: '수탁사명',
        size: 140,
      }),
      reentrustColHelper.accessor('startDate', {
        header: '시작일',
        size: 110,
      }),
      reentrustColHelper.accessor('expireDate', {
        header: '종료일',
        size: 110,
      }),
      reentrustColHelper.display({
        id: 'status',
        header: '검토 상태',
        size: 100,
        cell: ({ row }) => (
          <span
            className={s.reentrustStatusBadge[CONTRACT_STATUS_BADGE[row.original.contractStatus]]}
          >
            {CONTRACT_API_STATUS_TO_LABEL[row.original.contractStatus]}
          </span>
        ),
      }),
    ],
    [],
  );

  return (
    <div className={s.page}>
      <PageHeader title="계약 관리" description="계약 정보를 조회하고 관리합니다." />

      <div className={s.pageBody}>
        <div className={s.contentWrap}>
          <div className={s.tabBar} role="tablist" aria-label="계약 관리 탭">
            {DEALER_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.key}
                className={clsx(s.tabBtn, activeTab === tab.key && s.tabBtnActive)}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'contract' && (
            <>
              <div className={s.subTabBar} role="tablist" aria-label="계약서 세부 탭">
                {CONTRACT_SUB_TABS.map((subTab) => (
                  <button
                    key={subTab.key}
                    type="button"
                    role="tab"
                    aria-selected={contractSubTab === subTab.key}
                    className={clsx(
                      s.subTabBtn,
                      contractSubTab === subTab.key && s.subTabBtnActive,
                    )}
                    onClick={() => setContractSubTab(subTab.key)}
                  >
                    {subTab.label}
                  </button>
                ))}
              </div>

              {contractSubTab === 'uploaded' && (
                <div className={s.myContractSplit}>
                  <div className={s.myContractTableArea}>
                    {uploadedContractLoading ? (
                      <p className={s.emptyMessage}>불러오는 중...</p>
                    ) : uploadedContractError ? (
                      <p className={s.emptyMessage}>{uploadedContractError}</p>
                    ) : uploadedContractItems.length > 0 ? (
                      <DataTable<UploadedContractListItem>
                        columns={uploadedContractColumns}
                        data={uploadedContractItems}
                        getRowId={(row) => String(row.id)}
                        className={s.dealerTableWrap}
                        variant="plain"
                      />
                    ) : (
                      <p className={s.emptyMessage}>등록된 계약서가 없습니다.</p>
                    )}
                  </div>
                  <aside className={s.myCorpDocsPanel} aria-label="자체 서류 관리">
                    <h3 className={s.corpOwnDocsTitle}>자체 서류 관리</h3>
                    <p className={s.corpOwnRailDesc}>
                      신고필증, 사업자등록증, CSO 교육이수증을 등록하고 확인합니다.
                    </p>
                    <div className={s.corpOwnTableWrap}>
                      <table className={s.corpOwnTable}>
                        <colgroup>
                          <col style={{ width: '36%' }} />
                          <col style={{ width: '24%' }} />
                          <col />
                        </colgroup>
                        <thead>
                          <tr>
                            <th className={s.corpOwnTh}>서류명</th>
                            <th className={s.corpOwnTh}>상태</th>
                            <th className={s.corpOwnTh}>관리</th>
                          </tr>
                        </thead>
                        <tbody>
                          {OWN_DOCUMENT_ITEMS.map((item) => {
                            const url = corpOwnDocUploads[item.key];
                            return (
                              <tr key={item.key}>
                                <td className={s.corpOwnTd}>{item.label}</td>
                                <td className={s.corpOwnTd}>
                                  {url ? (
                                    <span className={s.corpOwnStatusOk}>등록</span>
                                  ) : (
                                    <span className={s.corpOwnStatusNo}>미등록</span>
                                  )}
                                </td>
                                <td className={s.corpOwnTd}>
                                  <div className={s.corpOwnActionCell}>
                                    {url && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        aria-label={`${item.label} 미리보기`}
                                        onClick={() =>
                                          handlePreview(url, `자체 서류 - ${item.label}`)
                                        }
                                      >
                                        <Eye size={14} strokeWidth={2} aria-hidden />
                                      </Button>
                                    )}
                                    <label style={{ cursor: 'pointer' }}>
                                      <span
                                        className={url ? s.corpOwnStatusNo : s.corpOwnStatusOk}
                                        style={{ fontSize: 11 }}
                                      >
                                        {url ? '재업로드' : '업로드'}
                                      </span>
                                      <FileInput
                                        className={s.corpOwnFileInputHidden}
                                        accept="image/*,.pdf"
                                        onChange={(file) => {
                                          if (file && !Array.isArray(file)) {
                                            handleCorpOwnDocUpload(item.key, file);
                                          }
                                        }}
                                      />
                                    </label>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </aside>
                </div>
              )}

              {contractSubTab === 'requests' && (
                <>
                  <div className={s.subTabActionRow}>
                    <Button
                      type="button"
                      variant="primary"
                      size="default"
                      onClick={() => setIsRequestModalOpen(true)}
                    >
                      계약서 요청
                    </Button>
                  </div>
                  <div className={s.contentTablesWrap}>
                    {requestListLoading ? (
                      <p className={s.emptyMessage}>불러오는 중...</p>
                    ) : requestListError ? (
                      <p className={s.emptyMessage}>{requestListError}</p>
                    ) : requestItems.length > 0 ? (
                      <DataTable<RequestListItem>
                        columns={requestItemColumns}
                        data={requestItems}
                        getRowId={(row) => row.id}
                        className={s.dealerTableWrap}
                        variant="plain"
                      />
                    ) : (
                      <p className={s.emptyMessage}>계약서 요청 이력이 없습니다.</p>
                    )}
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === 'reentrust' && (
            <div className={s.reentrustLayout}>
              <aside className={s.reentrustPharmacyList} aria-label="제약사 목록">
                {reentrustLoading ? (
                  <p className={s.emptyMessage}>불러오는 중...</p>
                ) : reentrustPharmaceuticalNames.length > 0 ? (
                  reentrustPharmaceuticalNames.map((name) => (
                    <button
                      key={name}
                      type="button"
                      className={clsx(
                        s.reentrustPharmacyItem,
                        selectedPharmaceuticalName === name && s.reentrustPharmacyItemActive,
                      )}
                      onClick={() => setSelectedPharmaceuticalName(name)}
                    >
                      <span>{name}</span>
                      <span className={s.reentrustPharmacyCount}>
                        {reentrustCountByPharmaceutical.get(name) ?? 0}
                      </span>
                    </button>
                  ))
                ) : (
                  <p className={s.emptyMessage}>등록된 제약사가 없습니다.</p>
                )}
              </aside>
              <div className={s.reentrustContent}>
                <header className={s.reentrustContentHeader}>
                  <div className={s.reentrustContentHeaderLeft}>
                    <h3 className={s.reentrustContentHeaderTitle}>
                      {selectedPharmaceuticalName ?? '위탁사'}
                    </h3>
                  </div>
                </header>
                <div className={s.reentrustContentBody}>
                  {reentrustLoading ? (
                    <p className={s.emptyMessage}>불러오는 중...</p>
                  ) : reentrustError ? (
                    <p className={s.emptyMessage}>{reentrustError}</p>
                  ) : selectedReentrustRows.length > 0 ? (
                    <DataTable<ReentrustListItem>
                      columns={reentrustColumns}
                      data={selectedReentrustRows}
                      getRowId={(row) => String(row.reEntrustContractId)}
                      className={s.dealerTableWrap}
                      variant="plain"
                    />
                  ) : (
                    <p className={s.emptyMessage}>등록된 재위탁 정보가 없습니다.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {previewUrl && (
        <ContractImagePreviewModal
          previewUrl={previewUrl}
          previewTitle={previewTitle}
          onClose={closePreviewModal}
        />
      )}

      {isRequestModalOpen && (
        <ContractRequestModal
          onClose={() => setIsRequestModalOpen(false)}
          onSuccess={() => void fetchContractRequestList()}
        />
      )}
    </div>
  );
}
