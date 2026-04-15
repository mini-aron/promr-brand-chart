'use client';

import { useCallback, useMemo, useState } from 'react';
import { useApp } from '@/store/appStore';
import { useDemoPlayStore } from '@/store/demoPlayStore';
import { Button } from '@/shared/components/ui/Button';
import { SingleSelect, HospitalSearchSelect } from '@/shared/components/ui/Select';
import { DataTable } from '@/shared/components/ui/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import type { FilterRequest } from '@/types';
import CardWrapper from '@/shared/components/layout/CardWrapper/CardWrapper';
import { PageHeader } from '@/shared/components/layout/PageHeader';
import * as s from './index.css';
import { Column, Row } from '@/shared/components/ui/Flex';

const STATUS_LABEL = {
  pending: '대기',
  approved: '승인',
  rejected: '승인불가',
} as Record<string, string>;

function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function FilterRequestPage() {
  const { currentCorporationId, currentPharmaId } = useApp();
  const pharmas = useDemoPlayStore((s) => s.pharmas);
  const hospitals = useDemoPlayStore((s) => s.hospitals);
  const filterRequests = useDemoPlayStore((s) => s.filterRequests);
  const setFilterRequests = useDemoPlayStore((s) => s.setFilterRequests);
  const addFilterRequest = useCallback(
    (
      corporationId: string,
      pharmaId: string,
      hospitalId: string,
      requestMessage?: string,
      status?: FilterRequest['status'],
    ) => {
      const id = `fr-${Date.now()}`;
      const now = new Date().toISOString().slice(0, 19);
      const newStatus = status ?? 'pending';
      const processedAt = newStatus !== 'pending' ? now : undefined;
      setFilterRequests((prev) => [
        ...prev,
        {
          id,
          corporationId,
          pharmaId,
          hospitalId,
          status: newStatus,
          requestedAt: now,
          requestMessage,
          processedAt,
          createdAt: now,
          updatedAt: newStatus !== 'pending' ? now : undefined,
          createdBy: 'admin',
          updatedBy: newStatus !== 'pending' ? 'admin' : undefined,
        },
      ]);
    },
    [setFilterRequests],
  );
  const addFilterRequestNewHospital = useCallback(
    (
      corporationId: string,
      pharmaId: string,
      payload: {
        hospitalName: string;
        businessNumber: string;
        address: string;
        representativeName: string;
        requestMessage?: string;
      },
    ) => {
      const id = `fr-${Date.now()}`;
      const requestedAt = new Date().toISOString().slice(0, 19);
      const hospitalId = `new-${id}`;
      setFilterRequests((prev) => [
        ...prev,
        {
          id,
          corporationId,
          pharmaId,
          hospitalId,
          status: 'pending' as const,
          requestedAt,
          hospitalName: payload.hospitalName,
          businessNumber: payload.businessNumber,
          address: payload.address,
          representativeName: payload.representativeName,
          requestMessage: payload.requestMessage,
          createdAt: requestedAt,
          createdBy: 'admin',
        },
      ]);
    },
    [setFilterRequests],
  );
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [successText, setSuccessText] = useState<string | null>(null);
  const [showNewHospitalModal, setShowNewHospitalModal] = useState(false);

  const [filterHospitalId, setFilterHospitalId] = useState<string | null>(null);
  const [filterPharmaId, setFilterPharmaId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const [newHospitalName, setNewHospitalName] = useState('');
  const [newBusinessNumber, setNewBusinessNumber] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newRepresentativeName, setNewRepresentativeName] = useState('');
  const [newRequestMessage, setNewRequestMessage] = useState('');

  const corporationHospitals = useMemo(
    () => hospitals.filter((h) => h.corporationId === currentCorporationId),
    [hospitals, currentCorporationId],
  );

  const hospitalOptions = useMemo(
    () =>
      corporationHospitals.map((h) => ({
        label: h.name,
        value: h.id,
        address: h.address,
        businessNumber: h.businessNumber,
      })),
    [corporationHospitals],
  );

  const filterHospitalOptions = useMemo(
    () => [{ label: '전체', value: '' as const }, ...hospitalOptions],
    [hospitalOptions],
  );

  const handleSubmitExisting = useCallback(() => {
    if (!selectedHospitalId || !currentPharmaId) return;
    addFilterRequest(
      currentCorporationId,
      currentPharmaId,
      selectedHospitalId,
      requestMessage.trim() || undefined,
    );
    setSuccessText('필터링 요청이 접수되었습니다. 제약사 승인 후 거래 가능 여부가 반영됩니다.');
    setSelectedHospitalId(null);
    setRequestMessage('');
  }, [currentCorporationId, currentPharmaId, selectedHospitalId, requestMessage, addFilterRequest]);

  const getHospital = useCallback((id: string) => hospitals.find((h) => h.id === id), [hospitals]);
  const getPharma = useCallback((id: string) => pharmas.find((p) => p.id === id), [pharmas]);

  const myRequests = useMemo(
    () =>
      filterRequests
        .filter((r) => r.corporationId === currentCorporationId)
        .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt)),
    [filterRequests, currentCorporationId],
  );

  const filteredMyRequests = useMemo(() => {
    return myRequests.filter((r) => {
      if (filterHospitalId != null && filterHospitalId !== '') {
        if (r.hospitalId !== filterHospitalId) return false;
      }
      if (filterPharmaId != null && filterPharmaId !== '') {
        if (r.pharmaId !== filterPharmaId) return false;
      }
      if (filterStatus != null && filterStatus !== '') {
        if (r.status !== filterStatus) return false;
      }
      return true;
    });
  }, [myRequests, filterHospitalId, filterPharmaId, filterStatus]);

  const columnHelper = createColumnHelper<FilterRequest>();
  const columns = useMemo(
    () => [
      columnHelper.accessor((r) => getHospital(r.hospitalId)?.name ?? r.hospitalName ?? '-', {
        id: 'hospital',
        header: '병의원',
      }),
      columnHelper.accessor(
        (r) => (r.pharmaId ? (getPharma(r.pharmaId)?.name ?? r.pharmaId) : '-'),
        { id: 'pharma', header: '제약사' },
      ),
      columnHelper.accessor('status', {
        header: '승인상태',
        cell: (info) => {
          const status = info.getValue();
          const badgeClass =
            status === 'pending' || status === 'approved' || status === 'rejected'
              ? s.statusBadge[status]
              : s.statusBadge.pending;
          return <span className={badgeClass}>{STATUS_LABEL[status] ?? status}</span>;
        },
      }),
      columnHelper.accessor('requestedAt', {
        header: '요청일시',
        cell: (info) => formatDateTime(info.getValue()),
      }),
    ],
    [columnHelper, getHospital, getPharma],
  );

  const handleSubmitNew = useCallback(() => {
    const name = newHospitalName.trim();
    const biz = newBusinessNumber.trim();
    const addr = newAddress.trim();
    const rep = newRepresentativeName.trim();
    if (!name || !biz || !addr || !rep) return;
    addFilterRequestNewHospital(currentCorporationId, currentPharmaId, {
      hospitalName: name,
      businessNumber: biz,
      address: addr,
      representativeName: rep,
      requestMessage: newRequestMessage.trim() || undefined,
    });
    setSuccessText('신규 병의원 추가 요청이 접수되었습니다. 제약사 검토 후 연락드립니다.');
    setNewHospitalName('');
    setNewBusinessNumber('');
    setNewAddress('');
    setNewRepresentativeName('');
    setNewRequestMessage('');
    setShowNewHospitalModal(false);
  }, [
    currentCorporationId,
    currentPharmaId,
    newHospitalName,
    newBusinessNumber,
    newAddress,
    newRepresentativeName,
    newRequestMessage,
    addFilterRequestNewHospital,
  ]);

  const canSubmitExisting = currentPharmaId && selectedHospitalId;

  const canSubmitNew =
    newHospitalName.trim() &&
    newBusinessNumber.trim() &&
    newAddress.trim() &&
    newRepresentativeName.trim();

  return (
    <div className={s.page}>
      <PageHeader
        title="필터링 요청"
        description="거래 허용이 필요한 병의원을 검색해 요청하세요. 제출 대상 제약사는 좌측 사이드바에서 선택합니다."
      />

      <div className={s.twoColLayout}>
        <Column>
          <div className={s.filterSection}>
            <div className={s.filterRow}>
              <div className={s.filterField}>
                <label htmlFor="filter-hospital">병원검색</label>
                <HospitalSearchSelect
                  id="filter-hospital"
                  options={filterHospitalOptions}
                  selected={filterHospitalId}
                  onChange={(v) => setFilterHospitalId(v === '' || v == null ? null : String(v))}
                  placeholder="병원검색"
                  openOnFocus
                />
              </div>
              <div className={s.filterField}>
                <label htmlFor="filter-pharma">제약사</label>
                <SingleSelect
                  id="filter-pharma"
                  options={[
                    { label: '전체', value: '' },
                    ...pharmas.map((p) => ({ label: p.name, value: p.id })),
                  ]}
                  selected={filterPharmaId ?? ''}
                  onChange={(v) => setFilterPharmaId(v === '' ? null : String(v))}
                  placeholder="제약사"
                />
              </div>
              <div className={s.filterField}>
                <label htmlFor="filter-status">승인상태</label>
                <SingleSelect
                  id="filter-status"
                  options={[
                    { label: '전체', value: '' },
                    { label: '대기', value: 'pending' },
                    { label: '승인', value: 'approved' },
                    { label: '승인불가', value: 'rejected' },
                  ]}
                  selected={filterStatus ?? ''}
                  onChange={(v) => setFilterStatus(v === '' ? null : String(v))}
                  placeholder="승인상태"
                />
              </div>
            </div>
          </div>
          <DataTable<FilterRequest>
            columns={columns}
            data={filteredMyRequests}
            getRowId={(r) => r.id}
            className={s.filterRequestTableWrap}
            emptyMessage={
              myRequests.length === 0
                ? '요청한 필터링 내역이 없습니다.'
                : '조건에 맞는 요청이 없습니다.'
            }
          />
        </Column>

        <CardWrapper title="거래선 추가" className={s.cardLayout} padding={16}>
          <div className={s.field}>
            <label htmlFor="hospital-search">병의원 검색</label>
            <HospitalSearchSelect
              id="hospital-search"
              options={hospitalOptions}
              selected={selectedHospitalId}
              onChange={(v) => setSelectedHospitalId(v != null ? String(v) : null)}
              placeholder="병의원명 검색"
              aria-label="병의원 검색"
            />
            <Button
              variant="secondary"
              size="small"
              onClick={() => setShowNewHospitalModal(true)}
              style={{ marginTop: 8 }}
            >
              검색 결과에 없으면 추가 요청
            </Button>
          </div>
          {selectedHospitalId && (
            <div className={s.field}>
              <label htmlFor="request-message">요청 문의 (선택)</label>
              <textarea
                id="request-message"
                placeholder="제약사에 전달할 메시지를 입력하세요."
                value={requestMessage}
                onChange={(e) => setRequestMessage(e.target.value)}
                rows={3}
              />
            </div>
          )}
          <Button variant="primary" onClick={handleSubmitExisting} disabled={!canSubmitExisting}>
            요청 보내기
          </Button>
        </CardWrapper>
      </div>

      {successText && <div className={s.successMsg}>{successText}</div>}

      {showNewHospitalModal && (
        <div
          className={s.modalOverlay}
          onClick={() => setShowNewHospitalModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-hospital-modal-title"
        >
          <div className={s.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 id="new-hospital-modal-title" className={s.modalTitle}>
              존재하지 않는 병의원 추가 요청
            </h2>
            <div className={s.field}>
              <label htmlFor="modal-hospital-name">병의원명 *</label>
              <input
                id="modal-hospital-name"
                type="text"
                placeholder="병의원 이름"
                value={newHospitalName}
                onChange={(e) => setNewHospitalName(e.target.value)}
              />
            </div>
            <div className={s.field}>
              <label htmlFor="modal-business-number">사업자번호 *</label>
              <input
                id="modal-business-number"
                type="text"
                placeholder="000-00-00000"
                value={newBusinessNumber}
                onChange={(e) => setNewBusinessNumber(e.target.value)}
              />
            </div>
            <div className={s.field}>
              <label htmlFor="modal-address">주소 *</label>
              <input
                id="modal-address"
                type="text"
                placeholder="주소"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
            </div>
            <div className={s.field}>
              <label htmlFor="modal-representative">대표자명 *</label>
              <input
                id="modal-representative"
                type="text"
                placeholder="대표자명"
                value={newRepresentativeName}
                onChange={(e) => setNewRepresentativeName(e.target.value)}
              />
            </div>
            <div className={s.field}>
              <label htmlFor="modal-request-message">요청 문의 (선택)</label>
              <textarea
                id="modal-request-message"
                placeholder="제약사에 전달할 메시지"
                value={newRequestMessage}
                onChange={(e) => setNewRequestMessage(e.target.value)}
                rows={2}
              />
            </div>
            <div className={s.modalActions}>
              <Button variant="secondary" onClick={() => setShowNewHospitalModal(false)}>
                취소
              </Button>
              <Button variant="primary" onClick={handleSubmitNew} disabled={!canSubmitNew}>
                요청 보내기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
