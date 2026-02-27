/** @jsxImportSource @emotion/react */
import { useCallback, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { useApp } from '@/context/AppContext';
import type { Hospital } from '@/types';
import { theme } from '@/theme';
import { Button } from '@/components/Common/Button';

const pageStyles = css({
  '& h1': { marginBottom: theme.spacing(2), color: theme.colors.text },
  '& p': { color: theme.colors.textMuted, marginBottom: theme.spacing(4) },
});

const headerRow = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
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
  maxWidth: 480,
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

const formSection = css({
  '& label': {
    display: 'block',
    marginBottom: theme.spacing(1),
    fontSize: 14,
    fontWeight: 600,
    color: theme.colors.text,
  },
  '& input': {
    width: '100%',
    minHeight: 48,
    padding: `0 ${theme.spacing(3)}px`,
    fontSize: 14,
    borderRadius: theme.radius.md,
    border: `2px solid ${theme.colors.border}`,
    marginBottom: theme.spacing(3),
    '&:focus': { outline: 'none', borderColor: theme.colors.primary, boxShadow: `0 0 0 2px ${theme.colors.primary}20` },
  },
});

const modalActions = css({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'flex-end',
  marginTop: theme.spacing(4),
  paddingTop: theme.spacing(3),
  borderTop: `1px solid ${theme.colors.border}`,
});

const infoBox = css({
  padding: theme.spacing(3),
  backgroundColor: theme.colors.background,
  borderRadius: theme.radius.md,
  marginBottom: theme.spacing(3),
  '& .info-row': {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
    fontSize: 14,
    '&:last-child': { marginBottom: 0 },
  },
  '& .info-label': {
    color: theme.colors.textMuted,
    fontWeight: 500,
  },
  '& .info-value': {
    color: theme.colors.text,
    fontWeight: 600,
  },
});

const errorBox = css({
  padding: theme.spacing(3),
  backgroundColor: `${theme.colors.error}14`,
  color: theme.colors.error,
  borderRadius: theme.radius.md,
  fontSize: 14,
  marginBottom: theme.spacing(3),
  lineHeight: 1.6,
});

export function HospitalManagePage() {
  const { userRole, hospitals, corporations, addHospital } = useApp();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [businessNumberInput, setBusinessNumberInput] = useState('');
  const [searchedHospital, setSearchedHospital] = useState<Hospital | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return hospitals;
    return hospitals.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        (h.accountCode ?? '').toLowerCase().includes(q) ||
        (h.businessNumber ?? '').includes(q) ||
        (corporations.find((c) => c.id === h.corporationId)?.name ?? '').toLowerCase().includes(q)
    );
  }, [hospitals, corporations, search]);

  const getCorpName = (corpId: string) => corporations.find((c) => c.id === corpId)?.name ?? '-';

  const formatBusinessNumber = useCallback((value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 10)}`;
  }, []);

  const handleBusinessNumberChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatBusinessNumber(e.target.value);
    setBusinessNumberInput(formatted);
  }, [formatBusinessNumber]);

  const handleSearch = useCallback(() => {
    setIsSearching(true);
    setSearchError(null);
    setSearchedHospital(null);

    const businessNumber = businessNumberInput.trim();
    if (!businessNumber) {
      setSearchError('사업자번호를 입력하세요.');
      setIsSearching(false);
      return;
    }

    setTimeout(() => {
      const found = hospitals.find((h) => h.businessNumber === businessNumber);
      
      if (found) {
        setSearchedHospital(found);
      } else {
        setSearchError('해당 사업자번호로 등록된 병의원이 없습니다.\n프로엠알에게 문의해주세요.');
      }
      setIsSearching(false);
    }, 500);
  }, [businessNumberInput, hospitals]);

  const handleAdd = useCallback(() => {
    if (!searchedHospital) return;

    const exists = hospitals.some((h) => h.id === searchedHospital.id);
    if (exists) {
      setSearchError('이미 등록된 병의원입니다.');
      return;
    }

    addHospital(searchedHospital);
    closeAddModal();
    alert(`${searchedHospital.name}이(가) 추가되었습니다.`);
  }, [searchedHospital, hospitals, addHospital]);

  const closeAddModal = useCallback(() => {
    setShowAddModal(false);
    setBusinessNumberInput('');
    setSearchedHospital(null);
    setSearchError(null);
    setIsSearching(false);
  }, []);

  if (userRole === 'corporation') return <Navigate to="/" replace />;

  return (
    <div css={pageStyles}>
      <h1>병의원 관리</h1>
      <p>병의원 목록을 조회하고 사업자번호로 병의원을 추가합니다.</p>

      <div css={headerRow}>
        <div css={searchRow}>
          <input
            type="search"
            placeholder="병의원명·사업자번호·법인명으로 검색"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="병의원 검색"
          />
        </div>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          병의원 추가
        </Button>
      </div>

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
              <h2 id="add-modal-title">사업자번호로 병의원 추가</h2>
              <Button variant="ghost" size="icon" onClick={closeAddModal} aria-label="닫기">×</Button>
            </div>

            <div css={formSection}>
              <label htmlFor="business-number">사업자번호</label>
              <input
                id="business-number"
                type="text"
                placeholder="000-00-00000"
                value={businessNumberInput}
                onChange={handleBusinessNumberChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isSearching) {
                    handleSearch();
                  }
                }}
                disabled={isSearching}
                maxLength={12}
              />
            </div>

            {searchError && (
              <div css={errorBox}>
                {searchError.split('\n').map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            )}

            {searchedHospital && (
              <div css={infoBox}>
                <div className="info-row">
                  <span className="info-label">병의원명</span>
                  <span className="info-value">{searchedHospital.name}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">사업자번호</span>
                  <span className="info-value">{searchedHospital.businessNumber}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">주소</span>
                  <span className="info-value">{searchedHospital.address || '-'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">소속법인</span>
                  <span className="info-value">{getCorpName(searchedHospital.corporationId)}</span>
                </div>
              </div>
            )}

            <div css={modalActions}>
              <Button variant="secondary" onClick={closeAddModal}>취소</Button>
              {!searchedHospital ? (
                <Button variant="primary" onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? '조회 중...' : '조회'}
                </Button>
              ) : (
                <Button variant="primary" onClick={handleAdd}>추가</Button>
              )}
            </div>
          </div>
        </div>
      )}

      <div css={tableWrap}>
        <table>
          <thead>
            <tr>
              <th>거래처코드</th>
              <th>병의원명</th>
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
          조건에 맞는 병의원이 없습니다.
        </p>
      )}
    </div>
  );
}
