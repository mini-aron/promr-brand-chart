/** @jsxImportSource @emotion/react */
import { useCallback, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { HiOutlineX } from 'react-icons/hi';
import { useApp } from '@/context/AppContext';
import type { Hospital } from '@/types';
import { theme } from '@/theme';
import { Button } from '@/components/Common/Button';
import { SingleSelect } from '@/components/Common/Select';

const pageStyles = css({
  '& h1': { marginBottom: theme.spacing(2), color: theme.colors.text },
  '& p': { color: theme.colors.textMuted, marginBottom: theme.spacing(4) },
});

const searchRow = css({
  marginBottom: theme.spacing(4),
  '& input': {
    width: '100%',
    maxWidth: 320,
    minHeight: 48,
    padding: `0 ${theme.spacing(3)}px`,
    fontSize: 15,
    borderRadius: theme.radius.md,
    border: `2px solid ${theme.colors.border}`,
    '&:focus': {
      outline: 'none',
      borderColor: theme.colors.primary,
      boxShadow: `0 0 0 3px ${theme.colors.primary}20`,
    },
  },
});

const tableWrap = css({
  overflow: 'auto',
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.md,
  backgroundColor: theme.colors.surface,
  boxShadow: theme.shadow.sm,
  fontSize: 12,
  '& table': { width: '100%', borderCollapse: 'collapse', minWidth: 700 },
  '& th, & td': {
    padding: theme.spacing(1.5),
    textAlign: 'left',
    borderBottom: `1px solid ${theme.colors.border}`,
    borderRight: `1px solid ${theme.colors.border}`,
  },
  '& th:last-child, & td:last-child': { borderRight: 'none' },
  '& th': { backgroundColor: theme.colors.background, fontWeight: 600 },
  '& tbody tr:hover': { backgroundColor: `${theme.colors.primary}06` },
});

const addFormSection = css({
  '& label': {
    display: 'block',
    marginBottom: theme.spacing(2),
    fontSize: 14,
    fontWeight: 600,
    color: theme.colors.text,
  },
  '& input, & select': {
    width: '100%',
    minHeight: 48,
    padding: `0 ${theme.spacing(3)}px`,
    fontSize: 14,
    borderRadius: theme.radius.md,
    border: `2px solid ${theme.colors.border}`,
    '&:focus': { outline: 'none', borderColor: theme.colors.primary, boxShadow: `0 0 0 2px ${theme.colors.primary}20` },
  },
  '& select': {
    paddingRight: 40,
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    cursor: 'pointer',
  },
  '& button': {
    padding: `${theme.buttonPadding.y}px ${theme.spacing(4)}px`,
    fontSize: 14,
    fontWeight: 600,
    borderRadius: theme.radius.md,
    border: 'none',
    backgroundColor: theme.colors.primary,
    color: theme.colors.buttonText,
    cursor: 'pointer',
    minHeight: 48,
    '&:hover': { backgroundColor: theme.colors.primaryHover },
  },
});

const hospitalSearchRow = css({
  marginBottom: theme.spacing(4),
});

const addFormGrid = css({
  display: 'grid',
  gridTemplateColumns: 'repeat(5, minmax(0, 1fr)) auto',
  gap: theme.spacing(3),
  alignItems: 'flex-end',
  '@media (max-width: 960px)': {
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    '& button': { gridColumn: '1 / -1' },
  },
});

const openAddButton = css({
  marginBottom: theme.spacing(4),
});

const modalOverlay = css({
  position: 'fixed',
  inset: 0,
  backgroundColor: theme.colors.overlay,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
});

const modalBox = css({
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadow.md,
  width: '100%',
  maxWidth: 640,
  maxHeight: '90vh',
  overflow: 'auto',
  padding: theme.spacing(4),
  position: 'relative',
});

const modalHeader = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(4),
  '& h2': { margin: 0, fontSize: 18, fontWeight: 600, color: theme.colors.text },
});

const modalActions = css({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'flex-end',
  marginTop: theme.spacing(4),
  paddingTop: theme.spacing(3),
  borderTop: `1px solid ${theme.colors.border}`,
});

export function AccountManagePage() {
  const { userRole, hospitals, corporations, addHospital } = useApp();
  const [search, setSearch] = useState('');
  const [newAccountCode, setNewAccountCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newCorpId, setNewCorpId] = useState(corporations[0]?.id ?? '');
  const [newBusinessNumber, setNewBusinessNumber] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [hospitalTemplateSelect, setHospitalTemplateSelect] = useState<string | number | null>('');

  const hospitalsForSelect = useMemo(() => {
    const q = hospitalSearch.trim().toLowerCase();
    if (!q) return hospitals.slice(0, 100);
    return hospitals.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        (h.accountCode ?? '').toLowerCase().includes(q) ||
        (h.businessNumber ?? '').includes(q)
    ).slice(0, 100);
  }, [hospitals, hospitalSearch]);

  const applyHospitalTemplate = useCallback((h: Hospital) => {
    setNewName(h.name);
    setNewAccountCode(h.accountCode ?? '');
    setNewCorpId(h.corporationId);
    setNewBusinessNumber(h.businessNumber ?? '');
    setNewAddress(h.address ?? '');
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return hospitals;
    return hospitals.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        (h.accountCode ?? '').toLowerCase().includes(q) ||
        (corporations.find((c) => c.id === h.corporationId)?.name ?? '').toLowerCase().includes(q)
    );
  }, [hospitals, corporations, search]);

  const getCorpName = (corpId: string) => corporations.find((c) => c.id === corpId)?.name ?? '-';

  const handleAdd = useCallback(() => {
    const name = newName.trim();
    if (!name) {
      setAddError('거래처명을 입력하세요.');
      return;
    }
    const corpId = newCorpId || corporations[0]?.id;
    if (!corpId) {
      setAddError('소속법인을 선택하세요.');
      return;
    }
    const accountCode = newAccountCode.trim() || undefined;
    const existingCode = accountCode && hospitals.some((h) => (h.accountCode ?? '') === accountCode);
    if (existingCode) {
      setAddError('이미 사용 중인 거래처코드입니다.');
      return;
    }
    setAddError(null);
    const hospital: Hospital = {
      id: `h-${Date.now()}`,
      name,
      corporationId: corpId,
      accountCode: accountCode || undefined,
      businessNumber: newBusinessNumber.trim() || undefined,
      address: newAddress.trim() || undefined,
    };
    addHospital(hospital);
    setNewAccountCode('');
    setNewName('');
    setNewCorpId(corporations[0]?.id ?? '');
    setNewBusinessNumber('');
    setNewAddress('');
    setAddError(null);
    setShowAddModal(false);
  }, [newName, newCorpId, newAccountCode, newBusinessNumber, newAddress, corporations, hospitals, addHospital]);

  const closeAddModal = useCallback(() => {
    setShowAddModal(false);
    setAddError(null);
    setNewAccountCode('');
    setNewName('');
    setNewCorpId(corporations[0]?.id ?? '');
    setNewBusinessNumber('');
    setNewAddress('');
    setHospitalSearch('');
  }, [corporations]);

  if (userRole === 'corporation') return <Navigate to="/" replace />;

  return (
    <div css={pageStyles}>
      <h1>거래처관리</h1>
      <p>거래처(병의원) 목록을 검색하고 확인합니다.</p>

      <div css={searchRow}>
        <input
          type="search"
          placeholder="거래처명·거래처코드·법인명으로 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="거래처 검색"
        />
      </div>

      <Button variant="primary" css={openAddButton} onClick={() => setShowAddModal(true)}>
        거래처 추가
      </Button>

      {showAddModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-modal-title"
          css={modalOverlay}
          onClick={closeAddModal}
        >
          <div css={modalBox} onClick={(e) => e.stopPropagation()}>
            <div css={modalHeader}>
              <h2 id="add-modal-title">거래처 추가</h2>
              <Button variant="ghost" size="icon" onClick={closeAddModal} aria-label="닫기"><HiOutlineX size={18} /></Button>
            </div>

            <div css={[addFormSection, hospitalSearchRow]}>
              <label htmlFor="hospital-search-filter">병의원 검색</label>
              <input
                id="hospital-search-filter"
                type="search"
                placeholder="병의원명·거래처코드·사업자번호로 검색 후 아래 목록에서 선택"
                value={hospitalSearch}
                onChange={(e) => setHospitalSearch(e.target.value)}
                css={css({ maxWidth: '100%', marginBottom: theme.spacing(2) })}
                aria-label="병의원 검색"
              />
              <SingleSelect
                id="hospital-search-select"
                options={[
                  { label: '선택하세요 (사업자번호·주소 자동 입력)', value: '' },
                  ...hospitalsForSelect.map((h) => ({
                    label: `${h.name} ${h.accountCode ? ` · ${h.accountCode}` : ''} ${h.businessNumber ? ` · ${h.businessNumber}` : ''}`.trim(),
                    value: h.id,
                  })),
                ]}
                selected={hospitalTemplateSelect}
                onChange={(v) => {
                  if (v !== '') {
                    const h = hospitals.find((x) => x.id === v);
                    if (h) applyHospitalTemplate(h);
                    setHospitalTemplateSelect('');
                  } else {
                    setHospitalTemplateSelect(v);
                  }
                }}
                placeholder="선택하세요 (사업자번호·주소 자동 입력)"
                aria-label="선택 시 거래처명·사업자번호·주소 자동 입력"
              />
            </div>

            <div css={[addFormSection, addFormGrid]}>
              <div>
                <label htmlFor="new-account-code">거래처코드</label>
                <input
                  id="new-account-code"
                  type="text"
                  placeholder="선택"
                  value={newAccountCode}
                  onChange={(e) => setNewAccountCode(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="new-name">거래처명 *</label>
                <input
                  id="new-name"
                  type="text"
                  placeholder="병의원명"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="new-corp">소속법인 *</label>
                <SingleSelect
                  id="new-corp"
                  options={corporations.map((c) => ({ label: c.name, value: c.id }))}
                  selected={newCorpId}
                  onChange={(v) => setNewCorpId(String(v))}
                  placeholder="법인 선택"
                  aria-label="소속법인"
                />
              </div>
              <div>
                <label htmlFor="new-business-number">사업자번호</label>
                <input
                  id="new-business-number"
                  type="text"
                  placeholder="000-00-00000"
                  value={newBusinessNumber}
                  onChange={(e) => setNewBusinessNumber(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="new-address">주소</label>
                <input
                  id="new-address"
                  type="text"
                  placeholder="주소"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                />
              </div>
              <Button variant="primary" onClick={handleAdd}>
                추가
              </Button>
            </div>
            {addError && (
              <p css={css({ marginTop: theme.spacing(2), fontSize: 14, color: theme.colors.error })}>
                {addError}
              </p>
            )}
            <div css={modalActions}>
              <Button variant="secondary" onClick={closeAddModal}>
                취소
              </Button>
            </div>
          </div>
        </div>
      )}

      <div css={tableWrap}>
        <table>
          <thead>
            <tr>
              <th>거래처코드</th>
              <th>거래처명</th>
              <th>소속법인</th>
              <th>사업자번호</th>
              <th>주소</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((h) => (
              <tr key={h.id}>
                <td>{h.accountCode ?? '-'}</td>
                <td>{h.name}</td>
                <td>{getCorpName(h.corporationId)}</td>
                <td>{h.businessNumber ?? '-'}</td>
                <td>{h.address ?? '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filtered.length === 0 && (
        <p css={css({ marginTop: theme.spacing(2), color: theme.colors.textMuted })}>
          조건에 맞는 거래처가 없습니다.
        </p>
      )}
    </div>
  );
}
