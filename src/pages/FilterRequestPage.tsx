/** @jsxImportSource @emotion/react */
import { useCallback, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { css } from '@emotion/react';
import { useApp } from '@/context/AppContext';
import { theme } from '@/theme';

const pageStyles = css({
  width: '100%',
  minWidth: 0,
  '& h1': { marginBottom: theme.spacing(2), color: theme.colors.text },
  '& p': { color: theme.colors.textMuted, marginBottom: theme.spacing(4) },
});

const twoColLayout = css({
  display: 'grid',
  gridTemplateColumns: '1fr 400px',
  gap: theme.spacing(4),
  alignItems: 'start',
  '@media (max-width: 900px)': { gridTemplateColumns: '1fr' },
});

const cardStyles = css({
  backgroundColor: theme.colors.surface,
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.lg,
  padding: theme.spacing(4),
  marginBottom: theme.spacing(4),
  boxShadow: theme.shadow.sm,
});

const sectionTitle = css({
  fontSize: 16,
  fontWeight: 600,
  marginBottom: theme.spacing(3),
  color: theme.colors.text,
});

const inputStyles = css({
  width: '100%',
  minHeight: 44,
  padding: `0 ${theme.spacing(2)}px`,
  fontSize: 14,
  borderRadius: theme.radius.md,
  border: `2px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.surface,
  '&:focus': { outline: 'none', borderColor: theme.colors.primary, boxShadow: `0 0 0 2px ${theme.colors.primary}20` },
  '&::placeholder': { color: theme.colors.textMuted },
});

const labelStyles = css({
  display: 'block',
  marginBottom: theme.spacing(1),
  fontSize: 14,
  fontWeight: 600,
  color: theme.colors.text,
});

const fieldStyles = css({
  marginBottom: theme.spacing(3),
  '& label': labelStyles,
  '& input': inputStyles,
  '& textarea': {
    ...inputStyles,
    minHeight: 88,
    padding: theme.spacing(2),
    resize: 'vertical',
  },
});

const hospitalListStyles = css({
  maxHeight: 240,
  overflow: 'auto',
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.md,
  marginBottom: theme.spacing(3),
  '& button': {
    display: 'block',
    width: '100%',
    padding: theme.spacing(2),
    textAlign: 'left',
    border: 'none',
    borderBottom: `1px solid ${theme.colors.border}`,
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: 14,
    color: theme.colors.text,
    '&:hover': { backgroundColor: theme.colors.background },
    '&:last-of-type': { borderBottom: 'none' },
  },
  '& button[data-selected="true"]': {
    backgroundColor: `${theme.colors.primary}14`,
    color: theme.colors.primary,
    fontWeight: 600,
  },
});

const btnPrimary = css({
  padding: `${theme.spacing(1.5)}px ${theme.spacing(3)}px`,
  fontSize: 14,
  fontWeight: 600,
  borderRadius: theme.radius.md,
  border: 'none',
  backgroundColor: theme.colors.primary,
  color: theme.colors.buttonText,
  cursor: 'pointer',
  '&:hover': { backgroundColor: theme.colors.primaryHover },
  '&:disabled': { opacity: 0.6, cursor: 'not-allowed' },
});

const successMsg = css({
  marginTop: theme.spacing(2),
  padding: theme.spacing(2),
  backgroundColor: `${theme.colors.success}14`,
  color: theme.colors.success,
  borderRadius: theme.radius.md,
});

const btnSecondary = css({
  padding: `${theme.spacing(1.5)}px ${theme.spacing(3)}px`,
  fontSize: 14,
  fontWeight: 600,
  borderRadius: theme.radius.md,
  border: `2px solid ${theme.colors.border}`,
  backgroundColor: theme.colors.surface,
  color: theme.colors.text,
  cursor: 'pointer',
  '&:hover': { backgroundColor: theme.colors.background },
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

const modalContent = css({
  backgroundColor: theme.colors.surface,
  borderRadius: theme.radius.lg,
  padding: theme.spacing(4),
  maxWidth: 440,
  width: '100%',
  maxHeight: '90vh',
  overflow: 'auto',
  boxShadow: theme.shadow.md,
});

const modalTitle = css({
  margin: 0,
  marginBottom: theme.spacing(3),
  fontSize: 18,
  fontWeight: 600,
  color: theme.colors.text,
});

const modalActions = css({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),
});

const tableWrap = css({
  overflow: 'auto',
  border: `1px solid ${theme.colors.border}`,
  borderRadius: theme.radius.md,
  fontSize: 14,
  '& table': { width: '100%', borderCollapse: 'collapse' },
  '& th, & td': {
    padding: theme.spacing(2),
    textAlign: 'left',
    borderBottom: `1px solid ${theme.colors.border}`,
  },
  '& th': { backgroundColor: theme.colors.background, fontWeight: 600 },
  '& tbody tr:hover': { backgroundColor: `${theme.colors.primary}06` },
});

const statusBadge = (status: string) =>
  css({
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
    ...(status === 'pending' && { backgroundColor: `${theme.colors.primary}18`, color: theme.colors.primary }),
    ...(status === 'approved' && { backgroundColor: `${theme.colors.success}18`, color: theme.colors.success }),
    ...(status === 'rejected' && { backgroundColor: `${theme.colors.error}18`, color: theme.colors.error }),
  });

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
  const { userRole, currentCorporationId, hospitals, filterRequests, addFilterRequest, addFilterRequestNewHospital } =
    useApp();
  const [hospitalSearch, setHospitalSearch] = useState('');
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [requestMessage, setRequestMessage] = useState('');
  const [successText, setSuccessText] = useState<string | null>(null);
  const [showNewHospitalModal, setShowNewHospitalModal] = useState(false);

  const [newHospitalName, setNewHospitalName] = useState('');
  const [newBusinessNumber, setNewBusinessNumber] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newRepresentativeName, setNewRepresentativeName] = useState('');
  const [newRequestMessage, setNewRequestMessage] = useState('');

  const corporationHospitals = useMemo(
    () => hospitals.filter((h) => h.corporationId === currentCorporationId),
    [hospitals, currentCorporationId]
  );

  const hospitalSearchResult = useMemo(() => {
    const q = hospitalSearch.trim().toLowerCase();
    if (!q) return corporationHospitals.slice(0, 20);
    return corporationHospitals.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        (h.accountCode?.toLowerCase().includes(q)) ||
        (h.businessNumber?.toLowerCase().includes(q))
    );
  }, [corporationHospitals, hospitalSearch]);

  const handleSubmitExisting = useCallback(() => {
    if (!selectedHospitalId) return;
    addFilterRequest(currentCorporationId, selectedHospitalId, requestMessage.trim() || undefined);
    setSuccessText('필터링 요청이 접수되었습니다. 제약사 승인 후 거래 가능 여부가 반영됩니다.');
    setSelectedHospitalId(null);
    setRequestMessage('');
  }, [currentCorporationId, selectedHospitalId, requestMessage, addFilterRequest]);

  const getHospital = useCallback((id: string) => hospitals.find((h) => h.id === id), [hospitals]);

  const myRequests = useMemo(
    () =>
      filterRequests
        .filter((r) => r.corporationId === currentCorporationId)
        .sort((a, b) => b.requestedAt.localeCompare(a.requestedAt)),
    [filterRequests, currentCorporationId]
  );

  const handleSubmitNew = useCallback(() => {
    const name = newHospitalName.trim();
    const biz = newBusinessNumber.trim();
    const addr = newAddress.trim();
    const rep = newRepresentativeName.trim();
    if (!name || !biz || !addr || !rep) return;
    addFilterRequestNewHospital(currentCorporationId, {
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
    newHospitalName,
    newBusinessNumber,
    newAddress,
    newRepresentativeName,
    newRequestMessage,
    addFilterRequestNewHospital,
  ]);

  const canSubmitNew =
    newHospitalName.trim() &&
    newBusinessNumber.trim() &&
    newAddress.trim() &&
    newRepresentativeName.trim();

  if (userRole === 'pharma') return <Navigate to="/" replace />;

  return (
    <div css={pageStyles}>
      <h1>필터링 요청</h1>
      <p>거래 허용이 필요한 병의원을 검색해 요청하거나, 등록되지 않은 병의원은 정보를 입력해 추가 요청할 수 있습니다.</p>

      <div css={twoColLayout}>
        <section css={cardStyles}>
          <h2 css={sectionTitle}>내 필터링 요청 현황</h2>
          <div css={tableWrap}>
            <table>
              <thead>
                <tr>
                  <th>요청일시</th>
                  <th>병의원</th>
                  <th>승인상태</th>
                </tr>
              </thead>
              <tbody>
                {myRequests.length === 0 ? (
                  <tr>
                    <td colSpan={3} css={css({ padding: theme.spacing(4), textAlign: 'center', color: theme.colors.textMuted })}>
                      요청한 필터링 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  myRequests.map((r) => (
                    <tr key={r.id}>
                      <td>{formatDateTime(r.requestedAt)}</td>
                      <td>{getHospital(r.hospitalId)?.name ?? r.hospitalName ?? '-'}</td>
                      <td>
                        <span css={statusBadge(r.status)}>{STATUS_LABEL[r.status] ?? r.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section css={cardStyles}>
          <h2 css={sectionTitle}>병의원 검색 후 요청</h2>
          <div css={fieldStyles}>
            <label htmlFor="hospital-search">병의원 검색</label>
            <input
              id="hospital-search"
              type="search"
              placeholder="병의원명, 거래처코드, 사업자번호로 검색"
              value={hospitalSearch}
              onChange={(e) => setHospitalSearch(e.target.value)}
              aria-label="병의원 검색"
            />
          </div>
          <div css={hospitalListStyles}>
            {hospitalSearchResult.length === 0 ? (
              <div css={css({ padding: theme.spacing(2) })}>
                <p css={css({ color: theme.colors.textMuted, fontSize: 14, marginBottom: theme.spacing(2) })}>
                  {hospitalSearch.trim() ? '검색 결과가 없습니다.' : '병의원명·거래처코드·사업자번호로 검색하세요.'}
                </p>
                {hospitalSearch.trim() && (
                  <button type="button" css={btnPrimary} onClick={() => setShowNewHospitalModal(true)}>
                    추가 요청
                  </button>
                )}
              </div>
            ) : (
              hospitalSearchResult.map((h) => (
                <button
                  key={h.id}
                  type="button"
                  data-selected={selectedHospitalId === h.id}
                  onClick={() => setSelectedHospitalId(h.id)}
                >
                  {h.name}
                  {h.accountCode && (
                    <span css={css({ marginLeft: 8, fontSize: 13, color: theme.colors.textMuted })}>
                      {h.accountCode}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
          {selectedHospitalId && (
            <div css={fieldStyles}>
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
          <button
            type="button"
            css={btnPrimary}
            onClick={handleSubmitExisting}
            disabled={!selectedHospitalId}
          >
            요청 보내기
          </button>
        </section>
      </div>

      {successText && <div css={successMsg}>{successText}</div>}

      {showNewHospitalModal && (
        <div
          css={modalOverlay}
          onClick={() => setShowNewHospitalModal(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-hospital-modal-title"
        >
          <div css={modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 id="new-hospital-modal-title" css={modalTitle}>
              존재하지 않는 병의원 추가 요청
            </h2>
            <div css={fieldStyles}>
              <label htmlFor="modal-hospital-name">병의원명 *</label>
              <input
                id="modal-hospital-name"
                type="text"
                placeholder="병의원 이름"
                value={newHospitalName}
                onChange={(e) => setNewHospitalName(e.target.value)}
              />
            </div>
            <div css={fieldStyles}>
              <label htmlFor="modal-business-number">사업자번호 *</label>
              <input
                id="modal-business-number"
                type="text"
                placeholder="000-00-00000"
                value={newBusinessNumber}
                onChange={(e) => setNewBusinessNumber(e.target.value)}
              />
            </div>
            <div css={fieldStyles}>
              <label htmlFor="modal-address">주소 *</label>
              <input
                id="modal-address"
                type="text"
                placeholder="주소"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
            </div>
            <div css={fieldStyles}>
              <label htmlFor="modal-representative">대표자명 *</label>
              <input
                id="modal-representative"
                type="text"
                placeholder="대표자명"
                value={newRepresentativeName}
                onChange={(e) => setNewRepresentativeName(e.target.value)}
              />
            </div>
            <div css={fieldStyles}>
              <label htmlFor="modal-request-message">요청 문의 (선택)</label>
              <textarea
                id="modal-request-message"
                placeholder="제약사에 전달할 메시지"
                value={newRequestMessage}
                onChange={(e) => setNewRequestMessage(e.target.value)}
                rows={2}
              />
            </div>
            <div css={modalActions}>
              <button type="button" css={btnSecondary} onClick={() => setShowNewHospitalModal(false)}>
                취소
              </button>
              <button type="button" css={btnPrimary} onClick={handleSubmitNew} disabled={!canSubmitNew}>
                요청 보내기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
