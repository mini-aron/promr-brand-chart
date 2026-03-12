'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useApp } from '@/store/appStore';
import { mockCorporations, mockFilterRequests, mockHospitals } from '@/store/mockData';
import { Button } from '@/components/Common/Button';
import { SingleSelect } from '@/components/Common/Select';
import { DataTable } from '@/components/Common/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import * as s from './index.css';
import type { FilterRequest } from '@/types';
import { Tooltip } from '@/components/Common/Tooltip';

const DEADLINE_STORAGE_KEY = 'filter-approval-deadlines';

function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function loadDeadline(monthKey: string): number {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem(DEADLINE_STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    return data[monthKey] ?? 0;
  } catch {
    return 0;
  }
}

function saveDeadline(monthKey: string, day: number) {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(DEADLINE_STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : {};
    if (day <= 0) {
      delete data[monthKey];
    } else {
      data[monthKey] = day;
    }
    localStorage.setItem(DEADLINE_STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

function getStatusCellClass(status: string): string {
  if (status === 'pending') return s.statusCellPending;
  if (status === 'approved') return s.statusCellApproved;
  if (status === 'rejected') return s.statusCellRejected;
  return s.statusCellBase;
}

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

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return iso.slice(0, 10);
  }
}

const STATUS_LABEL: Record<string, string> = {
  pending: '대기',
  approved: '승인',
  rejected: '승인불가',
};

export function FilterApprovalPage() {
  const { currentPharmaId } = useApp();
  const corporations = mockCorporations;
  const hospitals = mockHospitals;
  const [filterRequests, setFilterRequests] = useState(mockFilterRequests);
  const updateFilterRequestStatus = useCallback((id: string, status: 'approved' | 'rejected') => {
    const now = new Date().toISOString().slice(0, 19);
    setFilterRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status, processedAt: now, updatedAt: now, updatedBy: 'admin' } : r
      )
    );
  }, []);
  const addFilterRequest = useCallback(
    (corporationId: string, pharmaId: string, hospitalId: string, requestMessage?: string, status?: FilterRequest['status']) => {
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
    []
  );
  const [filterCorpId, setFilterCorpId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [addCorpId, setAddCorpId] = useState<string | null>(null);
  const [selectedHospitalId, setSelectedHospitalId] = useState('');
  const [addStatus, setAddStatus] = useState<FilterRequest['status']>('pending');
  const currentMonthKey = useMemo(() => getCurrentMonthKey(), []);
  const [deadlineDay, setDeadlineDay] = useState(0);

  useEffect(() => {
    setDeadlineDay(loadDeadline(currentMonthKey));
  }, [currentMonthKey]);

  const updateDeadline = useCallback(
    (day: number) => {
      if (day <= 0) {
        setDeadlineDay(0);
        saveDeadline(currentMonthKey, 0);
      } else {
        const maxDay = new Date(
          parseInt(currentMonthKey.slice(0, 4), 10),
          parseInt(currentMonthKey.slice(5, 7), 10),
          0
        ).getDate();
        if (day >= 1 && day <= maxDay) {
          setDeadlineDay(day);
          saveDeadline(currentMonthKey, day);
        }
      }
    },
    [currentMonthKey]
  );

  const filteredRequests = useMemo(() => {
    return filterRequests
      .filter((r) => !filterCorpId || r.corporationId === filterCorpId)
      .filter((r) => !filterStatus || r.status === filterStatus)
      .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));
  }, [filterRequests, filterCorpId, filterStatus]);

  const hospitalsForAddCorp = useMemo(() => {
    if (!addCorpId) return [];
    return hospitals.filter((h) => h.corporationId === addCorpId);
  }, [addCorpId, hospitals]);

  const requestedHospitalIdsForAddCorp = useMemo(() => {
    if (!addCorpId) return new Set<string>();
    return new Set(
      filterRequests
        .filter((r) => r.corporationId === addCorpId)
        .map((r) => r.hospitalId)
    );
  }, [addCorpId, filterRequests]);

  const addableHospitals = useMemo(
    () => hospitalsForAddCorp.filter((h) => !requestedHospitalIdsForAddCorp.has(h.id)),
    [hospitalsForAddCorp, requestedHospitalIdsForAddCorp]
  );

  const getCorporation = useCallback(
    (id: string) => corporations.find((c) => c.id === id),
    [corporations]
  );

  const getHospital = useCallback(
    (id: string) => hospitals.find((h) => h.id === id),
    [hospitals]
  );

  const columnHelper = createColumnHelper<FilterRequest>();
  const columns = useMemo(
    () => [
      columnHelper.accessor('status', {
        id: 'status',
        header: '상태',
        size: 72,
        cell: (info) => (
          <span className={getStatusCellClass(info.getValue())}>
            {STATUS_LABEL[info.getValue()] ?? info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor(
        (r) => getCorporation(r.corporationId)?.name ?? '-',
        { id: 'corporation', header: '법인' }
      ),
      columnHelper.accessor(
        (r) => getHospital(r.hospitalId)?.name ?? r.hospitalName ?? '-',
        { id: 'hospital', header: '병의원' }
      ),
      columnHelper.accessor('requestedAt', {
        header: '요청 일시',
        cell: (info) => formatDateTime(info.getValue()),
      }),
      columnHelper.accessor((r) => r.createdAt ?? r.requestedAt, {
        id: 'createdAt',
        header: '생성일',
        cell: (info) => {
          const v = info.getValue();
          return v ? formatDate(v) : '-';
        },
      }),
      columnHelper.accessor((r) => r.updatedAt ?? r.processedAt, {
        id: 'updatedAt',
        header: '업데이트일',
        cell: (info) => {
          const v = info.getValue();
          return v ? formatDate(v) : '-';
        },
      }),
      columnHelper.accessor('createdBy', {
        header: '생성자',
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.accessor('updatedBy', {
        header: '업데이트',
        cell: (info) => info.getValue() ?? '-',
      }),
      columnHelper.display({
        id: 'actions',
        header: '처리',
        cell: (info) => (
          <div className={s.btnGroup}>
            <Button variant="primary" size="small" onClick={() => updateFilterRequestStatus(info.row.original.id, 'approved')}>
              승인
            </Button>
            <Button variant="danger" size="small" onClick={() => updateFilterRequestStatus(info.row.original.id, 'rejected')}>
              승인불가
            </Button>
          </div>
        ),
      }),
    ],
    [getCorporation, getHospital, updateFilterRequestStatus]
  );

  const handleAddFilter = useCallback(() => {
    if (!addCorpId || !selectedHospitalId || !currentPharmaId) return;
    addFilterRequest(addCorpId, currentPharmaId, selectedHospitalId, undefined, addStatus);
    setSelectedHospitalId('');
  }, [addCorpId, selectedHospitalId, currentPharmaId, addStatus, addFilterRequest]);


  const maxDay = useMemo(() => {
    const [y, m] = currentMonthKey.split('-').map(Number);
    return new Date(y, m, 0).getDate();
  }, [currentMonthKey]);

  const deadlineDayOptions = useMemo(
    () => [
      { label: '선택', value: '' },
      ...Array.from({ length: maxDay }, (_, i) => ({
        label: `${i + 1}일`,
        value: String(i + 1),
      })),
    ],
    [maxDay]
  );

  return (
    <div className={s.page}>
      <header className="page-header">
        <h1>거래선 관리</h1>
        <p>법인·병의원별 거래 허용 여부를 등록하고 승인·승인불가 처리합니다.</p>
      </header>

      <div className={s.layoutWrap}>
        <div className={s.leftCard}>
          <div className={s.filterRowStyles}>
            <div className={s.filterArea} />
            <div className={s.deadlineInline}>
              <span className={s.deadlineLabel}>마감일 관리</span>
              <div className={s.deadlineSelectWrap}>
                <SingleSelect
                  options={deadlineDayOptions}
                  selected={deadlineDay ? String(deadlineDay) : ''}
                  onChange={(v) => updateDeadline(v === '' ? 0 : parseInt(String(v), 10))}
                  placeholder="선택"
                  aria-label={`${currentMonthKey} 당월 마감일`}
                />
              </div>
            </div>
          </div>

          <div className={s.listWrap}>
            <DataTable<FilterRequest>
              columns={columns}
              data={filteredRequests}
              getRowId={(r) => r.id}
              emptyMessage={filterRequests.length === 0 ? '등록된 거래선이 없습니다.' : '조건에 맞는 항목이 없습니다.'}
            />
          </div>
        </div>

        <aside className={s.rightPanel}>
          <h3 className={s.sectionTitle}>거래선 추가</h3>
          <div className={s.formField}>
            <label htmlFor="filter-add-corp">법인 *</label>
            <SingleSelect
              id="filter-add-corp"
              options={[
                { label: '법인 선택', value: '' },
                ...corporations.map((c) => ({ label: c.name, value: c.id })),
              ]}
              selected={addCorpId ?? ''}
              onChange={(v) => {
                setAddCorpId(v === '' ? null : String(v));
                setSelectedHospitalId('');
              }}
              placeholder="법인 선택"
              aria-label="법인 선택"
            />
          </div>
          <div className={s.formField}>
            <label htmlFor="filter-add-hospital">병의원 *</label>
            <SingleSelect
              id="filter-add-hospital"
              options={[
                {
                  label: !addCorpId
                    ? '법인을 먼저 선택하세요'
                    : addableHospitals.length === 0
                      ? '추가 가능한 병의원 없음'
                      : '병의원 선택',
                  value: '',
                },
                ...addableHospitals.map((h) => ({
                  label: h.name,
                  value: h.id,
                  description: h.address || undefined,
                })),
              ]}
              selected={selectedHospitalId}
              onChange={(v) => setSelectedHospitalId(String(v))}
              placeholder={!addCorpId ? '법인을 먼저 선택하세요' : addableHospitals.length === 0 ? '추가 가능한 병의원 없음' : '병의원 선택'}
              enableSearch
              aria-label="병의원 선택"
            />
          </div>
          <div className={s.formField}>
            <label htmlFor="filter-add-status">상태</label>
            <SingleSelect
              id="filter-add-status"
              options={[
                { label: '대기', value: 'pending' },
                { label: '승인', value: 'approved' },
                { label: '승인불가', value: 'rejected' },
              ]}
              selected={addStatus}
              onChange={(v) => setAddStatus((v as FilterRequest['status']) ?? 'pending')}
              placeholder="상태"
              aria-label="상태 선택"
            />
          </div>
          <div className={s.formField}>
              <label>수수료</label>
          </div>

          <div className={s.formField}>
              <Tooltip description="금지·허용 품목 설정" >
                <label>금지·허용 품목 설정</label>
              </Tooltip>
          </div>
          <Button
            variant="primary"
            onClick={handleAddFilter}
            disabled={!addCorpId || !selectedHospitalId}
            className={s.addButtonFull}
          >
            추가
          </Button>
        </aside>
      </div>
    </div>
  );
}
