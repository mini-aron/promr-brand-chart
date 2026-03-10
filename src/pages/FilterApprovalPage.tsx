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
    marginBottom: theme.spacing(1),
  },
  '& .page-header h1': { margin: 0, fontSize: '1.25rem', fontWeight: 600 },
  '& .page-header p': { margin: 0, fontSize: 13 },
});

const layoutWrap = css({
  display: 'flex',
  gap: theme.spacing(4),
  flex: 1,
  minHeight: 0,
  alignItems: 'stretch',
});

const mainArea = css({
  flex: 1,
  minWidth: 0,
  minHeight: 0,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const corpListSidebar = css({
  width: 260,
  flexShrink: 0,
  display: 'flex',
  flexDirection: 'column',
  minHeight: 0,
  backgroundColor: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadow.sm,
  '& .corp-search': {
    flexShrink: 0,
    padding: theme.spacing(2),
    '& input': {
      width: '100%',
      minHeight: 44,
      padding: `0 ${theme.spacing(2)}px`,
      fontSize: 14,
      borderRadius: theme.radius.md,
      border: `2px solid ${theme.colors.border}`,
      '&:focus': {
        outline: 'none',
        borderColor: theme.colors.primary,
        boxShadow: `0 0 0 2px ${theme.colors.primary}20`,
      },
      '&::placeholder': { color: theme.colors.textMuted },
    },
  },
  '& .corp-list': {
    flex: 1,
    minHeight: 0,
    overflow: 'auto',
    padding: theme.spacing(2),
    paddingTop: 0,
  },
  '& button': {
    display: 'block',
    width: '100%',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(1),
    textAlign: 'left',
    border: 'none',
    borderRadius: theme.radius.md,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    color: theme.colors.text,
    '&:hover': { backgroundColor: theme.colors.background },
  },
  '& button[data-active="true"]': {
    backgroundColor: `${theme.colors.primary}14`,
    color: theme.colors.primary,
    fontWeight: 600,
  },
});

const pendingBadge = css({
  display: 'inline-block',
  marginLeft: theme.spacing(1),
  padding: '2px 8px',
  fontSize: 11,
  fontWeight: 600,
  color: theme.colors.primary,
  backgroundColor: `${theme.colors.primary}18`,
  borderRadius: theme.radius.sm,
});

const listWrap = css({
  flex: 1,
  minHeight: 0,
  fontSize: 14,
  '& table': { minWidth: 560 },
  '& th, & td': {
    padding: theme.spacing(2),
    borderRight: 'none',
  },
  '& th': { fontSize: 13 },
});

const statusBadge = (status: string) =>
  css({
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: theme.radius.sm,
    fontSize: 12,
    fontWeight: 600,
    ...(status === 'pending' && {
      backgroundColor: `${theme.colors.primary}18`,
      color: theme.colors.primary,
    }),
    ...(status === 'approved' && {
      backgroundColor: `${theme.colors.success}18`,
      color: theme.colors.success,
    }),
    ...(status === 'rejected' && {
      backgroundColor: `${theme.colors.error}18`,
      color: theme.colors.error,
    }),
  });

const btnGroup = css({
  display: 'flex',
  gap: theme.spacing(1),
});

const addFormStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  alignItems: 'flex-end',
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: theme.colors.background,
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.colors.border}`,
  '& label': { display: 'block', marginBottom: theme.spacing(1), fontSize: 13, fontWeight: 600 },
  '& input': {
    flex: 1,
    minWidth: 200,
    minHeight: 40,
    padding: `0 ${theme.spacing(2)}px`,
    fontSize: 14,
    borderRadius: theme.radius.md,
    border: `2px solid ${theme.colors.border}`,
    '&:focus': { outline: 'none', borderColor: theme.colors.primary },
  },
  '& button': {
    padding: `${theme.spacing(1.5)}px ${theme.spacing(3)}px`,
    fontSize: 14,
    fontWeight: 600,
    borderRadius: theme.radius.md,
    border: 'none',
    backgroundColor: theme.colors.primary,
    color: theme.colors.buttonText,
    cursor: 'pointer',
    '&:hover': { backgroundColor: theme.colors.primaryHover },
    '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
  },
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

const STATUS_LABEL: Record<string, string> = {
  pending: '대기',
  approved: '승인',
  rejected: '승인불가',
};

export function FilterApprovalPage() {
  const { corporations, hospitals, currentPharmaId, filterRequests, updateFilterRequestStatus, addFilterRequest } = useApp();
  const [selectedCorpId, setSelectedCorpId] = useState<string | null>(null);
  const [corpSearch, setCorpSearch] = useState('');
  const [selectedHospitalId, setSelectedHospitalId] = useState('');

  const corporationsFiltered = useMemo(() => {
    const q = corpSearch.trim().toLowerCase();
    if (!q) return corporations;
    return corporations.filter((c) => c.name.toLowerCase().includes(q));
  }, [corporations, corpSearch]);

  const pendingCountByCorpId = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of filterRequests) {
      if (r.status !== 'pending') continue;
      map.set(r.corporationId, (map.get(r.corporationId) ?? 0) + 1);
    }
    return map;
  }, [filterRequests]);

  const requestsForCorp = useMemo(() => {
    if (!selectedCorpId) return [];
    return filterRequests
      .filter((r) => r.corporationId === selectedCorpId)
      .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt));
  }, [filterRequests, selectedCorpId]);

  const selectedCorp = selectedCorpId ? corporations.find((c) => c.id === selectedCorpId) : null;

  const hospitalsForCorp = useMemo(() => {
    if (!selectedCorpId) return [];
    return hospitals.filter((h) => h.corporationId === selectedCorpId);
  }, [selectedCorpId, hospitals]);

  const requestedHospitalIds = useMemo(() => {
    if (!selectedCorpId) return new Set<string>();
    return new Set(
      filterRequests
        .filter((r) => r.corporationId === selectedCorpId)
        .map((r) => r.hospitalId)
    );
  }, [selectedCorpId, filterRequests]);

  const addableHospitals = useMemo(
    () => hospitalsForCorp.filter((h) => !requestedHospitalIds.has(h.id)),
    [hospitalsForCorp, requestedHospitalIds]
  );

  const getHospital = useCallback(
    (id: string) => hospitals.find((h) => h.id === id),
    [hospitals]
  );

  const columnHelper = createColumnHelper<FilterRequest>();
  const columns = useMemo(
    () => [
      columnHelper.accessor(
        (r) => getHospital(r.hospitalId)?.name ?? r.hospitalName ?? '-',
        { id: 'hospital', header: '병의원' }
      ),
      columnHelper.accessor('requestedAt', {
        header: '요청 일시',
        cell: (info) => formatDateTime(info.getValue()),
      }),
      columnHelper.accessor('status', {
        header: '상태',
        cell: (info) => (
          <span css={statusBadge(info.getValue())}>
            {STATUS_LABEL[info.getValue()] ?? info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor('processedAt', {
        header: '처리 일시',
        cell: (info) => (info.getValue() ? formatDateTime(info.getValue()!) : '-'),
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
    [getHospital, updateFilterRequestStatus]
  );

  const handleAddFilter = useCallback(() => {
    if (!selectedCorpId || !selectedHospitalId) return;
    addFilterRequest(selectedCorpId, currentPharmaId, selectedHospitalId);
    setSelectedHospitalId('');
  }, [selectedCorpId, selectedHospitalId, currentPharmaId, addFilterRequest]);


  return (
    <div css={pageStyles}>
      <header className="page-header">
        <h1>법인별 필터링 승인요청</h1>
        <p>해당 법인이 병의원과 거래해도 되는지 승인·승인불가 처리합니다. 좌측에서 법인 선택 후 우측에서 병의원별 요청을 처리하세요.</p>
      </header>

      <div css={layoutWrap}>
        <aside css={corpListSidebar}>
          <div className="corp-search">
            <input
              type="search"
              placeholder="법인 검색"
              value={corpSearch}
              onChange={(e) => setCorpSearch(e.target.value)}
              aria-label="법인 검색"
            />
          </div>
          <div className="corp-list">
            {corporationsFiltered.map((c) => {
              const pendingCount = pendingCountByCorpId.get(c.id) ?? 0;
              return (
                <button
                  key={c.id}
                  type="button"
                  data-active={selectedCorpId === c.id}
                  onClick={() => setSelectedCorpId(c.id)}
                >
                  {c.name}
                  {pendingCount > 0 && (
                    <span css={pendingBadge}>미처리 {pendingCount}건</span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        <main css={mainArea}>
          {selectedCorp ? (
            <>
              <p css={css({ marginBottom: theme.spacing(2), fontSize: 14, color: theme.colors.textMuted })}>
                <strong css={css({ color: theme.colors.text })}>{selectedCorp.name}</strong> — 병의원별 거래 허용 요청
              </p>
              <div css={addFormStyles}>
                <div css={css({ flex: '1 1 260px' })}>
                  <label htmlFor="filter-add-hospital">병의원 선택 (거래 허용 요청 추가)</label>
                  <SingleSelect
                    id="filter-add-hospital"
                    options={[
                      {
                        label: addableHospitals.length === 0
                          ? '추가 가능한 병의원 없음 (이미 요청됨)'
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
                    placeholder={addableHospitals.length === 0 ? '추가 가능한 병의원 없음 (이미 요청됨)' : '병의원 선택'}
                    enableSearch
                    aria-label="병의원 선택"
                  />
                </div>
                <Button variant="primary" onClick={handleAddFilter} disabled={!selectedHospitalId}>
                  요청 추가
                </Button>
              </div>
              <div css={css({ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' })}>
                <DataTable<FilterRequest>
                  columns={columns}
                  data={requestsForCorp}
                  getRowId={(r) => r.id}
                  tableCss={listWrap}
                />
                {requestsForCorp.length === 0 && (
                  <p css={css({ padding: theme.spacing(4), textAlign: 'center', color: theme.colors.textMuted })}>
                    해당 법인의 병의원 거래 허용 요청이 없습니다.
                  </p>
                )}
              </div>
            </>
          ) : (
            <p css={css({ color: theme.colors.textMuted, padding: theme.spacing(4) })}>
              좌측에서 법인을 선택하세요.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}
