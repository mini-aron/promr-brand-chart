'use client';
/** @jsxImportSource @emotion/react */
import { useCallback, useMemo, useState } from 'react';
import { css } from '@emotion/react';
import { useApp } from '@/context/AppContext';
import { theme } from '@/theme';
import { Button } from '@/components/Common/Button';
import { SingleSelect } from '@/components/Common/Select';
import { DataTable } from '@/components/Common/DataTable';
import { createColumnHelper } from '@tanstack/react-table';
import type { FilterRequest } from '@/types';

const pageStyles = css({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minHeight: 0,
  '& .page-header': {
    flexShrink: 0,
    marginBottom: theme.spacing(2),
  },
  '& .page-header h1': { margin: 0, fontSize: '1.25rem', fontWeight: 600 },
  '& .page-header p': { margin: 0, fontSize: 13, color: theme.colors.textMuted },
});

const layoutWrap = css({
  flex: 1,
  minHeight: 0,
  display: 'flex',
  gap: theme.spacing(4),
  alignItems: 'stretch',
});

const leftCard = css({
  flex: 1,
  minWidth: 320,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  backgroundColor: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadow.sm,
});

const filterRowStyles = css({
  display: 'flex',
  flexWrap: 'nowrap',
  gap: theme.spacing(2),
  alignItems: 'center',
  padding: theme.spacing(2),
  backgroundColor: theme.colors.background,
  borderBottom: `1px solid ${theme.colors.border}`,
  '& > *': { flexShrink: 0 },
});

const listWrap = css({
  flex: 1,
  minHeight: 0,
  overflow: 'auto',
  padding: theme.spacing(2),
  fontSize: 14,
  '& table': { minWidth: 680 },
  '& th, & td': {
    padding: theme.spacing(2),
    borderRight: 'none',
  },
  '& th': { fontSize: 13 },
});

const rightPanel = css({
  width: 360,
  flexShrink: 0,
  backgroundColor: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.lg,
  padding: theme.spacing(4),
  boxShadow: theme.shadow.sm,
  alignSelf: 'flex-start',
});

const formField = css({
  marginBottom: theme.spacing(3),
  '& label': { display: 'block', marginBottom: theme.spacing(1), fontSize: 13, fontWeight: 600 },
});

const statusCellFill = (status: string) => {
  const pad = theme.spacing(2);
  return css({
    display: 'block',
    margin: -pad,
    padding: pad,
    minHeight: '100%',
    boxSizing: 'content-box',
    fontSize: 12,
    fontWeight: 600,
    ...(status === 'pending' && {
      backgroundColor: 'color-mix(in srgb, var(--color-primary) 6%, transparent)',
      color: 'var(--color-primary)',
    }),
    ...(status === 'approved' && {
      backgroundColor: 'color-mix(in srgb, var(--color-success) 6%, transparent)',
      color: 'var(--color-success)',
    }),
    ...(status === 'rejected' && {
      backgroundColor: 'color-mix(in srgb, var(--color-error) 6%, transparent)',
      color: 'var(--color-error)',
    }),
  });
};

const btnGroup = css({
  display: 'flex',
  gap: theme.spacing(1),
});

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
  const { corporations, hospitals, currentPharmaId, filterRequests, updateFilterRequestStatus, addFilterRequest } = useApp();
  const [filterCorpId, setFilterCorpId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [addCorpId, setAddCorpId] = useState<string | null>(null);
  const [selectedHospitalId, setSelectedHospitalId] = useState('');
  const [addStatus, setAddStatus] = useState<FilterRequest['status']>('pending');

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
          <span css={statusCellFill(info.getValue())}>
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
          <div css={btnGroup}>
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


  return (
    <div css={pageStyles}>
      <header className="page-header">
        <h1>거래선 관리</h1>
        <p>법인·병의원별 거래 허용 여부를 등록하고 승인·승인불가 처리합니다.</p>
      </header>

      <div css={layoutWrap}>
        <div css={leftCard}>
          <div css={filterRowStyles}>
            
          </div>

          <div css={listWrap}>
            <DataTable<FilterRequest>
              columns={columns}
              data={filteredRequests}
              getRowId={(r) => r.id}
              emptyMessage={filterRequests.length === 0 ? '등록된 거래선이 없습니다.' : '조건에 맞는 항목이 없습니다.'}
            />
          </div>
        </div>

        <aside css={rightPanel}>
          <h3 css={css({ fontSize: 16, marginBottom: theme.spacing(3) })}>거래선 추가</h3>
          <div css={formField}>
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
          <div css={formField}>
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
          <div css={formField}>
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
          <Button
            variant="primary"
            onClick={handleAddFilter}
            disabled={!addCorpId || !selectedHospitalId}
            css={css({ width: '100%' })}
          >
            추가
          </Button>
        </aside>
      </div>
    </div>
  );
}
